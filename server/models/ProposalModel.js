import mongoose from "mongoose";

const { Schema } = mongoose;

const proposalSchema = new Schema(
  {
    instituteName: {
      type: String,
      required: true,
    },

    // Institute's blockchain wallet address
    instituteAddress: {
      type: String,
      required: true,
    },

    // DAO result (from on-chain or device)
    result: {
      type: String,
      enum: ["pending", "passed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ProposalModel = mongoose.model("Proposal", proposalSchema);

export default ProposalModel;
