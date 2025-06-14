import { Schema, model, Types, Document } from "mongoose";

export interface IJobSkillRequirement {
  skill: Types.ObjectId;
  minRating: number;
}

export interface IJob extends Document {
  title: string;
  description: string;
  requiredSkills: IJobSkillRequirement[];
  postedBy: Types.ObjectId;
  contactInfo: {
    email: string;
    company: string;
    phone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const JobSkillRequirementSchema = new Schema<IJobSkillRequirement>({
  skill: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
  minRating: { type: Number, required: true, min: 1, max: 10 },
});

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [JobSkillRequirementSchema],
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contactInfo: {
      email: { type: String, required: true },
      company: { type: String, required: true },
      phone: { type: String, required: false },
    },
  },
  { timestamps: true },
);

export default model<IJob>("Job", JobSchema);
