"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  FileBadge,
  Zap,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Fuel,
  Loader2,
  ShieldCheck,
  BadgeCheck,
  Wallet,
  AlertCircle,
} from "lucide-react";

// Imports
import { authService, UserProfile } from "@/lib/api"; // Adjust path to your api file
import { useAuthStore } from "@/lib/store"; // Adjust path to your store

// --- 1. Gas Tracker Component (Preserved) ---
const GasTracker = () => {
  const [gas, setGas] = useState(34); // Mock Gwei

  useEffect(() => {
    const interval = setInterval(() => {
      setGas((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-span-1 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
        <Fuel className="w-24 h-24 text-purple-500" />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> Network
            Status
          </h3>
          <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
            Polygon Mainnet
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Standard", val: gas, color: "text-emerald-400" },
          { label: "Fast", val: gas + 2, color: "text-blue-400" },
          { label: "Instant", val: gas + 5, color: "text-purple-400" },
        ].map((tier, i) => (
          <div
            key={i}
            className="bg-black/40 rounded-lg p-2 border border-white/5"
          >
            <div className={`text-xl font-bold font-mono ${tier.color}`}>
              {tier.val}
            </div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold">
              {tier.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 text-xs text-zinc-400 flex justify-between">
        <span>Est. Mint Cost:</span>
        <span className="text-white font-mono">~0.003 MATIC</span>
      </div>
    </div>
  );
};

// --- 2. Stat Card Component (Preserved) ---
const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
      </div>
      <span className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
        +12% <ArrowUpRight className="w-3 h-3 ml-1" />
      </span>
    </div>
    <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
    <p className="text-sm text-zinc-400">{title}</p>
    <p className="text-xs text-zinc-500 mt-2">{sub}</p>
  </motion.div>
);

// --- MAIN DASHBOARD COMPONENT ---
export default function DashboardOverview() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Zustand store hook to sync data
  const { updateUser } = useAuthStore();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await authService.getProfile();

        console.log("Dashboard Data:", response);

        if (response.success && response.user) {
          // 1. Update Local State for UI
          setProfile(response.user);

          // 2. CRITICAL: Update Global Store
          // This ensures the Navbar knows about 'instituteData' immediately
          updateUser({
            name: response.user.name,
            walletAddress: response.user.walletAddress,
            instituteData: response.user.instituteData,
            role: response.user.role, // ensure role is synced
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [updateUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading Dashboard...</span>
      </div>
    );
  }

  // Helper variables for cleaner JSX
  const isInstitute = profile?.role === "institute";
  const instData = profile?.instituteData;

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* --- HEADER SECTION: Name & Badges --- */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
            {profile?.name || "Institute"}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Dashboard
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Wallet Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-white/5 text-zinc-400 text-xs font-mono">
              <Wallet className="w-3 h-3" />
              {profile?.walletAddress
                ? `${profile.walletAddress.substring(
                    0,
                    6
                  )}...${profile.walletAddress.substring(38)}`
                : "No Wallet"}
            </div>

            {/* Institute Specific Badges */}
            {isInstitute && instData && (
              <>
                {/* Accreditation Status */}
                {instData.isAccredited ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                    <ShieldCheck className="w-4 h-4" />
                    Accredited
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wide">
                    <Clock className="w-4 h-4" />
                    Pending Accreditation
                  </div>
                )}

                {/* Registration Status */}
                {instData.isRegistered ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wide">
                    <BadgeCheck className="w-4 h-4" />
                    Authorized Issuer
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4" />
                    Not Registered
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* --- STATS GRID (Dynamic Data) --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Credentials"
          value={profile?.credentialCount || 0}
          sub="Lifetime issuance"
          icon={FileBadge}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Students"
          value={profile?.enrolledStudentCount || 0}
          sub="Currently enrolled"
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Pending Review"
          value={profile?.enrollmentCount || 0} // Assuming 'enrollmentCount' might be pending requests, or set to 0
          sub="Admission requests"
          icon={Clock}
          color="bg-amber-500"
        />
        <GasTracker />
      </div>

      {/* --- ANALYTICS SECTION (Preserved Mock Data for Visuals) --- */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-zinc-400" /> Issuance Velocity
            </h3>
            <select className="bg-black/50 border border-white/10 text-xs rounded-lg px-3 py-1 text-zinc-400 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          {/* Decorative Placeholder Graph */}
          <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4">
            {[35, 50, 45, 70, 60, 85, 95, 75, 60, 80, 50, 90].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1, delay: i * 0.05 }}
                className="w-full bg-gradient-to-t from-blue-600/20 to-purple-500/60 rounded-t-sm hover:from-blue-600/40 hover:to-purple-500/80 transition-colors relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black border border-white/10 text-xs px-2 py-1 rounded transition-opacity z-10">
                  {h}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-full">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-zinc-400" /> Recent Mints
          </h3>
          <div className="space-y-4">
            {[
              {
                name: "Alex Chen",
                cred: "B.S. Computer Science",
                time: "2m ago",
                hash: "0x7a...99",
              },
              {
                name: "Sarah M.",
                cred: "React Certification",
                time: "15m ago",
                hash: "0x8b...12",
              },
              {
                name: "Jordan L.",
                cred: "DeFi Specialist",
                time: "1h ago",
                hash: "0x3c...44",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0"
              >
                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm font-bold text-zinc-200">{item.name}</p>
                  <p className="text-xs text-zinc-400">{item.cred}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-white/5 px-1.5 rounded text-zinc-500 font-mono">
                      {item.hash}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-xs font-bold text-zinc-400 hover:text-white border border-white/5 hover:bg-white/5 rounded-lg transition-all">
            View All Transactions
          </button>
        </div>
      </div>
    </main>
  );
}
