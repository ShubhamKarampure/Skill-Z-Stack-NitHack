// src/models/AuditLog.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const auditLogSchema = new Schema(
    {
        action: {
            type: String,
            required: true,
            enum: [
                'USER_REGISTERED',
                'USER_LOGIN',
                'ISSUER_REGISTERED',
                'ISSUER_ACCREDITED',
                'ISSUER_SUSPENDED',
                'CREDENTIAL_ISSUED',
                'CREDENTIAL_REVOKED',
                'CREDENTIAL_VERIFIED',
                'PROPOSAL_CREATED',
                'VOTE_CAST'
            ]
        },
        performedBy: {
            userId: Schema.Types.ObjectId,
            walletAddress: String,
            role: String
        },
        targetEntity: {
            entityType: String, // 'user', 'credential', 'issuer', 'proposal'
            entityId: String
        },
        details: Schema.Types.Mixed,
        transactionHash: String,
        ipAddress: String,
        timestamp: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes for querying
auditLogSchema.index({ 'performedBy.walletAddress': 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ transactionHash: 1 });

const AuditLogModel = mongoose.model('AuditLog', auditLogSchema);

export default AuditLogModel;
