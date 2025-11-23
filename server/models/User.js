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

      // Array of institutes the student is enrolled in
      enrollments: [{
        instituteId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        instituteName: String,
        instituteWalletAddress: String,
        enrolledAt: {
          type: Date,
          default: Date.now
        },
        isActive: {
          type: Boolean,
          default: true
        }
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

      // Array of students enrolled in this institute
      enrolledStudents: [{
        studentId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        studentName: String,
        studentWalletAddress: String,
        enrolledAt: {
          type: Date,
          default: Date.now
        },
        isActive: {
          type: Boolean,
          default: true
        }
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
userSchema.index({ 'studentData.enrollments.instituteId': 1 });
userSchema.index({ 'instituteData.enrolledStudents.studentId': 1 });

// Virtual for credential count
userSchema.virtual('credentialCount').get(function () {
  return this.studentData?.credentials?.length || 0;
});

// Virtual for enrollment count
userSchema.virtual('enrollmentCount').get(function () {
  return this.studentData?.enrollments?.length || 0;
});

// Virtual for enrolled student count (for institutes)
userSchema.virtual('enrolledStudentCount').get(function () {
  return this.instituteData?.enrolledStudents?.length || 0;
});

// Instance method: Check if student is enrolled in a specific institute
userSchema.methods.isEnrolledIn = function (instituteId) {
  if (!this.studentData?.enrollments) return false;

  return this.studentData.enrollments.some(
    enrollment => enrollment.instituteId.toString() === instituteId.toString() && enrollment.isActive
  );
};

// Instance method: Get active enrollments
userSchema.methods.getActiveEnrollments = function () {
  if (!this.studentData?.enrollments) return [];

  return this.studentData.enrollments.filter(enrollment => enrollment.isActive);
};

// Instance method: Check if institute has enrolled a specific student
userSchema.methods.hasEnrolledStudent = function (studentId) {
  if (!this.instituteData?.enrolledStudents) return false;

  return this.instituteData.enrolledStudents.some(
    student => student.studentId.toString() === studentId.toString() && student.isActive
  );
};

// Instance method: Get active enrolled students (for institutes)
userSchema.methods.getActiveStudents = function () {
  if (!this.instituteData?.enrolledStudents) return [];

  return this.instituteData.enrolledStudents.filter(student => student.isActive);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
