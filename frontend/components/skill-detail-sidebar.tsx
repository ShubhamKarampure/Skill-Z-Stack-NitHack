"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Share2,
  ShieldCheck,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  status: "verified" | "pending" | "expired";
  endorsements: number;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  nftAddress?: string;
  level?: number;
}

interface SkillDetailSidebarProps {
  skill: Skill | null;
  onClose: () => void;
}

export function SkillDetailSidebar({
  skill,
  onClose,
}: SkillDetailSidebarProps) {
  const statusConfig = {
    verified: {
      color: "#06b6d4",
      label: "VERIFIED",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      icon: ShieldCheck,
    },
    pending: {
      color: "#fbbf24",
      label: "PENDING",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: Clock,
    },
    expired: {
      color: "#7f1d1d",
      label: "EXPIRED",
      bg: "bg-red-900/10",
      border: "border-red-500/20",
      icon: AlertCircle,
    },
  };

  return (
    <AnimatePresence>
      {skill && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-[#09090b]/95 border-l border-white/10 z-[100] overflow-y-auto shadow-2xl shadow-black"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-white/10 bg-[#09090b]/95 backdrop-blur-md z-10">
              <h2 className="font-sans font-semibold text-lg text-white tracking-wide">
                Credential Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-all text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Hero Section */}
              <div>
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  {skill.name}
                </h3>

                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                      statusConfig[skill.status].bg
                    } ${statusConfig[skill.status].border}`}
                  >
                    {skill.status === "verified" && (
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    )}
                    {skill.status === "expired" && (
                      <AlertCircle className="w-3 h-3 text-red-400" />
                    )}
                    <span
                      className="text-xs font-bold tracking-wider"
                      style={{ color: statusConfig[skill.status].color }}
                    >
                      {statusConfig[skill.status].label}
                    </span>
                  </div>
                  {skill.level && (
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
                      Level {skill.level}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                    Endorsements
                  </p>
                  <p className="text-2xl font-mono text-white">
                    {skill.endorsements}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                    Trust Score
                  </p>
                  <p className="text-2xl font-mono text-emerald-400">98%</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                {skill.issuer && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Issued By</span>
                    <span className="text-sm text-white font-medium">
                      {skill.issuer}
                    </span>
                  </div>
                )}
                {skill.issueDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Date Earned</span>
                    <span className="text-sm text-white font-medium">
                      {skill.issueDate}
                    </span>
                  </div>
                )}
                {skill.expiryDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Expires</span>
                    <span className="text-sm text-red-400 font-medium">
                      {skill.expiryDate}
                    </span>
                  </div>
                )}
              </div>

              {/* NFT Address */}
              {skill.nftAddress && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-500">Contract Address</span>
                    <a
                      href="#"
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Scan <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                  <p className="text-zinc-400 break-all">{skill.nftAddress}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 flex flex-col gap-3">
                <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Credential
                </button>
                <button className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors">
                  Download Certificate
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
