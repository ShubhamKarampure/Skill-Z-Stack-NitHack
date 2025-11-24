// src/controllers/authController.js
import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getWeb3 } from '../blockchain/utils/provider.js';


export const loginWithWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address required",
      });
    }

    // 1. Find user by normalized wallet address
    const user = await UserModel.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    // 2. If User Not Found -> Return 404 (Frontend handles this as "Go to Register")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered",
      });
    }

    // 3. If User Found -> Check if active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account deactivated",
      });
    }

    // 4. Generate Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        walletAddress: user.walletAddress,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Wallet login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      },
      token,
    });
  } catch (error) {
    console.error("Wallet Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    
    const { name, email, password, role, walletAddress } = req.body;

    // Validation
    if (!name || !email || !password || !role || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    // Validate role
    const validRoles = ['student', 'institute', 'employer', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: student, institute, employer, or admin'
      });
    }

    // Validate Ethereum address
    const web3 = getWeb3();
    if (!web3.utils.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Ethereum wallet address'
      });
    }

    // Check duplicates
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { walletAddress }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email or wallet address already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user data
    const newUserData = {
      name,
      email,
      password: hashedPassword,
      role,
      walletAddress: walletAddress.toLowerCase(), // Normalize address
      isActive: true,
      createdAt: new Date()
    };

    // Role-specific data
    if (role === 'student') {
      newUserData.studentData = {
        credentials: [],
        instituteId: null
      };
    }

    if (role === 'institute') {
      newUserData.instituteData = {
        isAccredited: false,
        accreditationDate: null,
        issuedCredentials: []
      };
    }

    if (role === 'employer') {
      newUserData.employerData = {
        companyName: req.body.companyName || '',
        verificationHistory: []
      };
    }

    const savedUser = await UserModel.create(newUserData);

    // Generate JWT
    const token = jwt.sign(
      {
        id: savedUser._id,
        role: savedUser.role,
        walletAddress: savedUser.walletAddress
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        walletAddress: savedUser.walletAddress
      },
      token
    });

  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact support.'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        walletAddress: user.walletAddress
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      },
      token
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Don't allow updating sensitive fields
    delete updates.password;
    delete updates.walletAddress;
    delete updates.role;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
