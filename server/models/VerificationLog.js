// src/models/VerificationLog.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const verificationLogSchema = new Schema(
    {
        tokenId: {
            type: String,
            required: true,
            index: true
        },
        verifier: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        },
        verifierType: {
            type: String,
            enum: ['employer', 'institution', 'individual', 'system', 'anonymous'],
            default: 'anonymous'
        },
        result: {
            isValid: Boolean,
            exists: Boolean,
            isActive: Boolean,
            isExpired: Boolean,
            isRevoked: Boolean,
            issuerAccredited: Boolean
        },
        verifiedAt: {
            type: Date,
            default: Date.now,
            index: true
        },
        ipAddress: String,
        userAgent: String,
        purpose: {
            type: String,
            enum: ['employment', 'education', 'verification', 'other'],
            default: 'verification'
        }
    },
    {
        timestamps: true
    }
);

// Indexes for analytics
verificationLogSchema.index({ tokenId: 1, verifiedAt: -1 });
verificationLogSchema.index({ verifier: 1, verifiedAt: -1 });
verificationLogSchema.index({ verifiedAt: -1 });

const VerificationLogModel = mongoose.model('VerificationLog', verificationLogSchema);

export default VerificationLogModel;
