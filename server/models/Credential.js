// src/models/Credential.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const credentialSchema = new Schema(
    {
        tokenId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        holder: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        },
        issuer: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        },
        credentialType: {
            type: Number,
            required: true,
            enum: [0, 1, 2], // 0: DEGREE, 1: CERTIFICATE, 2: BADGE
            default: 0
        },
        credentialTypeName: {
            type: String,
            enum: ['DEGREE', 'CERTIFICATE', 'BADGE'],
            default: 'DEGREE'
        },
        metadataURI: {
            type: String,
            required: true
        },
        metadata: {
            name: String,
            description: String,
            image: String,
            major: String,
            graduationYear: Number,
            gpa: Number,
            honors: String,
            skills: [String],
            achievements: [String],
            additionalAttributes: Schema.Types.Mixed
        },
        transactionHash: {
            type: String,
            required: true
        },
        blockNumber: {
            type: Number,
            required: true
        },
        isRevoked: {
            type: Boolean,
            default: false
        },
        revocationReason: String,
        revokedAt: Date,
        revocationTxHash: String,
        expirationDate: {
            type: Date
        },
        issuedAt: {
            type: Date,
            default: Date.now
        },
        verificationCount: {
            type: Number,
            default: 0
        },
        lastVerifiedAt: Date
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
);

// Indexes
credentialSchema.index({ holder: 1, isRevoked: 1 });
credentialSchema.index({ issuer: 1, issuedAt: -1 });
credentialSchema.index({ tokenId: 1 }, { unique: true });

// Virtual for checking if expired
credentialSchema.virtual('isExpired').get(function () {
    if (!this.expirationDate) return false;
    return new Date() > this.expirationDate;
});

// Virtual for credential status
credentialSchema.virtual('status').get(function () {
    if (this.isRevoked) return 'REVOKED';
    if (this.isExpired) return 'EXPIRED';
    return 'ACTIVE';
});

const CredentialModel = mongoose.model('Credential', credentialSchema);

export default CredentialModel;
