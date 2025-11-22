// src/routes/userRoutes.js
import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import UserModel from '../models/User.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, requireRole(['admin']), async (req, res) => {
    try {
        const { page = 1, limit = 20, role } = req.query;
        const query = role ? { role } : {};

        const users = await UserModel.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await UserModel.countDocuments(query);

        res.status(200).json({
            success: true,
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get user by wallet address
router.get('/wallet/:address', authenticate, async (req, res) => {
    try {
        const user = await UserModel.findOne({
            walletAddress: req.params.address.toLowerCase()
        }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Deactivate user (admin only)
router.post('/deactivate/:id', authenticate, requireRole(['admin']), async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        ).select('-password');

        res.status(200).json({ success: true, message: 'User deactivated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
