import express from "express";
import { Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { User, Skill, Endorsement } from "../models";
import mongoose from "mongoose";

const router = express.Router();	// POST /endorsements - Endorse a user for a skill
router.post("/", requireAuth, async (req: any, res: Response) => {
	try {
		const { userId } = req.auth; 
		const { endorsedUserId, skillId } = req.body;

		
		if (!endorsedUserId || !skillId) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		
		if (userId === endorsedUserId) {
			return res.status(400).json({ error: "Cannot endorse yourself" });
		}

		
		const [endorsedUser, endorsingUser, skill] = await Promise.all([
			User.findOne({ clerkId: endorsedUserId }),
			User.findOne({ clerkId: userId }),
			Skill.findById(skillId),
		]);

		if (!endorsedUser) {
			return res.status(404).json({ error: "Endorsed user not found" });
		}

		if (!endorsingUser) {
			return res.status(404).json({ error: "Endorsing user not found" });
		}

		if (!skill) {
			return res.status(404).json({ error: "Skill not found" });
		}

		
		const hasSkill = endorsedUser.skills.some(
			(s) => s.skill.toString() === skillId
		);

		if (!hasSkill) {
			return res.status(400).json({
				error: "User does not have this skill in their profile",
			});
		}

		
		const existingEndorsement = await Endorsement.findOne({
			endorsedUser: endorsedUser._id,
			endorsedBy: endorsingUser._id,
			skill: skillId,
		});

		if (existingEndorsement) {
			return res.status(409).json({
				error: "You have already endorsed this user for this skill",
			});
		}

		
		const endorsement = await Endorsement.create({
			skill: skillId,
			endorsedUser: endorsedUser._id,
			endorsedBy: endorsingUser._id,
		});

		
		await User.updateOne(
			{
				_id: endorsedUser._id,
				"skills.skill": new mongoose.Types.ObjectId(skillId),
			},
			{
				$push: { "skills.$.endorsements": endorsingUser._id },
			}
		);

		return res.status(201).json(endorsement);
	} catch (err) {
		console.error("Error creating endorsement:", err);
		return res.status(500).json({ error: "Failed to create endorsement" });
	}
});

// GET /endorsements/for/:userId - Get endorsements received by a user
router.get("/for/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findOne({ clerkId: userId });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const endorsements = await Endorsement.find({ endorsedUser: user._id })
			.populate("skill", "name")
			.populate("endorsedBy", "name");

		return res.json(endorsements);
	} catch (err) {
		console.error("Error getting endorsements:", err);
		return res.status(500).json({ error: "Failed to get endorsements" });
	}
});

// GET /endorsements/by/:userId - Get endorsements given by a user
router.get("/by/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findOne({ clerkId: userId });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const endorsements = await Endorsement.find({ endorsedBy: user._id })
			.populate("skill", "name")
			.populate("endorsedUser", "name");

		return res.json(endorsements);
	} catch (err) {
		console.error("Error getting endorsements:", err);
		return res.status(500).json({ error: "Failed to get endorsements" });
	}
});

// DELETE /endorsements/:endorsementId - Delete an endorsement (only by the endorser)
router.delete("/:endorsementId", requireAuth, async (req: any, res) => {
	try {
		const { userId } = req.auth;
		const { endorsementId } = req.params;

		const endorsement = await Endorsement.findById(endorsementId);

		if (!endorsement) {
			return res.status(404).json({ error: "Endorsement not found" });
		}

		
		const endorsingUser = await User.findOne({ clerkId: userId });
		if (!endorsingUser) {
			return res.status(404).json({ error: "Endorsing user not found" });
		}

		
		if (endorsement.endorsedBy.toString() !== endorsingUser._id.toString()) {
			return res.status(403).json({
				error: "You can only delete endorsements you have given",
			});
		}

		
		await User.updateOne(
			{
				_id: endorsement.endorsedUser,
				"skills.skill": endorsement.skill,
			},
			{
				$pull: { "skills.$.endorsements": endorsingUser._id },
			}
		);

		// Delete the endorsement
		await Endorsement.findByIdAndDelete(endorsementId);

		return res
			.status(200)
			.json({ message: "Endorsement deleted successfully" });
	} catch (err) {
		console.error("Error deleting endorsement:", err);
		return res.status(500).json({ error: "Failed to delete endorsement" });
	}
});

export default router;
