import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // Common fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: {
      type: String,
      enum: ["student", "institute", "daoMember"],
      required: true,
    },

    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },

    //Student fields
    studentData: {
      instituteId: {
        type: Schema.Types.ObjectId,
        ref: "User", 
      },
      isVerifiedByInstitute: {
        type: Boolean,
        default: false,
      },
      zkpProof: {
        type: String, 
      },
    },

    //Institute fields
    instituteData: {
      isVerifiedByDAO: { type: Boolean, default: false },

      daoVerificationProposalId: {
        type: Schema.Types.ObjectId,
        ref: "Proposal",
      },

      instituteMetadata: {
        type: Object, // address, details, documents, etc.
      },
    },

    //DAO member fields
    daoData: {
      memberSince: { type: Date },

      votingHistory: [
        {
          proposalId: {
            type: Schema.Types.ObjectId,
            ref: "Proposal",
          },
          voted: Boolean,
        },
      ],
    },
  },

  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
