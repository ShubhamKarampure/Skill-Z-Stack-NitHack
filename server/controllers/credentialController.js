// src/controllers/credentialController.js
import credentialService from "../blockchain/services/credentialService.js";
import UserModel from "../models/User.js";
import CredentialModel from "../models/Credential.js";

// --- REFRACTORED: STEP 1 - PREPARE ISSUE ---
// Generates the raw transaction data for the frontend to sign
export const prepareIssueCredential = async (req, res) => {
  try {
    const {
      holderAddress,
      credentialType,
      metadataURI,
      expirationDate,
      revocable,
      credentialData,
    } = req.body;

    // The issuer is the logged-in user (Institute)
    const issuerAddress = req.user.walletAddress;

    if (!holderAddress || !metadataURI) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Call service to generate raw transaction object ONLY
    const txData = await credentialService.prepareIssueCredential(
      issuerAddress,
      holderAddress,
      {
        credentialType: credentialType || 0,
        metadataURI,
        expirationDate: expirationDate || 0,
        revocable: revocable !== undefined ? revocable : true,
        ...credentialData,
      }
    );

    return res.status(200).json({
      success: true,
      step: "prepare",
      txData,
    });
  } catch (error) {
    console.error("Prepare Issue Credential Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- REFRACTORED: STEP 2 - FINALIZE ISSUE ---
// Called after the frontend successfully broadcasts the transaction
export const finalizeIssueCredential = async (req, res) => {
  try {
    const {
      txHash,
      tokenId, // The frontend must parse this from the TransactionReceipt logs
      blockNumber,
      holderAddress,
      metadataURI,
      metadata,
      credentialType,
    } = req.body;

    const issuerAddress = req.user.walletAddress;

    if (!txHash || !tokenId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Transaction hash and Token ID are required",
        });
    }

    // Save metadata to database
    const credential = await CredentialModel.create({
      tokenId,
      holder: holderAddress.toLowerCase(),
      issuer: issuerAddress.toLowerCase(),
      credentialType: credentialType || 0,
      metadataURI,
      metadata,
      transactionHash: txHash,
      blockNumber: blockNumber,
      issuedAt: new Date(),
    });

    // Update user's credentials list
    await UserModel.findOneAndUpdate(
      { walletAddress: holderAddress.toLowerCase() },
      { $push: { "studentData.credentials": tokenId } }
    );

    return res.status(201).json({
      success: true,
      message: "Credential finalized and saved",
      credential,
    });
  } catch (error) {
    console.error("Finalize Issue Credential Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- REFRACTORED: STEP 1 - PREPARE REVOKE ---
export const prepareRevokeCredential = async (req, res) => {
  try {
    const { tokenId, reason } = req.body;
    const issuerAddress = req.user.walletAddress;

    const txData = await credentialService.prepareRevokeCredential(
      tokenId,
      issuerAddress,
      reason
    );

    return res.status(200).json({ success: true, step: "prepare", txData });
  } catch (error) {
    console.error("Prepare Revoke Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- REFRACTORED: STEP 2 - FINALIZE REVOKE ---
export const finalizeRevokeCredential = async (req, res) => {
  try {
    const { tokenId, reason, txHash } = req.body;

    await CredentialModel.findOneAndUpdate(
      { tokenId },
      {
        isRevoked: true,
        revocationReason: reason,
        revokedAt: new Date(),
        revocationTxHash: txHash,
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Revocation finalized" });
  } catch (error) {
    console.error("Finalize Revoke Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- READ-ONLY METHODS (UNCHANGED) ---

export const getCredential = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const credential = await credentialService.getCredential(tokenId);
    const metadata = await CredentialModel.findOne({ tokenId });

    return res.status(200).json({
      success: true,
      data: { credential: { ...credential, metadata } },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getHolderCredentials = async (req, res) => {
  try {
    const { address } = req.params;
    const tokenIds = await credentialService.getHolderCredentials(address);
    const credentials = [];

    for (const tokenId of tokenIds) {
      try {
        const onChainData = await credentialService.getCredential(tokenId);
        const metadata = await CredentialModel.findOne({ tokenId });
        if (metadata) {
          credentials.push({ ...onChainData, metadata });
        }
      } catch (err) {
        const metadata = await CredentialModel.findOne({ tokenId });
        if (metadata) {
          credentials.push({
            tokenId,
            status: "SYNC_ERROR",
            isRevoked: true,
            metadata,
          });
        }
      }
    }

    return res
      .status(200)
      .json({
        success: true,
        data: { count: credentials.length, credentials },
      });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getInstituteTemplates = async (req, res) => {
  try {
    const walletAddress = req.user.walletAddress.toLowerCase();
    const templates = await CredentialModel.find({
      issuer: walletAddress,
      holder: walletAddress,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: templates });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getIssuedCredentials = async (req, res) => {
  try {
    const issuerAddress = req.user.walletAddress.toLowerCase();
    const credentials = await CredentialModel.find({
      issuer: issuerAddress,
      holder: { $ne: issuerAddress },
    }).sort({ issuedAt: -1 });

    return res.status(200).json({ success: true, data: credentials });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
