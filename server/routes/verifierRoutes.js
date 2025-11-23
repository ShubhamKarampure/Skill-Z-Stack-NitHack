// src/routes/verifierRoutes.js
import express from 'express';
import {
    verifyCredential,
    quickValidate,
    verifyBatch,
    getVerificationHistory
} from '../controllers/verifierController.js';
import { verifyProof } from '../controllers/zkpController.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';
import { validateTokenId } from '../middleware/validation.js';

const router = express.Router();

// Public verification endpoints
router.get('/verify/:tokenId', optionalAuth, validateTokenId, verifyCredential);
router.get('/validate/:tokenId', validateTokenId, quickValidate);
router.post('/verify-batch', optionalAuth, verifyBatch);
router.post('/verify-zkp', optionalAuth, verifyProof);

// Protected routes
router.get('/history/:tokenId', authenticate, requireRole(['employer', 'admin']), validateTokenId, getVerificationHistory);

export default router;
