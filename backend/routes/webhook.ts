import express from "express";
import { User } from "../models";

const router = express.Router();

// POST /user-created - Webhook endpoint for Clerk user creation
router.post("/user-created", express.json(), async (req, res) => {
	try {
		const { data } = req.body;

		const { id, email_addresses, first_name, last_name, username } = data;

		// Extract the primary email address
		const primaryEmail = email_addresses?.[0]?.email_address;

		if (!primaryEmail) {
			return res.status(400).json({ error: "No email address provided" });
		}

		// Create the user name from available data
		const name =
			[first_name, last_name].filter(Boolean).join(" ") || username || "";

		// Check if user already exists
		const existingUser = await User.findOne({ clerkId: id });
		if (existingUser) {
			console.log(`User with Clerk ID ${id} already exists`);
			return res.status(200).send("OK");
		}

		// Create new user in database
		await User.create({
			clerkId: id,
			name,
			email: primaryEmail,
			contactInfo: { email: primaryEmail },
			skills: [],
			availableForHire: false,
		});

		console.log(`New user created: ${name} (${primaryEmail})`);
		res.status(200).send("OK");
	} catch (error) {
		console.error("Error creating user from webhook:", error);
		res.status(500).json({ error: "Failed to create user" });
	}
});

export default router;
