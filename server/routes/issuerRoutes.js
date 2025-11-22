// src/routes/issuerRoutes.js
import express from 'express';
import {
    registerIssuer,
    accreditIssuer,
    getIssuer,
    getAllAccreditedIssuers,
    checkAccreditation,
    suspendIssuer
} from '../controllers/issuerController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateAddress } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/all', getAllAccreditedIssuers);
router.get('/:address', validateAddress, getIssuer);
router.get('/:address/accreditation', validateAddress, checkAccreditation);

// Protected routes - Admin only
router.post('/register', authenticate, requireRole(['admin']), registerIssuer);
router.post('/accredit', authenticate, requireRole(['admin']), accreditIssuer);
router.post('/suspend', authenticate, requireRole(['admin']), suspendIssuer);

export default router;
