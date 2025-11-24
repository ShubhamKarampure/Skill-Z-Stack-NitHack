// src/routes/credentialRoutes.js
import express from "express";
import {
  // Read
  getCredential,
  getHolderCredentials,
  getInstituteTemplates,
  getIssuedCredentials,

  // Write (Split)
  prepareIssueCredential,
  finalizeIssueCredential,
  prepareRevokeCredential,
  finalizeRevokeCredential,
} from "../controllers/credentialController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validateTokenId, validateAddress } from "../middleware/validation.js";

const router = express.Router();

// =====================================================
// INSTITUTE / ADMIN ROUTES (Protected Write)
// =====================================================

// 1. Issue Credential
router.post(
  "/issue/prepare",
  authenticate,
  requireRole(["institute", "admin"]),
  prepareIssueCredential
);
router.post(
  "/issue/finalize",
  authenticate,
  requireRole(["institute", "admin"]),
  finalizeIssueCredential
);

// 2. Revoke Credential
router.post(
  "/revoke/prepare",
  authenticate,
  requireRole(["institute", "admin"]),
  prepareRevokeCredential
);
router.post(
  "/revoke/finalize",
  authenticate,
  requireRole(["institute", "admin"]),
  finalizeRevokeCredential
);

// 3. Institute Dashboard Data
router.get(
  "/templates",
  authenticate,
  requireRole(["institute", "admin"]),
  getInstituteTemplates
);
router.get(
  "/issued",
  authenticate,
  requireRole(["institute", "admin"]),
  getIssuedCredentials
);

// =====================================================
// STUDENT ROUTES (Protected Read)
// =====================================================

// Get credentials for the currently logged-in user
router.get("/my/credentials", authenticate, async (req, res) => {
  // Reuse the controller logic but inject the user's address
  req.params.address = req.user.walletAddress;
  return getHolderCredentials(req, res);
});

// =====================================================
// PUBLIC ROUTES (Read Only)
// =====================================================

router.get("/:tokenId", validateTokenId, getCredential);
router.get("/holder/:address", validateAddress, getHolderCredentials);

export default router;
