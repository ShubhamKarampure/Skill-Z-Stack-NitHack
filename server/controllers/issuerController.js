// src/controllers/issuerController.js
import issuerService from "../blockchain/services/issuerService.js";
import UserModel from "../models/User.js";

// --- REFRACTORED: REGISTER ---

export const prepareRegisterIssuer = async (req, res) => {
  try {
    const { name, metadataURI } = req.body;
    // The user initiating the transaction (usually the institute itself)
    
    const targetIssuerAddress = req.body.issuerAddress;
    const senderAddress = req.user?.walletAddress;

    if (!targetIssuerAddress || !name || !metadataURI || !senderAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const txData = await issuerService.prepareRegisterIssuer(
      senderAddress,
      targetIssuerAddress,
      name,
      metadataURI
    );

    return res.status(200).json({ success: true, step: "prepare", txData });
  } catch (error) {
    console.error("Prepare Register Issuer Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const finalizeRegisterIssuer = async (req, res) => {
  try {
    const { issuerAddress, txHash } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { walletAddress: issuerAddress.toLowerCase() },
      {
        "instituteData.isRegistered": true,
        "instituteData.registrationTxHash": txHash,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Issuer registered successfully",
      user: user?.instituteData,
    });
  } catch (error) {
    console.error("Finalize Register Issuer Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- REFRACTORED: ACCREDIT ---

export const prepareAccreditIssuer = async (req, res) => {
  try {
    const { issuerAddress } = req.body;
    // The Admin calls this
    const adminAddress = req.user.walletAddress;

    const txData = await issuerService.prepareAccreditIssuer(
      adminAddress,
      issuerAddress
    );

    return res.status(200).json({ success: true, step: "prepare", txData });
  } catch (error) {
    console.error("Prepare Accredit Issuer Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const finalizeAccreditIssuer = async (req, res) => {
  try {
    const { issuerAddress, txHash } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { walletAddress: issuerAddress.toLowerCase() },
      {
        "instituteData.isAccredited": true,
        "instituteData.accreditationDate": new Date(),
        "instituteData.accreditationTxHash": txHash,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Accreditation finalized",
      user: user?.instituteData,
    });
  } catch (error) {
    console.error("Finalize Accredit Issuer Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- REFRACTORED: SUSPEND ---

export const prepareSuspendIssuer = async (req, res) => {
  try {
    const { issuerAddress, reason } = req.body;
    const adminAddress = req.user.walletAddress;

    const txData = await issuerService.prepareSuspendIssuer(
      adminAddress,
      issuerAddress,
      reason
    );

    return res.status(200).json({ success: true, step: "prepare", txData });
  } catch (error) {
    console.error("Prepare Suspend Issuer Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const finalizeSuspendIssuer = async (req, res) => {
  try {
    const { issuerAddress, reason, txHash } = req.body;

    await UserModel.findOneAndUpdate(
      { walletAddress: issuerAddress.toLowerCase() },
      {
        "instituteData.isSuspended": true,
        "instituteData.suspensionReason": reason,
        "instituteData.suspensionTxHash": txHash,
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Suspension finalized" });
  } catch (error) {
    console.error("Finalize Suspend Issuer Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- READ OPERATIONS (UNCHANGED) ---

export const getIssuer = async (req, res) => {
  try {
    const { address } = req.params;
    const issuer = await issuerService.getIssuer(address);
    const user = await UserModel.findOne({
      walletAddress: address.toLowerCase(),
    }).select("-password");

    return res
      .status(200)
      .json({ success: true, issuer, user: user?.instituteData });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllAccreditedIssuers = async (req, res) => {
  try {
    const issuers = await issuerService.getAllAccreditedIssuers();
    return res
      .status(200)
      .json({ success: true, count: issuers.length, issuers });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const checkAccreditation = async (req, res) => {
  try {
    const { address } = req.params;
    const isAccredited = await issuerService.isAccredited(address);
    return res.status(200).json({ success: true, address, isAccredited });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllInstitutes = async (req, res) => {
  try {
    const { page = 1, limit = 20, accredited, suspended } = req.query;
    const filter = { role: "institute" };
    if (accredited !== undefined)
      filter["instituteData.isAccredited"] = accredited === "true";
    if (suspended !== undefined)
      filter["instituteData.isSuspended"] = suspended === "true";

    const institutes = await UserModel.find(filter)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await UserModel.countDocuments(filter);

    const accreditedInstitutes = institutes.filter(
      (inst) =>
        inst.instituteData?.isAccredited && !inst.instituteData?.isSuspended
    );
    const pendingInstitutes = institutes.filter(
      (inst) =>
        inst.instituteData?.isRegistered && !inst.instituteData?.isAccredited
    );
    const unregisteredInstitutes = institutes.filter(
      (inst) => !inst.instituteData?.isRegistered
    );
    const suspendedInstitutes = institutes.filter(
      (inst) => inst.instituteData?.isSuspended
    );

    return res.status(200).json({
      success: true,
      total: count,
      page: parseInt(page),
      institutes: {
        all: institutes,
        accredited: accreditedInstitutes,
        pending: pendingInstitutes,
        unregistered: unregisteredInstitutes,
        suspended: suspendedInstitutes,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getInstituteStats = async (req, res) => {
  try {
    const totalInstitutes = await UserModel.countDocuments({
      role: "institute",
    });
    const accredited = await UserModel.countDocuments({
      role: "institute",
      "instituteData.isAccredited": true,
      "instituteData.isSuspended": false,
    });
    const pending = await UserModel.countDocuments({
      role: "institute",
      "instituteData.isRegistered": true,
      "instituteData.isAccredited": false,
    });
    const unregistered = await UserModel.countDocuments({
      role: "institute",
      "instituteData.isRegistered": { $ne: true },
    });
    const suspended = await UserModel.countDocuments({
      role: "institute",
      "instituteData.isSuspended": true,
    });

    return res.status(200).json({
      success: true,
      stats: {
        total: totalInstitutes,
        accredited,
        pending,
        unregistered,
        suspended,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getInstituteById = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const institute = await UserModel.findById(instituteId).select("-password");
    if (!institute || institute.role !== "institute") {
      return res
        .status(404)
        .json({ success: false, message: "Institute not found" });
    }
    return res.status(200).json({ success: true, institute });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
