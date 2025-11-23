// src/controllers/enrollmentController.js
import UserModel from '../models/User.js';

// Student requests to enroll in an institute
export const requestEnrollment = async (req, res) => {
    try {
        const { instituteId } = req.body;
        const studentId = req.user.id; // From auth middleware

        // Validate student role
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can request enrollment'
            });
        }

        // Check if institute exists and is actually an institute
        const institute = await UserModel.findById(instituteId);
        if (!institute || institute.role !== 'institute') {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }

        // Check if institute is accredited
        if (!institute.instituteData?.isAccredited) {
            return res.status(400).json({
                success: false,
                message: 'This institute is not accredited yet'
            });
        }

        // Get student
        const student = await UserModel.findById(studentId);

        // Check if already enrolled
        if (student.isEnrolledIn(instituteId)) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this institute'
            });
        }

        // Add enrollment to student
        student.studentData.enrollments.push({
            instituteId: institute._id,
            instituteName: institute.name,
            instituteWalletAddress: institute.walletAddress,
            enrolledAt: new Date(),
            isActive: true
        });
        await student.save();

        // Add student to institute
        institute.instituteData.enrolledStudents.push({
            studentId: student._id,
            studentName: student.name,
            studentWalletAddress: student.walletAddress,
            enrolledAt: new Date(),
            isActive: true
        });
        await institute.save();

        return res.status(201).json({
            success: true,
            message: 'Successfully enrolled in institute',
            enrollment: {
                instituteId: institute._id,
                instituteName: institute.name,
                enrolledAt: new Date()
            }
        });

    } catch (error) {
        console.error('Request Enrollment Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to request enrollment',
            error: error.message
        });
    }
};

// Get student's enrollments
export const getMyEnrollments = async (req, res) => {
    try {
        const studentId = req.user.id;

        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can view enrollments'
            });
        }

        const student = await UserModel.findById(studentId)
            .populate('studentData.enrollments.instituteId', 'name email walletAddress instituteData.instituteMetadata');

        const activeEnrollments = student.getActiveEnrollments();

        return res.status(200).json({
            success: true,
            count: activeEnrollments.length,
            enrollments: activeEnrollments
        });

    } catch (error) {
        console.error('Get My Enrollments Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get enrollments',
            error: error.message
        });
    }
};

// Check enrollment status in a specific institute
export const checkEnrollmentStatus = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const studentId = req.user.id;

        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can check enrollment status'
            });
        }

        const student = await UserModel.findById(studentId);
        const isEnrolled = student.isEnrolledIn(instituteId);

        // Get enrollment details if enrolled
        let enrollmentDetails = null;
        if (isEnrolled) {
            enrollmentDetails = student.studentData.enrollments.find(
                e => e.instituteId.toString() === instituteId && e.isActive
            );
        }

        return res.status(200).json({
            success: true,
            isEnrolled,
            enrollment: enrollmentDetails
        });

    } catch (error) {
        console.error('Check Enrollment Status Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check enrollment status',
            error: error.message
        });
    }
};

// Get all students enrolled in institute (Institute view)
export const getEnrolledStudents = async (req, res) => {
    try {
        const instituteId = req.user.id;

        if (req.user.role !== 'institute') {
            return res.status(403).json({
                success: false,
                message: 'Only institutes can view enrolled students'
            });
        }

        const institute = await UserModel.findById(instituteId)
            .populate('instituteData.enrolledStudents.studentId', 'name email walletAddress');

        const activeStudents = institute.getActiveStudents();

        return res.status(200).json({
            success: true,
            count: activeStudents.length,
            students: activeStudents
        });

    } catch (error) {
        console.error('Get Enrolled Students Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get enrolled students',
            error: error.message
        });
    }
};

// Check if a specific student is enrolled (Institute view)
export const checkStudentEnrollment = async (req, res) => {
    try {
        const { studentId } = req.params;
        const instituteId = req.user.id;

        if (req.user.role !== 'institute') {
            return res.status(403).json({
                success: false,
                message: 'Only institutes can check student enrollment'
            });
        }

        const institute = await UserModel.findById(instituteId);
        const hasStudent = institute.hasEnrolledStudent(studentId);

        // Get student details if enrolled
        let studentDetails = null;
        if (hasStudent) {
            studentDetails = institute.instituteData.enrolledStudents.find(
                s => s.studentId.toString() === studentId && s.isActive
            );
        }

        return res.status(200).json({
            success: true,
            isEnrolled: hasStudent,
            student: studentDetails
        });

    } catch (error) {
        console.error('Check Student Enrollment Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check student enrollment',
            error: error.message
        });
    }
};

// Remove student from institute (Institute can revoke enrollment)
export const revokeEnrollment = async (req, res) => {
    try {
        const { studentId } = req.params;
        const instituteId = req.user.id;

        if (req.user.role !== 'institute') {
            return res.status(403).json({
                success: false,
                message: 'Only institutes can revoke enrollment'
            });
        }

        // Get institute and student
        const institute = await UserModel.findById(instituteId);
        const student = await UserModel.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check if student is enrolled
        if (!institute.hasEnrolledStudent(studentId)) {
            return res.status(400).json({
                success: false,
                message: 'Student is not enrolled in this institute'
            });
        }

        // Deactivate enrollment in student's record
        const studentEnrollmentIndex = student.studentData.enrollments.findIndex(
            e => e.instituteId.toString() === instituteId.toString() && e.isActive
        );
        if (studentEnrollmentIndex !== -1) {
            student.studentData.enrollments[studentEnrollmentIndex].isActive = false;
            await student.save();
        }

        // Deactivate student in institute's record
        const instituteStudentIndex = institute.instituteData.enrolledStudents.findIndex(
            s => s.studentId.toString() === studentId && s.isActive
        );
        if (instituteStudentIndex !== -1) {
            institute.instituteData.enrolledStudents[instituteStudentIndex].isActive = false;
            await institute.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Student enrollment revoked successfully'
        });

    } catch (error) {
        console.error('Revoke Enrollment Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to revoke enrollment',
            error: error.message
        });
    }
};

// Student leaves institute (self-unenroll)
export const leaveInstitute = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const studentId = req.user.id;

        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can leave institutes'
            });
        }

        const student = await UserModel.findById(studentId);
        const institute = await UserModel.findById(instituteId);

        if (!institute) {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }

        // Check if enrolled
        if (!student.isEnrolledIn(instituteId)) {
            return res.status(400).json({
                success: false,
                message: 'You are not enrolled in this institute'
            });
        }

        // Deactivate enrollment
        const enrollmentIndex = student.studentData.enrollments.findIndex(
            e => e.instituteId.toString() === instituteId && e.isActive
        );
        if (enrollmentIndex !== -1) {
            student.studentData.enrollments[enrollmentIndex].isActive = false;
            await student.save();
        }

        // Remove from institute's enrolled students
        const studentIndex = institute.instituteData.enrolledStudents.findIndex(
            s => s.studentId.toString() === studentId && s.isActive
        );
        if (studentIndex !== -1) {
            institute.instituteData.enrolledStudents[studentIndex].isActive = false;
            await institute.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully left the institute'
        });

    } catch (error) {
        console.error('Leave Institute Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to leave institute',
            error: error.message
        });
    }
};

// Get all available institutes for enrollment
export const getAvailableInstitutes = async (req, res) => {
    try {
        const institutes = await UserModel.find({
            role: 'institute',
            'instituteData.isAccredited': true,
            'instituteData.isSuspended': false,
            isActive: true
        }).select('name email walletAddress instituteData.instituteMetadata');

        return res.status(200).json({
            success: true,
            count: institutes.length,
            institutes
        });

    } catch (error) {
        console.error('Get Available Institutes Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get institutes',
            error: error.message
        });
    }
};
