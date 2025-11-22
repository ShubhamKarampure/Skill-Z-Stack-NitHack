// src/routes/credentialRoutes.js
import express from 'express';
import {
    issueCredential,
    getCredential,
    getHolderCredentials,
    revokeCredential
} from '../controllers/credentialController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateTokenId, validateAddress } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/:tokenId', validateTokenId, getCredential);
router.get('/holder/:address', validateAddress, getHolderCredentials);

// Protected routes - Institute only
router.post('/issue', authenticate, requireRole(['institute', 'admin']), issueCredential);
router.post('/revoke', authenticate, requireRole(['institute', 'admin']), revokeCredential);

// Get credentials for authenticated user (student)
router.get('/my/credentials', authenticate, async (req, res) => {
    try {
        const { getHolderCredentials } = await import('../controllers/credentialController.js');
        req.params.address = req.user.walletAddress;
        return getHolderCredentials(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
