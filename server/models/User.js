// src/models/User.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // Common fields
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'institute', 'employer', 'admin'],
      required: true
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    },

    // Student-specific fields
    studentData: {
      credentials: [{
        type: String  // Token IDs
      }],
      instituteId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      isVerifiedByInstitute: {
        type: Boolean,
        default: false
      },
      graduationYear: Number,
      major: String,
      gpa: Number,
      zkpProofs: [{
        proofType: String,
        proofHash: String,
        createdAt: Date
      }]
    },

    // Institute-specific fields
    instituteData: {
      isRegistered: {
        type: Boolean,
        default: false
      },
      isAccredited: {
        type: Boolean,
        default: false
      },
      isSuspended: {
        type: Boolean,
        default: false
      },
      registrationTxHash: String,
      accreditationDate: Date,
      accreditationTxHash: String,
      suspensionReason: String,
      suspensionTxHash: String,
      issuedCredentials: [{
        type: String  // Token IDs
      }],
      instituteMetadata: {
        description: String,
        address: String,
        website: String,
        logo: String,
        establishedYear: Number,
        accreditationBody: String
      }
    },

    // Employer-specific fields
    employerData: {
      companyName: String,
      industry: String,
      website: String,
      verificationHistory: [{
        tokenId: String,
        verifiedAt: Date,
        result: Object
      }]
    },

    // Admin-specific fields
    adminData: {
      permissions: [{
        type: String,
        enum: ['manage_users', 'accredit_issuers', 'suspend_issuers', 'view_analytics']
      }],
      actionHistory: [{
        action: String,
        targetUser: String,
        timestamp: Date,
        txHash: String
      }]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ role: 1 });

// Virtual for credential count
userSchema.virtual('credentialCount').get(function () {
  return this.studentData?.credentials?.length || 0;
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
