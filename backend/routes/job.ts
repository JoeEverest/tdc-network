import express from "express";
import { Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { Job, User } from "../models";
import mongoose from "mongoose";

const router = express.Router();

// POST /jobs - Create a new job
router.post("/", requireAuth, async (req: any, res: Response) => {
	try {
		const { userId } = req.auth;
		const { title, description, requiredSkills } = req.body;

		if (!title || !description) {
			return res
				.status(400)
				.json({ error: "Title and description are required" });
		}

		if (
			!requiredSkills ||
			!Array.isArray(requiredSkills) ||
			requiredSkills.length === 0
		) {
			return res.status(400).json({
				error: "At least one required skill must be specified",
			});
		}

		for (const skill of requiredSkills) {
			if (
				!skill.skillId ||
				!skill.minRating ||
				skill.minRating < 1 ||
				skill.minRating > 10
			) {
				return res.status(400).json({
					error: "Each required skill must have a skillId and a minRating between 1 and 10",
				});
			}
		}

		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const formattedSkills = requiredSkills.map((skill: any) => ({
			skill: new mongoose.Types.ObjectId(skill.skillId),
			minRating: skill.minRating,
		}));

		const job = await Job.create({
			title,
			description,
			requiredSkills: formattedSkills,
			postedBy: user._id,
			applicants: [],
		});

		return res.status(201).json(job);
	} catch (err) {
		console.error("Error creating job:", err);
		return res.status(500).json({ error: "Failed to create job" });
	}
});

// PUT /jobs/:jobId - Update a job
router.put("/:jobId", requireAuth, async (req: any, res: Response) => {
	try {
		const { userId } = req.auth;
		const { jobId } = req.params;
		const { title, description, requiredSkills } = req.body;

		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).json({ error: "Job not found" });
		}

		if (job.postedBy.toString() !== user._id.toString()) {
			return res
				.status(403)
				.json({ error: "You can only update jobs you posted" });
		}

		const updateData: any = {};
		if (title) updateData.title = title;
		if (description) updateData.description = description;

		if (
			requiredSkills &&
			Array.isArray(requiredSkills) &&
			requiredSkills.length > 0
		) {
			for (const skill of requiredSkills) {
				if (
					!skill.skillId ||
					!skill.minRating ||
					skill.minRating < 1 ||
					skill.minRating > 10
				) {
					return res.status(400).json({
						error: "Each required skill must have a skillId and a minRating between 1 and 10",
					});
				}
			}

			updateData.requiredSkills = requiredSkills.map((skill: any) => ({
				skill: new mongoose.Types.ObjectId(skill.skillId),
				minRating: skill.minRating,
			}));
		}

		const updatedJob = await Job.findByIdAndUpdate(
			jobId,
			{ $set: updateData },
			{ new: true }
		);

		return res.json(updatedJob);
	} catch (err) {
		console.error("Error updating job:", err);
		return res.status(500).json({ error: "Failed to update job" });
	}
});

// DELETE /jobs/:jobId - Delete a job
router.delete("/:jobId", requireAuth, async (req: any, res: Response) => {
	try {
		const { userId } = req.auth;
		const { jobId } = req.params;

		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).json({ error: "Job not found" });
		}

		if (job.postedBy.toString() !== user._id.toString()) {
			return res
				.status(403)
				.json({ error: "You can only delete jobs you posted" });
		}

		// Delete job
		await Job.findByIdAndDelete(jobId);

		return res.json({ message: "Job deleted successfully" });
	} catch (err) {
		console.error("Error deleting job:", err);
		return res.status(500).json({ error: "Failed to delete job" });
	}
});

// GET /jobs - Get all jobs
router.get("/", async (_req: Request, res: Response) => {
	try {
		const jobs = await Job.find()
			.populate("postedBy", "name")
			.populate("requiredSkills.skill", "name");

		return res.json(jobs);
	} catch (err) {
		console.error("Error fetching jobs:", err);
		return res.status(500).json({ error: "Failed to fetch jobs" });
	}
});

// GET /jobs/user/:userId - Get all jobs by a user
router.get("/user/:userId", async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;

		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const jobs = await Job.find({ postedBy: user._id }).populate(
			"requiredSkills.skill",
			"name"
		);

		return res.json(jobs);
	} catch (err) {
		console.error("Error fetching user jobs:", err);
		return res.status(500).json({ error: "Failed to fetch user jobs" });
	}
});

export default router;
