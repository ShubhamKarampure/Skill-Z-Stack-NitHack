"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Key,
  CheckCircle,
  Loader2,
  Clock,
  AlertCircle,
  ChevronDown,
  School,
  XCircle,
} from "lucide-react";
import { enrollmentService, instituteService, Institute } from "@/lib/api";

// Defining the shape of the data based on your specific backend response
interface EnrollmentData {
  _id: string;
  isActive: boolean;
  enrolledAt: string;
  instituteId: {
    _id: string;
    name: string;
    email: string;
    walletAddress: string;
  };
}

export default function StudentInstitutes() {
  // --- STATE ---
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dropdown Data State
  const [availableInstitutes, setAvailableInstitutes] = useState<Institute[]>(
    []
  );
  const [isLoadingInstitutes, setIsLoadingInstitutes] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ instituteId: "", token: "" });

  // --- 1. FETCH ENROLLMENTS ON LOAD ---
  const fetchEnrollments = async () => {
    setIsLoadingData(true);
    try {
      const response = await enrollmentService.getMyEnrollments();
      console.log("Enrollment Response:", response);

      // FIXED: Adapted to your backend response structure
      // Your log showed: { success: true, enrollments: [...] }
      if (response.success) {
        // Prioritize 'enrollments', fallback to 'data' if API changes
        const list = (response as any).enrollments || response.data || [];
        setEnrollments(list);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // --- 2. FETCH INSTITUTES WHEN MODAL OPENS ---
  useEffect(() => {
    if (isModalOpen) {
      const fetchInstitutes = async () => {
        setIsLoadingInstitutes(true);
        try {
          const response = await instituteService.getAccreditedInstitutes();

          const payload = response as any;

          if (payload.success && Array.isArray(payload.institutes)) {
            setAvailableInstitutes(payload.institutes);
          } else if (payload.success && payload.data) {
            setAvailableInstitutes(payload.data);
          }
        } catch (error) {
          console.error("Failed to fetch institutes list", error);
        } finally {
          setIsLoadingInstitutes(false);
        }
      };
      fetchInstitutes();
    }
  }, [isModalOpen]);

  // --- 3. HANDLE JOIN REQUEST ---
  const handleJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.instituteId) {
      setErrorMsg("Please select an institute.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await enrollmentService.requestEnrollment(
        formData.instituteId,
        formData.token
      );

      if (response.success) {
        await fetchEnrollments();
        setIsModalOpen(false);
        setFormData({ instituteId: "", token: "" });
      } else {
        setErrorMsg(response.message || "Failed to join institute");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Institutes</h1>
            <p className="text-zinc-400 text-sm">
              Manage your academic affiliations and permissions.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-sm shadow-lg shadow-blue-900/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Join New Institute
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoadingData && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-zinc-500 text-sm">Loading your institutes...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoadingData && enrollments.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-300">
              No Institutes Found
            </h3>
            <p className="text-zinc-500 mt-2 max-w-md mx-auto">
              You haven't joined any institutes yet. Click the button above to
              join an accredited organization.
            </p>
          </div>
        )}

        {/* ENROLLMENT LIST */}
        {!isLoadingData && (
          <div className="grid gap-4">
            {enrollments.map((enrollment) => (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      enrollment.isActive
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    {/* FIXED: Accessed nested instituteId.name */}
                    <h3 className="font-bold text-lg">
                      {enrollment.instituteId?.name || "Unknown Institute"}
                    </h3>

                    <div className="flex items-center gap-2 text-xs">
                      {/* FIXED: Status badge based on isActive boolean */}
                      <span
                        className={`px-2 py-0.5 rounded-full border ${
                          enrollment.isActive
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}
                      >
                        {enrollment.isActive ? "Active Student" : "Inactive"}
                      </span>

                      <span className="text-zinc-500">
                        Joined: {/* FIXED: Accessed enrolledAt */}
                        {new Date(enrollment.enrolledAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status/Action Column */}
                {enrollment.isActive ? (
                  <div className="text-right text-xs text-zinc-500">
                    <p>Wallet Connected</p>
                    <p className="text-emerald-500 flex items-center justify-end gap-1 mt-1">
                      <CheckCircle className="w-3 h-3" /> Enrolled
                    </p>
                  </div>
                ) : (
                  <div className="text-right text-xs text-zinc-500">
                    <p>Account Suspended</p>
                    <p className="text-red-500 flex items-center justify-end gap-1 mt-1">
                      <XCircle className="w-3 h-3" /> Inactive
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* JOIN MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>

              <h2 className="text-xl font-bold mb-1">Join Institute</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Select an accredited institute and enter your invitation token.
              </p>

              <form onSubmit={handleJoinRequest} className="space-y-4">
                {/* Institute Selection Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase">
                    Select Institute
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />

                    <select
                      required
                      value={formData.instituteId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instituteId: e.target.value,
                        })
                      }
                      disabled={isLoadingInstitutes}
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none transition-colors appearance-none text-zinc-300 disabled:opacity-50"
                    >
                      <option value="" disabled>
                        {isLoadingInstitutes
                          ? "Loading institutes..."
                          : "Choose an Institute"}
                      </option>

                      {!isLoadingInstitutes &&
                        availableInstitutes.map((inst) => (
                          <option
                            key={inst.id || (inst as any)._id}
                            value={inst.id || (inst as any)._id}
                            className="bg-[#18181b]"
                          >
                            {inst.name}
                          </option>
                        ))}
                    </select>

                    <div className="absolute right-3 top-3 pointer-events-none">
                      {isLoadingInstitutes ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Token Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase">
                    Invitation Token
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. sk-8921..."
                      value={formData.token}
                      onChange={(e) =>
                        setFormData({ ...formData, token: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none transition-colors font-mono text-white placeholder-zinc-600"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Token provided by your institute administrator.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4" /> {errorMsg}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    disabled={isSubmitting || isLoadingInstitutes}
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      "Send Request"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
