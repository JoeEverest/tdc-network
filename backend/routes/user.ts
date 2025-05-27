import express, { Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getAuth } from "@clerk/express";
import { User, Skill } from "../models";
import mongoose from "mongoose";

const router = express.Router();

// GET /me - Get current user profile
router.get("/me", requireAuth, async (req: Request, res: Response) => {
	try {
		const { userId } = getAuth(req);

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		// Find existing user or create if doesn't exist
		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			// For the /me endpoint, we'll just return an error if user doesn't exist
			// User should be created via webhook when they sign up
			return res
				.status(404)
				.json({ error: "User not found. Please contact support." });
		}

		res.json(user);
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).json({ error: "Failed to fetch user profile" });
	}
});

// GET /users - Get all users
router.get("/", async (_req, res) => {
	try {
		const users = await User.find({})
			.populate("skills.skill", "name")
			.select("-clerkId -email -contactInfo")
			.sort({ name: 1 });
		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Failed to fetch users" });
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
			initialMatch.availableForHire = availableForHire === "true";
		}

		pipeline.push({
			$match: initialMatch,
		});

		// If skills are specified, filter users who have those skills
		if (skills) {
			const skillNames = Array.isArray(skills) ? skills : [skills];

			// First, get skill IDs from skill names
			const skillDocs = await Skill.find({
				name: {
					$in: skillNames.map(
						(name) => new RegExp(name as string, "i")
					),
				},
			});
			const skillIds = skillDocs.map((skill) => skill._id);

			if (skillIds.length > 0) {
				pipeline.push({
					$match: {
						"skills.skill": { $in: skillIds },
					},
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
					"skills.rating": ratingMatch,
				},
			});
		}

		// Populate skills and exclude sensitive information
		pipeline.push(
			{
				$lookup: {
					from: "skills",
					localField: "skills.skill",
					foreignField: "_id",
					as: "skillDetails",
				},
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
												cond: {
													$eq: [
														"$$this._id",
														"$$userSkill.skill",
													],
												},
											},
										},
										0,
									],
								},
								rating: "$$userSkill.rating",
								endorsements: "$$userSkill.endorsements",
							},
						},
					},
				},
			},
			{
				$project: {
					clerkId: 0,
					email: 0,
					contactInfo: 0,
					skillDetails: 0,
				},
			},
			{
				$sort: { name: 1 },
			}
		);

		const users = await User.aggregate(pipeline);
		res.json(users);
	} catch (error) {
		console.error("Error searching users:", error);
		res.status(500).json({ error: "Failed to search users" });
	}
});

// GET /users/:userId - Get a specific user by Clerk ID
router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId)
			.populate("skills.skill", "name")
			.populate("skills.endorsements", "name")
			.select("-clerkId -email -contactInfo");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).json({ error: "Failed to fetch user" });
	}
});

// PUT /me - Update profile info (name, availableForHire, contactInfo)
router.put("/me", requireAuth, async (req: Request, res: Response) => {
	try {
		const { userId } = getAuth(req);

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const { name, availableForHire, contactInfo } = req.body;
		const user = await User.findOneAndUpdate(
			{ clerkId: userId },
			{ $set: { name, availableForHire, contactInfo } },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).json({ error: "Failed to update profile" });
	}
});

// POST /me/skills - Add a skill (by name, with rating)
router.post("/me/skills", requireAuth, async (req: Request, res: Response) => {
	try {
		const { userId } = getAuth(req);

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const { skillName, rating } = req.body;
		let skill = await Skill.findOne({ name: skillName });
		if (!skill) {
			skill = await Skill.create({ name: skillName });
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

		if (!user) {
			return res
				.status(404)
				.json({ error: "User not found or skill already exists" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error adding skill:", error);
		res.status(500).json({ error: "Failed to add skill" });
	}
});

// PUT /me/skills/:skillId - Update skill rating
router.put(
	"/me/skills/:skillId",
	requireAuth,
	async (req: Request, res: Response) => {
		try {
			const { userId } = getAuth(req);

			if (!userId) {
				return res.status(401).json({ error: "Unauthorized" });
			}

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

			if (!user) {
				return res
					.status(404)
					.json({ error: "User or skill not found" });
			}

			res.json(user);
		} catch (error) {
			console.error("Error updating skill rating:", error);
			res.status(500).json({ error: "Failed to update skill rating" });
		}
	}
);

// DELETE /me/skills/:skillId - Remove a skill
router.delete(
	"/me/skills/:skillId",
	requireAuth,
	async (req: Request, res: Response) => {
		try {
			const { userId } = getAuth(req);

			if (!userId) {
				return res.status(401).json({ error: "Unauthorized" });
			}

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

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			res.json(user);
		} catch (error) {
			console.error("Error removing skill:", error);
			res.status(500).json({ error: "Failed to remove skill" });
		}
	}
);

export default router;
