"use client";
import {Fuel, Activity, ExternalLink,  CheckCircle2, Zap} from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  FileText,
  BarChart3,
  Plus,
  CheckCircle,
  Clock,
  X,
  Menu,
  Wallet,
  Loader2,
  Search,
  Bell,
  Shield,
  Filter,
  TrendingUp,
  DollarSign,
} from "lucide-react";

// --- TYPES ---
interface Request {
  id: string;
  studentName: string;
  title: string;
  date: string;
  status: "pending";
}

interface Credential {
  id: string;
  studentName: string;
  title: string;
  issuedDate: string;
  verified: boolean;
  transactionHash?: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "loading";
}

const INITIAL_ISSUED: Credential[] = [
  {
    id: "101",
    studentName: "Alex Chen",
    title: "Advanced React Patterns",
    issuedDate: "2024-11-15",
    verified: true,
    transactionHash: "0x71C...9A21",
  },
  {
    id: "102",
    studentName: "Jordan Smith",
    title: "Solidity Essentials",
    issuedDate: "2024-11-10",
    verified: true,
    transactionHash: "0x892...B31C",
  },
];

// --- COMPONENTS ---
const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/10 blur-[120px]" />
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
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          )}
          {toast.type === "success" && (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
          {toast.type === "info" && (
            <Shield className="w-4 h-4 text-purple-400" />
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
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white">
            Z
          </div>
          <span>
            Skill-Z{" "}
            <span className="text-xs font-normal text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded ml-2 border border-purple-500/20">
              INSTITUTE
            </span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="text-white">
            Dashboard
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Students
          </a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
            <Wallet className="w-4 h-4 text-purple-400" />
            <span>0xAdmin...8821</span>
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
            Dashboard
          </a>
        </div>
      )}
    </nav>
  );
};

// ---  ANALYTICS COMPONENT ---
const AnimatedStat = ({
  label,
  value,
  prefix = "",
  suffix = "",
  color,
}: any) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/,/g, ""));
    if (start === end) return;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
      <div className={`text-3xl font-bold mb-1 ${color}`}>
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
        {label}
      </p>
    </div>
  );
};

// --- MAIN PAGE ---

export default function InstitutePortal() {
  const [issued, setIssued] = useState<Credential[]>(INITIAL_ISSUED);
  const [pending, setPending] = useState<Request[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // --- LOCAL STORAGE SYNC ---
  useEffect(() => {
    const storedRequests = localStorage.getItem("skill-z-pending-requests");
    if (storedRequests) setPending(JSON.parse(storedRequests));

    const storedIssued = localStorage.getItem("skill-z-issued-credentials");
    if (storedIssued)
      setIssued([...INITIAL_ISSUED, ...JSON.parse(storedIssued)]);
  }, []);

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  };

  const handleApprove = (req: Request) => {
    setLoadingId(req.id);
    addToast("Verifying ZK Proof & Minting...", "loading");

    setTimeout(() => {
      const newCred: Credential = {
        id: req.id,
        studentName: req.studentName,
        title: req.title,
        issuedDate: new Date().toISOString().split("T")[0],
        verified: true,
        transactionHash: "0x" + Math.random().toString(16).substr(2, 40),
      };

      const updatedIssued = [newCred, ...issued];
      const updatedPending = pending.filter((p) => p.id !== req.id);

      setIssued(updatedIssued);
      setPending(updatedPending);
      setLoadingId(null);

      localStorage.setItem(
        "skill-z-issued-credentials",
        JSON.stringify(updatedIssued)
      );
      localStorage.setItem(
        "skill-z-pending-requests",
        JSON.stringify(updatedPending)
      );

      addToast(`Minted NFT for ${req.studentName}`, "success");
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
      <Aurora />
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Institute{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Dashboard
                </span>
              </h1>
              <p className="text-zinc-400">
                TechCertified Academy • Admin Portal
              </p>
            </div>
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Direct Issue
            </button>
          </div>

          {/*  ANALYTICS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatedStat
              label="Total Students"
              value={847}
              color="text-white"
            />
            <AnimatedStat
              label="Credentials Issued"
              value={issued.length}
              color="text-purple-400"
            />
            <AnimatedStat
              label="Gas Saved (MATIC)"
              value={142}
              prefix=""
              color="text-amber-400"
            />
            <AnimatedStat
              label="Verified on Chain"
              value={issued.filter((c) => c.verified).length}
              color="text-emerald-400"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content (Issued List) */}
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-400" />
                  Issued Credentials
                </h2>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {issued.map((cred) => (
                    <motion.div
                      key={cred.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      layout
                      className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                            {cred.studentName}
                          </h3>
                          <p className="text-sm text-zinc-400">{cred.title}</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-xs font-bold text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" /> Minted
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-xs text-zinc-500 font-mono">
                          {cred.issuedDate}
                        </span>
                        {cred.transactionHash && (
                          <div className="flex items-center gap-1 text-xs font-mono text-zinc-600">
                            Hash:{" "}
                            <span className="text-purple-400/80">
                              {cred.transactionHash.slice(0, 10)}...
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* GRAPH () */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" /> Verification
                Volume
              </h3>
              <div className="flex items-end gap-2 h-32 w-full">
                {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-purple-500/20 hover:bg-purple-500/40 rounded-t-lg transition-all relative group"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {h} verify
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* GRAPH (REPLACED WITH GAS TRACKER) */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-purple-400" />
                  Gas Tracker
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Updates
                </div>
              </div>

              {/* 1. Live Gas Price Indicator (Gwei) */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Safe",
                    gwei: "35",
                    time: "~2 min",
                    color: "text-green-400",
                  },
                  {
                    label: "Standard",
                    gwei: "38",
                    time: "~45 sec",
                    color: "text-blue-400",
                    active: true,
                  },
                  {
                    label: "Fast",
                    gwei: "45",
                    time: "<15 sec",
                    color: "text-purple-400",
                  },
                ].map((tier, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border ${
                      tier.active
                        ? "bg-white/[0.05] border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                        : "bg-white/[0.02] border-white/5"
                    } flex flex-col items-center text-center transition-all hover:bg-white/[0.05] cursor-pointer`}
                  >
                    <span className={`text-sm font-bold ${tier.color}`}>
                      {tier.label}
                    </span>
                    <div className="text-xl font-bold my-1">
                      {tier.gwei}{" "}
                      <span className="text-xs text-zinc-500 font-normal">
                        Gwei
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tier.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* 2. Cost Estimation */}
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-200">
                      Est. Mint Cost
                    </div>
                    <div className="text-xs text-zinc-500">
                      Based on Standard Gas
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    ~0.004 MATIC
                  </div>
                  <div className="text-xs text-zinc-400">($0.02 USD)</div>
                </div>
              </div>

              {/* 3. Transaction History (Polygonscan style) */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Recent Transactions
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      hash: "0x71...92A1",
                      method: "Mint",
                      time: "2 mins ago",
                      status: "Success",
                    },
                    {
                      hash: "0x3a...B4c9",
                      method: "Approve",
                      time: "15 mins ago",
                      status: "Success",
                    },
                    {
                      hash: "0x99...12dF",
                      method: "Transfer",
                      time: "1 hr ago",
                      status: "Success",
                    },
                  ].map((tx, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 hover:bg-white/[0.03] rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <div className="flex flex-col">
                          <span className="text-sm text-purple-300 group-hover:text-purple-200 font-mono flex items-center gap-1 cursor-pointer">
                            {tx.hash}{" "}
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {tx.method}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500">{tx.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Requests */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-300 uppercase tracking-wider text-sm">
                <Bell className="w-4 h-4 text-amber-400" />
                Pending Requests
              </h2>

              <div className="space-y-3">
                {pending.length > 0 ? (
                  <AnimatePresence>
                    {pending.map((req) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 relative overflow-hidden"
                      >
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white text-sm">
                              {req.studentName}
                            </h4>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                              ZKP Ready
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mb-4">
                            Requesting:{" "}
                            <span className="text-white">{req.title}</span>
                          </p>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(req)}
                              disabled={loadingId === req.id}
                              className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-2"
                            >
                              {loadingId === req.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Approve & Mint"
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
                    <p className="text-sm text-zinc-500">No pending requests</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
