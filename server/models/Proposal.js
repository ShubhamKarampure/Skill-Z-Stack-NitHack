// src/models/Proposal.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const proposalSchema = new Schema(
  {
    proposalId: {
      type: String,
      required: true,
      unique: true
    },
    proposer: {
      type: String,
      required: true,
      lowercase: true
    },
    action: {
      type: String,
      enum: ['AccreditIssuer', 'RevokeIssuer', 'SuspendIssuer', 'UpdateParameters'],
      required: true
    },
    targetIssuer: {
      type: String,
      required: true,
      lowercase: true
    },
    instituteName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    forVotes: {
      type: Number,
      default: 0
    },
    againstVotes: {
      type: Number,
      default: 0
    },
    abstainVotes: {
      type: Number,
      default: 0
    },
    state: {
      type: String,
      enum: ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'],
      default: 'Pending'
    },
    startBlock: Number,
    endBlock: Number,
    eta: Number,
    transactionHash: String,
    executionTxHash: String,
    votes: [{
      voter: String,
      support: Number, // 0: Against, 1: For, 2: Abstain
      votes: Number,
      reason: String,
      votedAt: Date
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    executedAt: Date
  },
  {
    timestamps: true
  }
);

// Indexes
proposalSchema.index({ proposalId: 1 }, { unique: true });
proposalSchema.index({ targetIssuer: 1 });
proposalSchema.index({ state: 1, createdAt: -1 });

const ProposalModel = mongoose.model('Proposal', proposalSchema);

export default ProposalModel;
