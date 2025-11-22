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

    // -------------------------
    // STUDENT FIELDS
    // -------------------------
    studentData: {
      instituteId: {
        type: Schema.Types.ObjectId,
        ref: "User", // institute user
      },
      isVerifiedByInstitute: {
        type: Boolean,
        default: false,
      },
      zkpProof: {
        type: String, // can store CID/IPFS hash or raw proof
      },
    },

    // -------------------------
    // INSTITUTE FIELDS
    // -------------------------
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

    // -------------------------
    // DAO MEMBER FIELDS
    // -------------------------
    daoData: {
      memberSince: { type: Date },

      votingHistory: [
        {
          proposalId: {
            type: Schema.Types.ObjectId,
            ref: "Proposal",
          },
          voted: Boolean,
          vote: {
            type: String,
            enum: ["for", "against"],
          },
        },
      ],
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
