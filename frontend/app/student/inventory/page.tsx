"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Download,
  Share2,
  Search,
  CheckCircle,
  Loader2,
  Hexagon,
  ShieldAlert,
  ExternalLink,
  GraduationCap,
  FileBadge,
  Calendar,
  Hash,
} from "lucide-react";

// --- TYPES (Matched to Mongoose Model) ---
enum CredentialType {
  DEGREE = 0,
  CERTIFICATE = 1,
  BADGE = 2,
}

interface CredentialMetadata {
  name: string;
  description: string;
  image: string;
  major?: string;
  graduationYear?: number;
  gpa?: number;
  honors?: string;
  skills?: string[];
  achievements?: string[];
}

interface Credential {
  tokenId: string;
  holder: string;
  issuer: string;
  credentialType: CredentialType;
  credentialTypeName: "DEGREE" | "CERTIFICATE" | "BADGE";
  metadataURI: string;
  metadata: CredentialMetadata;
  transactionHash: string;
  blockNumber?: number;
  isRevoked: boolean;
  revocationReason?: string;
  revokedAt?: string;
  expirationDate?: string;
  issuedAt: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "loading";
}

// --- MOCK DATA ---
const INITIAL_DATA: Credential[] = [
  {
    tokenId: "1001",
    holder: "0xUser",
    issuer: "University of Tech",
    credentialType: CredentialType.DEGREE,
    credentialTypeName: "DEGREE",
    metadataURI: "ipfs://Qm...",
    transactionHash: "0x123456789abcdef...",
    issuedAt: "2023-06-15T00:00:00Z",
    isRevoked: false,
    metadata: {
      name: "B.S. Computer Science",
      description: "Bachelor of Science in CS",
      image: "",
      major: "Computer Science",
      graduationYear: 2023,
      gpa: 3.8,
      skills: ["Algorithms", "Data Structures"],
    },
  },
  {
    tokenId: "1002",
    holder: "0xUser",
    issuer: "TechCertified Academy",
    credentialType: CredentialType.CERTIFICATE,
    credentialTypeName: "CERTIFICATE",
    metadataURI: "ipfs://Qm...",
    transactionHash: "0x987654321fedcba...",
    issuedAt: "2024-01-20T00:00:00Z",
    isRevoked: false,
    metadata: {
      name: "Full Stack Development",
      description: "MERN Stack Bootcamp",
      image: "",
      skills: ["MongoDB", "Express", "React", "Node"],
    },
  },
  {
    tokenId: "1003",
    holder: "0xUser",
    issuer: "Hackathon DAO",
    credentialType: CredentialType.BADGE,
    credentialTypeName: "BADGE",
    metadataURI: "ipfs://Qm...",
    transactionHash: "0xbadbadbad...",
    issuedAt: "2023-12-05T00:00:00Z",
    isRevoked: true,
    revocationReason: "Violation of Hackathon Rules",
    revokedAt: "2023-12-10T00:00:00Z",
    metadata: {
      name: "Code Wizard",
      description: "Fastest deployment",
      image: "",
    },
  },
];

const resolveIPFS = (url?: string) => {
  if (!url) return null;
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }
  return url; // Return as is if it's already http
};

const CATEGORIES = ["All", "Degree", "Certificate", "Badge", "Revoked"];

// --- COMPONENT ---
export default function InventoryPage() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inventoryData, setInventoryData] =
    useState<Credential[]>(INITIAL_DATA);
  const [filteredData, setFilteredData] = useState<Credential[]>(INITIAL_DATA);

  // Load additional credentials from LocalStorage (Simulating blockchain fetch)
  useEffect(() => {
    const storedIssued = JSON.parse(
      localStorage.getItem("skill-z-issued-credentials") || "[]"
    );

    if (storedIssued.length > 0) {
      const newCreds: Credential[] = storedIssued.map((c: any) => ({
        tokenId: c.tokenId || Math.floor(Math.random() * 100000).toString(),
        holder: "0xUser",
        issuer: "TechCertified Academy",
        credentialType: c.credentialType || CredentialType.CERTIFICATE,
        credentialTypeName: "CERTIFICATE",
        metadataURI: "ipfs://mock",
        transactionHash: c.transactionHash || "0x...",
        issuedAt: c.issuedDate || new Date().toISOString(),
        isRevoked: false,
        metadata: {
          name: c.title,
          description: "Issued via Dashboard Simulation",
          image: "",
          skills: ["Pending"],
        },
      }));

      // Merge & Dedupe
      const allCreds = [...INITIAL_DATA, ...newCreds];
      const uniqueCreds = allCreds.filter(
        (v, i, a) => a.findIndex((v2) => v2.tokenId === v.tokenId) === i
      );
      setInventoryData(uniqueCreds);
    }
  }, []);

  // Filter Logic
  useEffect(() => {
    const filtered = inventoryData.filter((item) => {
      const matchesSearch =
        item.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tokenId.includes(searchTerm);

      let matchesCategory = true;
      if (selectedCategory === "Degree")
        matchesCategory = item.credentialType === CredentialType.DEGREE;
      if (selectedCategory === "Certificate")
        matchesCategory = item.credentialType === CredentialType.CERTIFICATE;
      if (selectedCategory === "Badge")
        matchesCategory = item.credentialType === CredentialType.BADGE;
      if (selectedCategory === "Revoked") matchesCategory = item.isRevoked;

      return matchesSearch && matchesCategory;
    });
    setFilteredData(filtered);
  }, [searchTerm, selectedCategory, inventoryData]);

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  };

  // --- Styles Helper ---
  const getCredentialStyles = (type: CredentialType) => {
    switch (type) {
      case CredentialType.DEGREE:
        return {
          icon: GraduationCap,
          color: "text-pink-400",
          bg: "bg-pink-500/10",
          border: "border-pink-500/20",
          label: "Degree",
        };
      case CredentialType.CERTIFICATE:
        return {
          icon: FileBadge,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          label: "Certificate",
        };
      case CredentialType.BADGE:
        return {
          icon: Award,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          label: "Badge",
        };
      default:
        return {
          icon: Award,
          color: "text-zinc-400",
          bg: "bg-zinc-500/10",
          border: "border-zinc-500/20",
          label: "Unknown",
        };
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-[#09090b] border border-white/10 shadow-2xl text-sm font-medium"
            >
              {toast.type === "loading" && (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              )}
              {toast.type === "success" && (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-white">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                My{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Inventory
                </span>
              </h1>
              <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Hexagon className="w-4 h-4 text-cyan-400" />{" "}
                  {inventoryData.length} Total Assets
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />{" "}
                  {inventoryData.filter((c) => !c.isRevoked).length} Active
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search name, issuer, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-white text-black border-white"
                        : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Credentials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredData.map((cred, idx) => {
              const style = getCredentialStyles(cred.credentialType);
              const Icon = style.icon;
              const imageUrl = resolveIPFS(cred.metadata.image); // Resolve the image

              return (
                <motion.div
                  layout
                  key={cred.tokenId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className={`group relative rounded-2xl bg-[#09090b] border transition-all flex flex-col justify-between overflow-hidden ${
                    cred.isRevoked
                      ? "border-red-500/30"
                      : "border-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)]"
                  }`}
                >
                  {/* --- 1. IMAGE HEADER SECTION --- */}
                  <div className="relative h-40 w-full bg-white/5 overflow-hidden">
                    {imageUrl ? (
                      // IF IMAGE EXISTS: Show Image
                      <>
                        <img
                          src={imageUrl}
                          alt={cred.metadata.name}
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                            cred.isRevoked ? "grayscale opacity-50" : ""
                          }`}
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.style.display = "none";
                            // You might want to trigger a state here to show icon instead
                          }}
                        />
                        {/* Gradient Overlay so text below pops */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />

                        {/* Type Badge (Floating on top of image) */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-lg ${style.bg} ${style.border} ${style.color}`}
                          >
                            {style.label}
                          </span>
                        </div>
                      </>
                    ) : (
                      // IF NO IMAGE: Show Big Icon Pattern
                      <div
                        className={`w-full h-full flex items-center justify-center ${style.bg} relative overflow-hidden`}
                      >
                        {/* Decorative Background Icon */}
                        <Icon
                          className={`absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12 ${style.color}`}
                        />

                        {/* Center Icon */}
                        <div
                          className={`w-16 h-16 rounded-2xl border ${style.border} flex items-center justify-center backdrop-blur-sm bg-black/20`}
                        >
                          <Icon className={`w-8 h-8 ${style.color}`} />
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${style.bg} ${style.border} ${style.color}`}
                          >
                            {style.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- 2. CONTENT SECTION --- */}
                  <div className="p-6 pt-2 flex-1 flex flex-col">
                    {/* Issuer info (moved up for hierarchy) */}
                    <div className="flex items-center gap-2 mb-2">
                      {/* Small issuer logo placeholder */}
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500" />
                      <p className="text-xs text-zinc-400 font-medium">
                        {cred.issuer}
                      </p>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-100 transition-colors">
                      {cred.metadata.name}
                    </h3>

                    {/* Description line clamped */}
                    <p className="text-sm text-zinc-500 mb-4 line-clamp-2 flex-1">
                      {cred.metadata.description}
                    </p>

                    {/* Metadata Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {cred.metadata.gpa && (
                        <span className="text-xs px-2 py-1 rounded bg-white/5 text-zinc-300 border border-white/5 font-mono">
                          GPA: {cred.metadata.gpa}
                        </span>
                      )}
                      {cred.metadata.skills?.slice(0, 2).map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded bg-white/5 text-zinc-300 border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* --- 3. FOOTER SECTION --- */}
                  <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      {cred.isRevoked ? (
                        <span className="flex items-center gap-1 text-xs text-red-400 font-bold">
                          <ShieldAlert className="w-3 h-3" /> Revoked
                        </span>
                      ) : (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${cred.transactionHash}`}
                          target="_blank"
                          className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-cyan-400 font-mono transition-colors"
                        >
                          <Hash className="w-3 h-3" />{" "}
                          {cred.tokenId.slice(0, 6)}...
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Revoked Overlay remains the same */}
                  {cred.isRevoked && (
                    // ... keep existing overlay code
                    <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                      <div>
                        <div className="text-red-400 font-bold mb-2 flex items-center justify-center gap-2">
                          <ShieldAlert className="w-5 h-5" /> Revoked
                        </div>
                        <p className="text-sm text-zinc-300">
                          Reason: {cred.revocationReason}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
