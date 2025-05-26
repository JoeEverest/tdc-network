import { Schema, model, Types, Document } from "mongoose";

export interface IEndorsement extends Document {
  skill: Types.ObjectId;
  endorsedUser: Types.ObjectId;
  endorsedBy: Types.ObjectId;
  createdAt: Date;
}

const EndorsementSchema = new Schema<IEndorsement>(
  {
    skill: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
    endorsedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    endorsedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default model<IEndorsement>("Endorsement", EndorsementSchema);
