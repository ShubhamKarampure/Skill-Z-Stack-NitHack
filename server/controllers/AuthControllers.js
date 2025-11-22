import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, walletAddress } = req.body;

    if (!name || !email || !password || !role || !walletAddress) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate role
    const validRoles = ["student", "institute", "daoMember"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    // Check duplicates
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { walletAddress }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or wallet address already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create base user object
    const newUserData = {
      name,
      email,
      password: hashedPassword,
      role,
      walletAddress,
    };

    // Attach role-specific sections
    if (role === "student") {
      newUserData.studentData = {
        instituteId: null,
        isVerifiedByInstitute: false,
        zkpProof: null,
      };
    }

    if (role === "institute") {
      newUserData.instituteData = {
        isVerifiedByDAO: false,
        daoVerificationProposalId: null,
        instituteMetadata: {},
      };
    }

    if (role === "daoMember") {
      newUserData.daoData = {
        memberSince: new Date(),
        votingHistory: [],
      };
    }

    const savedUser = await UserModel.create(newUserData);

    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        walletAddress: savedUser.walletAddress,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
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
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
