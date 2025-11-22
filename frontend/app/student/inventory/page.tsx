"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Download,
  Share2,
  Search,
  Filter,
  CheckCircle,
  Clock,
  X,
  Menu,
  Wallet,
  Loader2,
  Hexagon,
  Sparkles,
  Shield,
} from "lucide-react";

// --- SHARED TYPES ---
interface Credential {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verified: boolean;
  nftAddress?: string;
  category: "Development" | "Blockchain" | "Design" | "Security";
  color: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "loading";
}

// --- MOCK DATA ---
const INITIAL_DATA: Credential[] = [
  {
    id: "1",
    title: "Advanced React Patterns",
    issuer: "TechCertified Academy",
    date: "2024-11-15",
    verified: true,
    nftAddress: "0x71C...9A21",
    category: "Development",
    color: "#3b82f6",
  },
  {
    id: "2",
    title: "Solidity Smart Contracts",
    issuer: "Web3 University",
    date: "2024-10-20",
    verified: true,
    nftAddress: "0x892...B31C",
    category: "Blockchain",
    color: "#8b5cf6",
  },
];

const CATEGORIES = ["All", "Development", "Blockchain", "Design", "Security"];

// --- COMPONENTS ---

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
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
            Z
          </div>
          <span>Skill-Z</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="/student/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </a>
          <a href="/inventory" className="text-white">
            Inventory
          </a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <span>0x7f...a3c2</span>
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
          <a href="/dashboard" className="text-zinc-400">
            Dashboard
          </a>
          <a href="/inventory" className="text-white">
            Inventory
          </a>
        </div>
      )}
    </nav>
  );
};

// --- MAIN PAGE ---

export default function InventoryPage() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inventoryData, setInventoryData] =
    useState<Credential[]>(INITIAL_DATA);
  const [filteredData, setFilteredData] = useState<Credential[]>(INITIAL_DATA);

  // --- LOCAL STORAGE SYNC ---
  useEffect(() => {
    // 1. Fetch Approved Credentials
    const storedIssued = JSON.parse(
      localStorage.getItem("skill-z-issued-credentials") || "[]"
    );
    const newCreds = storedIssued.map((c: any) => ({
      id: c.id,
      title: c.title,
      issuer: "TechCertified Academy",
      date: c.issuedDate,
      verified: true,
      nftAddress: c.transactionHash || "0x...",
      category: "Development", // Default for hackathon
      color: "#8b5cf6",
    }));

    // 2. Fetch Pending Requests
    const storedPending = JSON.parse(
      localStorage.getItem("skill-z-pending-requests") || "[]"
    );
    const pendingCreds = storedPending.map((req: any) => ({
      id: req.id,
      title: req.title,
      issuer: "TechCertified Academy",
      date: "Processing",
      verified: false,
      category: "Development",
      color: "#fbbf24",
    }));

    // Merge Unique
    const allCreds = [...INITIAL_DATA, ...newCreds, ...pendingCreds];
    // Simple dedupe by ID
    const uniqueCreds = allCreds.filter(
      (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
    );

    setInventoryData(uniqueCreds);
  }, []);

  // Filter Logic
  useEffect(() => {
    const filtered = inventoryData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.issuer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
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

  const handleDownload = () => {
    addToast("Fetching metadata from IPFS...", "loading");
    setTimeout(() => addToast("Certificate Downloaded", "success"), 2000);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background FX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

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
                Full{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Inventory
                </span>
              </h1>
              <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Hexagon className="w-4 h-4 text-cyan-400" />{" "}
                  {inventoryData.length} Total
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />{" "}
                  {inventoryData.filter((c) => c.verified).length} Verified
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search credentials..."
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
            {filteredData.map((cred, idx) => (
              <motion.div
                layout
                key={cred.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all flex flex-col justify-between min-h-[280px]"
              >
                {/* Hover Gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom right, ${cred.color}10, transparent)`,
                  }}
                />

                <div>
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Award
                        className="w-6 h-6"
                        style={{ color: cred.color }}
                      />
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                        cred.verified
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {cred.verified ? "Verified" : "Pending Vote"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-100 transition-colors">
                    {cred.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4">{cred.issuer}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-zinc-300 border border-white/5">
                      {cred.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-zinc-300 border border-white/5 font-mono">
                      {cred.date}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-3 relative z-10">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cred.title);
                      addToast("Copied details", "success");
                    }}
                    className="flex-1 py-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>

                {cred.nftAddress && (
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-zinc-600">
                    ID: {cred.nftAddress.slice(0, 8)}...
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
