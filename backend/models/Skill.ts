import { Schema, model, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true, unique: true },
});

export default model<ISkill>("Skill", SkillSchema);
