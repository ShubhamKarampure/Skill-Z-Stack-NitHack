"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Share2,
  ShieldCheck,
  Calendar,
  Hash,
  GraduationCap,
  FileBadge,
  Award,
  Download,
} from "lucide-react";

// --- SHARED TYPES ---
// You can move these to a separate types.ts file later if you prefer
export enum CredentialType {
  DEGREE = 0,
  CERTIFICATE = 1,
  BADGE = 2,
}

export interface CredentialMetadata {
  name: string;
  description: string;
  image: string;
  skills?: string[];
  gpa?: number;
  graduationYear?: number;
  major?: string;
}

export interface Credential {
  tokenId: string;
  holder?: string;
  issuer: string;
  credentialType: CredentialType;
  metadata: CredentialMetadata;
  transactionHash: string;
  isRevoked: boolean;
  revocationReason?: string;
  issuedAt: string;
  expirationDate?: string;
}

interface SkillDetailSidebarProps {
  credential: Credential | null;
  onClose: () => void;
}

const resolveIPFS = (url?: string) => {
  if (!url) return null;
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }
  return url;
};

export function SkillDetailSidebar({
  credential,
  onClose,
}: SkillDetailSidebarProps) {
  // Helper for dynamic styling
  const getTypeConfig = (type: CredentialType) => {
    switch (type) {
      case CredentialType.DEGREE:
        return {
          color: "#ec4899",
          label: "DEGREE",
          bg: "bg-pink-500/10",
          border: "border-pink-500/20",
          icon: GraduationCap,
        };
      case CredentialType.CERTIFICATE:
        return {
          color: "#3b82f6",
          label: "CERTIFICATE",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          icon: FileBadge,
        };
      case CredentialType.BADGE:
        return {
          color: "#f59e0b",
          label: "BADGE",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          icon: Award,
        };
      default:
        return {
          color: "#71717a",
          label: "UNKNOWN",
          bg: "bg-zinc-500/10",
          border: "border-zinc-500/20",
          icon: Award,
        };
    }
  };

  return (
    <AnimatePresence>
      {credential && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar Container */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-[#09090b] border-l border-white/10 z-[100] overflow-hidden shadow-2xl shadow-black flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#09090b]/95 backdrop-blur-md z-10">
              <h2 className="font-sans font-semibold text-lg text-white tracking-wide flex items-center gap-2">
                Credential Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-all text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {(() => {
                const typeStyle = getTypeConfig(credential.credentialType);
                const TypeIcon = typeStyle.icon;
                const imageUrl = resolveIPFS(credential.metadata.image);

                return (
                  <>
                    {/* Hero Image */}
                    <div className="relative h-48 bg-white/5 w-full overflow-hidden group">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={credential.metadata.name}
                          className={`w-full h-full object-cover ${
                            credential.isRevoked ? "grayscale opacity-30" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                          <TypeIcon className="w-20 h-20 opacity-10 text-white" />
                        </div>
                      )}
                      {credential.isRevoked && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center flex-col">
                          <ShieldCheck className="w-12 h-12 text-red-500 mb-2" />
                          <span className="text-red-400 font-bold tracking-widest uppercase">
                            Revoked
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-8">
                      {/* Title & Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                            {credential.metadata.name}
                          </h3>
                          <div
                            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                              credential.isRevoked
                                ? "bg-red-900/20 border-red-500/20 text-red-400"
                                : `${typeStyle.bg} ${typeStyle.border}`
                            }`}
                          >
                            <TypeIcon
                              className="w-3 h-3"
                              style={{
                                color: credential.isRevoked
                                  ? "#f87171"
                                  : typeStyle.color,
                              }}
                            />
                            <span
                              className="text-[10px] font-bold tracking-wider uppercase"
                              style={{
                                color: credential.isRevoked
                                  ? "#f87171"
                                  : typeStyle.color,
                              }}
                            >
                              {credential.isRevoked
                                ? "REVOKED"
                                : typeStyle.label}
                            </span>
                          </div>
                        </div>

                        <p className="text-zinc-400 text-sm leading-relaxed">
                          {credential.metadata.description}
                        </p>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5 col-span-full">
                          <span className="text-xs text-zinc-500 block mb-1">
                            Issuer
                          </span>
                          <span className="text-white font-medium">
                            {credential.issuer}
                          </span>
                        </div>
                        {credential.metadata.gpa && (
                          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-xs text-zinc-500 block mb-1">
                              GPA
                            </span>
                            <span className="text-white font-mono">
                              {credential.metadata.gpa}
                            </span>
                          </div>
                        )}
                        {credential.metadata.graduationYear && (
                          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-xs text-zinc-500 block mb-1">
                              Year
                            </span>
                            <span className="text-white font-mono">
                              {credential.metadata.graduationYear}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Skills Tags */}
                      {credential.metadata.skills &&
                        credential.metadata.skills.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                              Verified Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {credential.metadata.skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-300"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Blockchain Details */}
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Issued
                          </span>
                          <span className="text-zinc-300 font-mono">
                            {new Date(credential.issuedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 flex items-center gap-2">
                            <Hash className="w-3 h-3" /> Token ID
                          </span>
                          <span className="text-zinc-300 font-mono">
                            {credential.tokenId}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-zinc-500">
                              Transaction Hash
                            </span>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${credential.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              Verify <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                          <p className="text-zinc-600 font-mono break-all text-[10px]">
                            {credential.transactionHash}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-[#09090b]/95 backdrop-blur-sm">
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
