// src/routes/authRoutes.js
import express from 'express';
import {
    register,
    login,
    getProfile,
    updateProfile
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post("/login-wallet", authController.loginWithWallet);
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Logout (optional - mainly handled on client side with JWT)
router.post('/logout', authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

export default router;
