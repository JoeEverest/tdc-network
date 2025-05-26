// Skill model for Mongoose/TypeScript
import { Schema, model, Document } from "mongoose";

export interface ISkill extends Document {
	name: string;
	rating: number; // between 1 and 10
}

const SkillSchema = new Schema<ISkill>({
	name: { type: String, required: true, unique: true },
	rating: { type: Number, required: true, min: 1, max: 10 },
});

export default model<ISkill>("Skill", SkillSchema);
