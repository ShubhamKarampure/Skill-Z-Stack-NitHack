// src/routes/issuerRoutes.js
import express from "express";
import {
  // Read Operations
  getIssuer,
  getAllAccreditedIssuers,
  checkAccreditation,
  getAllInstitutes,
  getInstituteById,
  getInstituteStats,

  // Write Operations (Split)
  prepareRegisterIssuer,
  finalizeRegisterIssuer,
  prepareAccreditIssuer,
  finalizeAccreditIssuer,
  prepareSuspendIssuer,
  finalizeSuspendIssuer,
} from "../controllers/issuerController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validateAddress } from "../middleware/validation.js";

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all accredited issuers (for public verification)
router.get("/all", getAllAccreditedIssuers);

// Get specific issuer details
router.get("/:address", validateAddress, getIssuer);

// Check accreditation status
router.get("/:address/accreditation", validateAddress, checkAccreditation);

// =====================================================
// ADMIN ROUTES (Protected)
// =====================================================

// --- READ OPERATIONS ---

// Get all institutes (accredited and non-accredited)
router.get(
  "/admin/institutes",
  authenticate,
  requireRole(["admin"]),
  getAllInstitutes
);

// Get institute statistics for dashboard
router.get(
  "/admin/stats",
  authenticate,
  requireRole(["admin"]),
  getInstituteStats
);

// Get specific institute by ID
router.get(
  "/admin/institute/:instituteId",
  authenticate,
  requireRole(["admin"]),
  getInstituteById
);

// --- WRITE OPERATIONS (2-Step Flow) ---

// 1. Register Issuer
router.post(
  "/register/prepare",
  authenticate,
  requireRole(["admin", "institute"]), // Institutes might self-register initially
  prepareRegisterIssuer
);
router.post(
  "/register/finalize",
  authenticate,
  requireRole(["admin", "institute"]),
  finalizeRegisterIssuer
);

// 2. Accredit Issuer
router.post(
  "/accredit/prepare",
  authenticate,
  requireRole(["admin"]),
  prepareAccreditIssuer
);
router.post(
  "/accredit/finalize",
  authenticate,
  requireRole(["admin"]),
  finalizeAccreditIssuer
);

// 3. Suspend Issuer
router.post(
  "/suspend/prepare",
  authenticate,
  requireRole(["admin"]),
  prepareSuspendIssuer
);
router.post(
  "/suspend/finalize",
  authenticate,
  requireRole(["admin"]),
  finalizeSuspendIssuer
);

export default router;
