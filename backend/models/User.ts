// User (Member) model for Mongoose/TypeScript
import { Schema, model, Types, Document } from "mongoose";

export interface ISkillEntry {
	skill: Types.ObjectId;
	rating: number;
	endorsements: Types.ObjectId[]; // Users who endorsed this skill
}

export interface IUser extends Document {
	clerkId: string; // Clerk authentication ID
	name: string;
	email: string;
	skills: ISkillEntry[];
	availableForHire: boolean;
	contactInfo: {
		email?: string;
		phone?: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

const SkillEntrySchema = new Schema<ISkillEntry>({
	skill: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
	rating: { type: Number, required: true, min: 1, max: 10 },
	endorsements: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const UserSchema = new Schema<IUser>(
	{
		clerkId: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		skills: [SkillEntrySchema],
		availableForHire: { type: Boolean, default: false },
		contactInfo: { type: Object, default: {} },
	},
	{ timestamps: true }
);

export default model<IUser>("User", UserSchema);
