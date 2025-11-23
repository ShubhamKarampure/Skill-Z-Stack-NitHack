// src/routes/issuerRoutes.js
import express from 'express';
import {
    registerIssuer,
    accreditIssuer,
    getIssuer,
    getAllAccreditedIssuers,
    checkAccreditation,
    suspendIssuer,
    getAllInstitutes,           // NEW
    getInstituteById,           // NEW
    quickAccreditInstitute,     // NEW
    getInstituteStats           // NEW
} from '../controllers/issuerController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateAddress } from '../middleware/validation.js';

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all accredited issuers (for public verification)
router.get('/all', getAllAccreditedIssuers);

// Get specific issuer details
router.get('/:address', validateAddress, getIssuer);

// Check accreditation status
router.get('/:address/accreditation', validateAddress, checkAccreditation);

// =====================================================
// ADMIN ROUTES (Protected)
// =====================================================

// Get all institutes (accredited and non-accredited)
router.get(
    '/admin/institutes',
    authenticate,
    requireRole(['admin']),
    getAllInstitutes
);

// Get institute statistics for dashboard
router.get(
    '/admin/stats',
    authenticate,
    requireRole(['admin']),
    getInstituteStats
);

// Get specific institute by ID
router.get(
    '/admin/institute/:instituteId',
    authenticate,
    requireRole(['admin']),
    getInstituteById
);

// Quick accredit (register + accredit in one call)
router.post(
    '/admin/quick-accredit',
    authenticate,
    requireRole(['admin']),
    quickAccreditInstitute
);

// Traditional two-step process
router.post(
    '/register',
    authenticate,
    requireRole(['admin']),
    registerIssuer
);

router.post(
    '/accredit',
    authenticate,
    requireRole(['admin']),
    accreditIssuer
);

router.post(
    '/suspend',
    authenticate,
    requireRole(['admin']),
    suspendIssuer
);

export default router;
