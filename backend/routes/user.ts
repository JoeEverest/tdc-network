import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import { User, Skill } from "../models";
import mongoose from "mongoose";

const router = express.Router();

// Helper: get user by Clerk ID or create if not exists
async function findOrCreateUser(clerkId: string, profile: any) {
	let user = await User.findOne({ clerkId });
	if (!user) {
		user = await User.create({
			clerkId,
			name: profile.name || profile.username || "",
			email: profile.email,
			contactInfo: { email: profile.email },
			skills: [],
		});
	}
	return user;
}

// GET /users - Get all users
router.get("/", async (_req, res) => {
	try {
		const users = await User.find({})
			.populate('skills.skill', 'name')
			.select('-clerkId -email -contactInfo')
			.sort({ name: 1 });
		res.json(users);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

// GET /users/:userId - Get a specific user by Clerk ID
router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findOne({ clerkId: userId })
			.populate('skills.skill', 'name')
			.populate('skills.endorsements', 'name')
			.select('-clerkId -email -contactInfo');
		
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		
		res.json(user);
	} catch (error) {
		console.error('Error fetching user:', error);
		res.status(500).json({ error: "Failed to fetch user" });
	}
});

// GET /me - Get current user profile
router.get("/me", requireAuth, async (req: any, res) => {
	try {
		const { userId, sessionClaims } = req.auth;
		const user = await findOrCreateUser(userId, sessionClaims);
		res.json(user);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch user profile" });
	}
});

// PUT /me - Update profile info (name, availableForHire, contactInfo)
router.put("/me", requireAuth, async (req: any, res) => {
	try {
		const { userId } = req.auth;
		const { name, availableForHire, contactInfo } = req.body;
		const user = await User.findOneAndUpdate(
			{ clerkId: userId },
			{ $set: { name, availableForHire, contactInfo } },
			{ new: true }
		);
		res.json(user);
	} catch (err) {
		res.status(500).json({ error: "Failed to update profile" });
	}
});

// POST /me/skills - Add a skill (by name, with rating)
router.post("/me/skills", requireAuth, async (req: any, res) => {
	try {
		const { userId } = req.auth;
		const { skillName, rating } = req.body;
		let skill = await Skill.findOne({ name: skillName });
		if (!skill) {
			skill = await Skill.create({ name: skillName, rating });
		}
		const user = await User.findOneAndUpdate(
			{ clerkId: userId, "skills.skill": { $ne: skill._id } },
			{
				$push: {
					skills: { skill: skill._id, rating, endorsements: [] },
				},
			},
			{ new: true }
		);
		res.json(user);
	} catch (err) {
		res.status(500).json({ error: "Failed to add skill" });
	}
});

// PUT /me/skills/:skillId - Update skill rating
router.put("/me/skills/:skillId", requireAuth, async (req: any, res) => {
	try {
		const { userId } = req.auth;
		const { skillId } = req.params;
		const { rating } = req.body;
		const user = await User.findOneAndUpdate(
			{
				clerkId: userId,
				"skills.skill": new mongoose.Types.ObjectId(skillId),
			},
			{ $set: { "skills.$.rating": rating } },
			{ new: true }
		);
		res.json(user);
	} catch (err) {
		res.status(500).json({ error: "Failed to update skill rating" });
	}
});

// DELETE /me/skills/:skillId - Remove a skill
router.delete("/me/skills/:skillId", requireAuth, async (req: any, res) => {
	try {
		const { userId } = req.auth;
		const { skillId } = req.params;
		const user = await User.findOneAndUpdate(
			{ clerkId: userId },
			{
				$pull: {
					skills: { skill: new mongoose.Types.ObjectId(skillId) },
				},
			},
			{ new: true }
		);
		res.json(user);
	} catch (err) {
		res.status(500).json({ error: "Failed to remove skill" });
	}
});

// GET /search - Search users by skills and rating ranges
router.get("/search", async (req, res) => {
	try {
		const { skills, minRating, maxRating, availableForHire } = req.query;
		
		// Build the aggregation pipeline
		const pipeline: mongoose.PipelineStage[] = [];
		
		// Start with all users
		const initialMatch: Record<string, boolean | string | number> = {};
		
		// Filter by availableForHire if specified
		if (availableForHire !== undefined) {
			initialMatch.availableForHire = availableForHire === 'true';
		}
		
		pipeline.push({
			$match: initialMatch
		});
		
		// If skills are specified, filter users who have those skills
		if (skills) {
			const skillNames = Array.isArray(skills) ? skills : [skills];
			
			// First, get skill IDs from skill names
			const skillDocs = await Skill.find({ 
				name: { $in: skillNames.map((name) => new RegExp(name as string, 'i')) }
			});
			const skillIds = skillDocs.map(skill => skill._id);
			
			if (skillIds.length > 0) {
				pipeline.push({
					$match: {
						"skills.skill": { $in: skillIds }
					}
				});
			} else {
				// If no matching skills found, return empty result
				return res.json([]);
			}
		}
		
		// Filter by rating range if specified
		if (minRating !== undefined || maxRating !== undefined) {
			const ratingMatch: { $gte?: number; $lte?: number } = {};
			if (minRating !== undefined) {
				ratingMatch.$gte = parseInt(minRating as string);
			}
			if (maxRating !== undefined) {
				ratingMatch.$lte = parseInt(maxRating as string);
			}
			
			pipeline.push({
				$match: {
					"skills.rating": ratingMatch
				}
			});
		}
		
		// Populate skills and exclude sensitive information
		pipeline.push(
			{
				$lookup: {
					from: "skills",
					localField: "skills.skill",
					foreignField: "_id",
					as: "skillDetails"
				}
			},
			{
				$addFields: {
					skills: {
						$map: {
							input: "$skills",
							as: "userSkill",
							in: {
								skill: {
									$arrayElemAt: [
										{
											$filter: {
												input: "$skillDetails",
												cond: { $eq: ["$$this._id", "$$userSkill.skill"] }
											}
										},
										0
									]
								},
								rating: "$$userSkill.rating",
								endorsements: "$$userSkill.endorsements"
							}
						}
					}
				}
			},
			{
				$project: {
					clerkId: 0,
					email: 0,
					contactInfo: 0,
					skillDetails: 0
				}
			},
			{
				$sort: { name: 1 }
			}
		);
		
		const users = await User.aggregate(pipeline);
		res.json(users);
	} catch (error) {
		console.error('Error searching users:', error);
		res.status(500).json({ error: "Failed to search users" });
	}
});

export default router;
