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

export default router;
