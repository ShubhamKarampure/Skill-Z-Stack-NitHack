"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Coins,
  ArrowRight,
  X,
  Menu,
  Wallet,
  Loader2,
  Sparkles,
  Vote,
  Building2,
  FileText,
} from "lucide-react";

// --- TYPES ---
interface Proposal {
  id: string;
  title: string;
  description: string;
  applicant?: string; // For Institute Requests
  category: "access" | "policy" | "treasury";
  status: "active" | "passed" | "rejected";
  votesFor: number;
  votesAgainst: number;
  endDate: string;
  totalVotes: number; // For percentage calc
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "loading";
}

// --- MOCK DATA ---
const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "1",
    title: "Verify 'Apex Academy' as Issuer",
    description:
      "Apex Academy (0x88...12A) requests permission to issue verified credentials on Skill-Z.",
    applicant: "Apex Academy",
    category: "access",
    status: "active",
    votesFor: 142,
    votesAgainst: 12,
    endDate: "2024-11-25",
    totalVotes: 154,
  },
  {
    id: "2",
    title: "Upgrade ZK-Snark Verification Circuit",
    description:
      "Proposal to upgrade the core verification contract to support PlonK proofs for faster generation.",
    category: "policy",
    status: "active",
    votesFor: 850,
    votesAgainst: 40,
    endDate: "2024-11-30",
    totalVotes: 890,
  },
  {
    id: "3",
    title: "Verify 'BITS Pilani' as Issuer",
    description:
      "BITS Pilani requests access to the credential minting contract.",
    applicant: "BITS Pilani",
    category: "access",
    status: "passed",
    votesFor: 2100,
    votesAgainst: 5,
    endDate: "2024-11-10",
    totalVotes: 2105,
  },
];

// --- COMPONENTS ---

const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[100px]" />
  </div>
);

const ToastContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-[#09090b] border border-white/10 shadow-2xl shadow-black text-sm font-medium"
        >
          {toast.type === "loading" && (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          )}
          {toast.type === "success" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          {toast.type === "info" && (
            <Sparkles className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-white">{toast.message}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
            Z
          </div>
          <span>
            Skill-Z{" "}
            <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded ml-2 border border-emerald-500/20">
              DAO
            </span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="text-white">
            Proposals
          </a>
          <a href="/governance/members" className="hover:text-white transition-colors">
            Members
          </a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>0xDAO...Admin</span>
          </button>
        </div>
        <button
          className="md:hidden p-2 text-zinc-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-[#09090b] border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          <a href="#" className="text-white font-medium">
            Proposals
          </a>
        </div>
      )}
    </nav>
  );
};

// --- MAIN PAGE ---

export default function GovernancePage() {
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [votingId, setVotingId] = useState<string | null>(null);

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  };

  const handleVote = (id: string, voteType: "for" | "against") => {
    setVotingId(id);
    addToast("Confirming vote on-chain...", "loading");

    setTimeout(() => {
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              votesFor: voteType === "for" ? p.votesFor + 100 : p.votesFor, // Weighted vote
              votesAgainst:
                voteType === "against" ? p.votesAgainst + 100 : p.votesAgainst,
              totalVotes: p.totalVotes + 100,
            };
          }
          return p;
        })
      );
      setVoted((prev) => new Set([...prev, id]));
      setVotingId(null);
      addToast("Vote cast successfully!", "success");
    }, 2000);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "access":
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            <Building2 className="w-3 h-3" /> New Member
          </span>
        );
      case "policy":
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
            <FileText className="w-3 h-3" /> Policy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      <Aurora />
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Governance{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                  DAO
                </span>
              </h1>
              <p className="text-zinc-400">
                Review & Vote on Institute Access Requests.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase font-bold">
                  Your Voting Power
                </p>
                <p className="text-2xl font-bold text-emerald-400 flex items-center justify-end gap-2">
                  <Coins className="w-5 h-5" /> 12,500
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1 text-white">247</div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                DAO Members
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1 text-emerald-400">
                {proposals.filter((p) => p.status === "active").length}
              </div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Active Votes
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1 text-amber-400">98%</div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Participation
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1 text-blue-400">12</div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Passed This Month
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content: Proposals */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Vote className="w-5 h-5 text-emerald-400" /> Active Proposals
            </h2>

            <div className="space-y-4">
              <AnimatePresence>
                {proposals.map((proposal) => (
                  <motion.div
                    key={proposal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-2xl border transition-all ${
                      proposal.status === "active"
                        ? "bg-white/[0.02] border-white/10 hover:border-emerald-500/30"
                        : "bg-white/[0.01] border-white/5 opacity-75"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(proposal.category)}
                          {proposal.status === "active" ? (
                            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ended
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold">{proposal.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500 mb-1">Ends</p>
                        <p className="text-sm font-mono">{proposal.endDate}</p>
                      </div>
                    </div>

                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                      {proposal.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />{" "}
                          {(
                            (proposal.votesFor / proposal.totalVotes) *
                            100
                          ).toFixed(1)}
                          % For
                        </span>
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" />{" "}
                          {(
                            (proposal.votesAgainst / proposal.totalVotes) *
                            100
                          ).toFixed(1)}
                          % Against
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (proposal.votesFor / proposal.totalVotes) * 100
                            }%`,
                          }}
                          className="h-full bg-emerald-500"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (proposal.votesAgainst / proposal.totalVotes) *
                              100
                            }%`,
                          }}
                          className="h-full bg-red-500"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {proposal.status === "active" && !voted.has(proposal.id) ? (
                      <div className="flex gap-3 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleVote(proposal.id, "for")}
                          disabled={!!votingId}
                          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2"
                        >
                          {votingId === proposal.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ThumbsUp className="w-4 h-4" />
                          )}
                          Vote For
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, "against")}
                          disabled={!!votingId}
                          className="flex-1 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-white hover:text-red-400 font-bold rounded-xl transition-all flex justify-center items-center gap-2"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Vote Against
                        </button>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-white/5 text-center">
                        {voted.has(proposal.id) ? (
                          <span className="text-emerald-400 font-mono text-sm">
                            You have voted on this proposal
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-mono text-sm">
                            Voting Closed
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" /> Delegated
                Power
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                You have been delegated voting power from 3 other institutes.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm p-3 bg-black/40 rounded-lg">
                  <span>NIT Silchar</span>
                  <span className="text-emerald-400 font-mono">5,000 SKP</span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-black/40 rounded-lg">
                  <span>IIT Delhi</span>
                  <span className="text-emerald-400 font-mono">2,500 SKP</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-lg font-bold mb-4 text-zinc-300">
                Resources
              </h3>
              <div className="space-y-2">
                {[
                  "Governance Constitution",
                  "Forum Discussions",
                  "Proposal Template",
                ].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left p-3 hover:bg-white/5 rounded-lg text-sm text-zinc-400 hover:text-white transition-all flex justify-between items-center group"
                  >
                    {item}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
