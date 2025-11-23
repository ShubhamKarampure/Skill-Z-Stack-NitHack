"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ExternalLink,
  Briefcase,
  Users,
  UserCheck,
  Filter,
  Loader2,
  ChevronRight,
  FileJson,
} from "lucide-react";
import { verifierService } from "@/lib/api";

// --- TYPES ---
interface Candidate {
  id: string;
  name: string;
  role: string;
  walletAddress: string;
  verifiedSkills: string[];
  matchScore: number;
}

// --- MOCK DATA ---
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Frontend Developer",
    walletAddress: "0x7f8...a3c2",
    verifiedSkills: ["React.js", "TypeScript", "Next.js"],
    matchScore: 98,
  },
  {
    id: "2",
    name: "Sarah Jones",
    role: "Smart Contract Eng",
    walletAddress: "0x3a2...b1b9",
    verifiedSkills: ["Solidity", "Hardhat", "Ethers.js"],
    matchScore: 92,
  },
  {
    id: "3",
    name: "Mike Ross",
    role: "Product Designer",
    walletAddress: "0x99c...d2e1",
    verifiedSkills: ["Figma", "UI/UX", "Prototyping"],
    matchScore: 85,
  },
];

// --- COMPONENTS ---
const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
  </div>
);

export default function EmployerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<
    "success" | "error" | null
  >(null);
  const [verificationType, setVerificationType] = useState<"credential" | "zkp">("credential");
  const [zkpProof, setZkpProof] = useState("");
  const [zkpType, setZkpType] = useState<"age" | "credential" | "rank">("age");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationType === "credential" && !verificationId) return;
    if (verificationType === "zkp" && !zkpProof) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      if (verificationType === "zkp") {
        const proofData = JSON.parse(zkpProof);
        const res = await verifierService.verifyZKProof(zkpType, proofData.proof, proofData.publicSignals);
        if (res.success && res.data?.isValid) {
          setVerificationResult("success");
        } else {
          setVerificationResult("error");
        }
      } else {
        // Mock Verification Logic
        setTimeout(() => {
          // Mock: If ID starts with "0x", it's valid
          if (verificationId.startsWith("0x")) {
            setVerificationResult("success");
          } else {
            setVerificationResult("error");
          }
          setIsVerifying(false);
        }, 2000);
        return;
      }
    } catch (error) {
      console.error("Verification failed", error);
      setVerificationResult("error");
    } finally {
      if (verificationType === "zkp") {
        setIsVerifying(false);
      }
    }
  };

  const filteredCandidates = MOCK_CANDIDATES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen font-sans text-white selection:bg-indigo-500/30">
      <Aurora />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Talent{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
              Verification
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Instantly verify candidate credentials using Zero-Knowledge proofs.
            No fake resumes, just blockchain-verified skills.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Candidate Search */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Candidate Pool
              </h2>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white/0.03 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-all w-64"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-white/0.02 border border-white/5 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-lg">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-indigo-300 transition-colors">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-zinc-400 flex items-center gap-2">
                          <Briefcase className="w-3 h-3" /> {candidate.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                        <ShieldCheck className="w-3 h-3" />{" "}
                        {candidate.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {candidate.verifiedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />{" "}
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs font-mono text-zinc-500">
                      {candidate.walletAddress}
                    </span>
                    <a
                      href={`/employer/candidate/${candidate.id}`}
                      className="text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      View Full Profile <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Verification Tool */}
          <div className="space-y-6">
            {/* Verify Box */}
            <div className="p-6 rounded-2xl bg-linear-to-b from-indigo-900/20 to-transparent border border-indigo-500/20 sticky ">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Credential Checker</h3>
                  <p className="text-xs text-zinc-400">
                    Verify any Skill-Z ID instantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-4 p-1 bg-black/40 rounded-lg border border-white/5">
                <button
                  onClick={() => setVerificationType("credential")}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                    verificationType === "credential"
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Credential ID
                </button>
                <button
                  onClick={() => setVerificationType("zkp")}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                    verificationType === "zkp"
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  ZK Proof
                </button>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                {verificationType === "credential" ? (
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                      Credential ID / Tx Hash
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={verificationId}
                      onChange={(e) => setVerificationId(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                        Proof Type
                      </label>
                      <select
                        value={zkpType}
                        onChange={(e) => setZkpType(e.target.value as any)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                      >
                        <option value="age">Age Verification</option>
                        <option value="credential">Credential Validity</option>
                        <option value="rank">University Rank</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                        Proof JSON
                      </label>
                      <textarea
                        placeholder='{"proof": {...}, "publicSignals": [...] }'
                        value={zkpProof}
                        onChange={(e) => setZkpProof(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono h-32 resize-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  disabled={isVerifying || (verificationType === "credential" ? !verificationId : !zkpProof)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </button>
              </form>

              {/* Results Area */}
              <AnimatePresence>
                {verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`mt-6 p-4 rounded-xl border ${
                      verificationResult === "success"
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {verificationResult === "success" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4
                          className={`font-bold text-sm ${
                            verificationResult === "success"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {verificationResult === "success"
                            ? "Valid Credential Found"
                            : "Verification Failed"}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1">
                          {verificationResult === "success"
                            ? "This credential was issued by TechCertified Academy on Nov 15, 2024. The ZK proof is valid."
                            : "Could not find a valid credential with this ID on the Polygon network."}
                        </p>
                        {verificationResult === "success" && (
                          <a
                            href="#"
                            className="text-xs text-green-400 hover:underline mt-2 inline-flex items-center gap-1"
                          >
                            View on Blockchain{" "}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <div className="p-6 rounded-2xl bg-white/0.02 border border-white/5">
              <h3 className="font-bold text-sm text-zinc-400 uppercase mb-4">
                Hiring Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300 text-sm">
                    Candidates Reviewed
                  </span>
                  <span className="font-mono font-bold text-white">142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300 text-sm">
                    Fake Resumes Caught
                  </span>
                  <span className="font-mono font-bold text-red-400">12</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="text-zinc-300 text-sm">Total Hires</span>
                  <span className="font-mono font-bold text-green-400">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
