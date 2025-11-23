// src/routes/credentialRoutes.js
import express from 'express';
import {
    issueCredential,
    getCredential,
    getHolderCredentials,
    revokeCredential,
    getInstituteTemplates, // Add this
    getIssuedCredentials // Add this
} from '../controllers/credentialController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateTokenId, validateAddress } from '../middleware/validation.js';

const router = express.Router();

// Protected routes - Institute only
router.post('/issue', authenticate, requireRole(['institute', 'admin']), issueCredential);
router.post('/revoke', authenticate, requireRole(['institute', 'admin']), revokeCredential);
router.get('/templates', authenticate, requireRole(['institute', 'admin']), getInstituteTemplates);
router.get('/issued', authenticate, requireRole(['institute', 'admin']), getIssuedCredentials);

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

// Public routes
router.get('/:tokenId', validateTokenId, getCredential);
router.get('/holder/:address', validateAddress, getHolderCredentials);

export default router;
