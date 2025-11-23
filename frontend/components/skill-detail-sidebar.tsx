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
  ScrollText,
} from "lucide-react";
import { Credential, CredentialType } from "@/lib/types";

interface SkillDetailSidebarProps {
  credential: Credential | null;
  onClose: () => void;
}

const resolveIPFS = (url?: string) => {
  if (!url) return null;
  if (url.startsWith("ipfs://"))
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  return url;
};

export function SkillDetailSidebar({
  credential,
  onClose,
}: SkillDetailSidebarProps) {
  // Dynamic Config based on Type
  const getTypeConfig = (type: CredentialType) => {
    switch (type) {
      case CredentialType.DEGREE:
        return {
          color: "#ec4899", // Pink
          label: "DEGREE",
          bg: "bg-pink-500/10",
          border: "border-pink-500/20",
          icon: ScrollText,
        };
      case CredentialType.CERTIFICATE:
        return {
          color: "#22d3ee", // Cyan
          label: "CERTIFICATE",
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
          icon: GraduationCap, // Or FileBadge
        };
      case CredentialType.BADGE:
        return {
          color: "#f59e0b", // Amber
          label: "BADGE",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          icon: Award,
        };
      default:
        return {
          color: "#71717a",
          label: "CREDENTIAL",
          bg: "bg-zinc-500/10",
          border: "border-zinc-500/20",
          icon: FileBadge,
        };
    }
  };

  return (
    <AnimatePresence>
      {credential && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-[#09090b] border-l border-white/10 z-[100] overflow-hidden shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#09090b]/95 backdrop-blur-md">
              <h2 className="font-sans font-semibold text-lg text-white flex items-center gap-2">
                Credential Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-all text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {(() => {
                const typeStyle = getTypeConfig(credential.credentialType);
                const TypeIcon = typeStyle.icon;
                const imageUrl = resolveIPFS(credential.metadata.image);

                return (
                  <>
                    <div className="relative h-56 bg-white/5 w-full overflow-hidden group border-b border-white/5">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={credential.metadata.name}
                          className={`w-full h-full object-cover ${
                            credential.isRevoked ? "grayscale opacity-30" : ""
                          }`}
                        />
                      ) : (
                        // Fallback Icon UI
                        <div
                          className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-black to-zinc-900`}
                        >
                          <TypeIcon
                            size={80}
                            style={{ color: typeStyle.color, opacity: 0.2 }}
                          />
                        </div>
                      )}

                      {/* Badge overlay on image */}
                      <div className="absolute bottom-4 left-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md ${typeStyle.bg} ${typeStyle.border}`}
                        >
                          <TypeIcon
                            size={14}
                            style={{ color: typeStyle.color }}
                          />
                          <span
                            className="text-[10px] font-bold tracking-wider uppercase"
                            style={{ color: typeStyle.color }}
                          >
                            {typeStyle.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white leading-tight mb-2">
                          {credential.metadata.name}
                        </h3>
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
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-xs text-zinc-500 block mb-1">
                            Issued
                          </span>
                          <span className="text-white font-mono">
                            {new Date(credential.issuedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Skills Tags with Colors matching Type */}
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
                                  className="px-2.5 py-1 rounded-md border text-xs bg-transparent"
                                  style={{
                                    borderColor: `${typeStyle.color}40`,
                                    color: "white",
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs space-y-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-zinc-500">
                            Transaction Hash
                          </span>
                          <a
                            href={`https://sepolia.etherscan.io/tx/${credential.transactionHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center text-cyan-400 hover:text-cyan-300"
                          >
                            Verify <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                        <p className="text-zinc-600 font-mono break-all text-[10px]">
                          {credential.transactionHash}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-6 border-t border-white/10 bg-[#09090b]/95 backdrop-blur-sm flex gap-3">
              <button className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
