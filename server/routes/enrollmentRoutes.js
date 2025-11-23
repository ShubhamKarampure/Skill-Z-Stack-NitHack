// src/routes/enrollmentRoutes.js
import express from 'express';
import {
    requestEnrollment,
    getMyEnrollments,
    checkEnrollmentStatus,
    getEnrolledStudents,
    checkStudentEnrollment,
    revokeEnrollment,
    leaveInstitute,
    getAvailableInstitutes
} from '../controllers/enrollmentController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all available accredited institutes
router.get('/institutes', getAvailableInstitutes);

// =====================================================
// STUDENT ROUTES (Protected)
// =====================================================

// Student requests enrollment in an institute
router.post(
    '/request',
    authenticate,
    requireRole(['student']),
    requestEnrollment
);

// Get my enrollments
router.get(
    '/my-enrollments',
    authenticate,
    requireRole(['student']),
    getMyEnrollments
);

// Check enrollment status in a specific institute
router.get(
    '/status/:instituteId',
    authenticate,
    requireRole(['student']),
    checkEnrollmentStatus
);

// Leave an institute (self-unenroll)
router.delete(
    '/leave/:instituteId',
    authenticate,
    requireRole(['student']),
    leaveInstitute
);

// =====================================================
// INSTITUTE ROUTES (Protected)
// =====================================================

// Get all enrolled students (institute view)
router.get(
    '/students',
    authenticate,
    requireRole(['institute']),
    getEnrolledStudents
);

// Check if specific student is enrolled
router.get(
    '/students/:studentId',
    authenticate,
    requireRole(['institute']),
    checkStudentEnrollment
);

// Revoke student enrollment
router.delete(
    '/students/:studentId',
    authenticate,
    requireRole(['institute']),
    revokeEnrollment
);

export default router;
