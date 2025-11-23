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
  Wallet,
  AlertCircle,
  Lock,
  CheckCircle2,
} from "lucide-react";

// Imports - (Assuming these paths exist in your project)
import { authService, UserProfile } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

// --- 1. Account Status Banner Component ---
const AccountStatusBanner = ({ instituteData }: { instituteData: any }) => {
  if (!instituteData) return null;

  const { isRegistered, isAccredited } = instituteData;

  // Scenario 1: All Good -> Return Null so dashboard shows
  if (isRegistered && isAccredited) return null;

  // Scenario 2: Not Registered (CRITICAL - BLOCKING)
  if (!isRegistered) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-8 rounded-2xl bg-red-500/10 border border-red-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <AlertCircle className="w-40 h-40 text-red-500" />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-red-400 flex items-center gap-3 mb-3">
            <AlertCircle className="w-8 h-8" /> Registration Pending Approval
          </h3>
          <p className="text-zinc-300 max-w-2xl text-base leading-relaxed mb-6">
            Your institute is not currently registered on the blockchain
            network. Access to analytics, issuance tools, and student data is
            restricted until registration is complete. 
            Please wait for admin approval.
          </p>
          <div className="flex gap-4">
            
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Scenario 3: Registered but Pending Accreditation (Warning)
  if (!isAccredited) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Clock className="w-32 h-32 text-amber-500" />
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 animate-pulse" /> Accreditation Pending
          </h3>
          <p className="text-zinc-300 max-w-3xl text-sm leading-relaxed mb-4">
            Your account is currently under review. You can view the dashboard,
            but <strong>issuance is disabled</strong> until verification is
            complete.
          </p>

          <div className="flex items-center gap-3 text-xs font-mono bg-black/20 w-fit p-3 rounded-lg border border-amber-500/10">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Registered
            </div>
            <div className="w-8 h-[1px] bg-white/10" />
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Loader2 className="w-3 h-3 animate-spin" /> Awaiting Admin
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

// --- 2. Gas Tracker Component ---
const GasTracker = () => {
  const [gas, setGas] = useState(34);

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
          </h3>
          <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
            Polygon Mainnet
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-black/40 rounded-lg p-2 border border-white/5">
          <div className="text-xl font-bold font-mono text-emerald-400">
            {gas}
          </div>
          <div className="text-[10px] text-zinc-500 uppercase font-bold">
            Std
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Stat Card Component ---
const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  color,
  locked = false,
}: any) => (
  <motion.div
    className={`p-6 rounded-2xl border transition-all ${
      locked
        ? "bg-white/[0.01] border-white/5 opacity-40 cursor-not-allowed grayscale"
        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-xl ${
          locked ? "bg-zinc-800" : `${color} bg-opacity-10`
        }`}
      >
        <Icon
          className={`w-6 h-6 ${
            locked ? "text-zinc-500" : color.replace("bg-", "text-")
          }`}
        />
      </div>
      {locked && <Lock className="w-4 h-4 text-zinc-600" />}
    </div>
    <h3 className="text-3xl font-bold text-white mb-1">
      {locked ? "-" : value}
    </h3>
    <p className="text-sm text-zinc-400">{title}</p>
  </motion.div>
);

// --- MAIN DASHBOARD COMPONENT ---
export default function DashboardOverview() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { updateUser } = useAuthStore();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success && response.user) {
          setProfile(response.user);
          updateUser({
            name: response.user.name,
            walletAddress: response.user.walletAddress,
            instituteData: response.user.instituteData,
            role: response.user.role,
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
      </div>
    );
  }

  const instData = profile?.instituteData;

  // CHECK: Is the user actually registered on the blockchain?
  const isRegistered = instData?.isRegistered === true;

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
          {profile?.name || "Institute"}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Dashboard
          </span>
        </h1>
        <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono">
          <Wallet className="w-4 h-4" />
          {profile?.walletAddress || "No Wallet Connected"}
        </div>
      </div>

      {/* --- STATUS BANNER (Shows if not registered or not accredited) --- */}
      <AccountStatusBanner instituteData={instData} />

      {/* --- TOP STATS (Visible but Locked if not registered) --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Credentials"
          value={profile?.credentialCount || 0}
          icon={FileBadge}
          color="bg-blue-500"
          locked={!isRegistered} // Lock if not registered
        />
        <StatCard
          title="Active Students"
          value={profile?.enrolledStudentCount || 0}
          icon={Users}
          color="bg-purple-500"
          locked={!isRegistered}
        />
        <StatCard
          title="Pending Review"
          value={profile?.enrollmentCount || 0}
          icon={Clock}
          color="bg-amber-500"
          locked={!isRegistered}
        />
        {/* Only show Gas Tracker if registered, otherwise show placeholder or nothing */}
        {isRegistered ? (
          <GasTracker />
        ) : (
          <div className="col-span-1 p-6 rounded-2xl border border-white/5 bg-zinc-900/50 flex items-center justify-center text-zinc-600">
            <span className="flex items-center gap-2">
              <Lock size={16} /> Network Offline
            </span>
          </div>
        )}
      </div>

      {/* --- ANALYTICS & ACTIVITY SECTION --- */}
      {/* LOGIC: COMPLETELY REMOVED FROM DOM IF NOT REGISTERED */}
      {isRegistered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* 1. Main Chart Area */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-zinc-400" /> Issuance
                Velocity
              </h3>
              <select className="bg-black/50 border border-white/10 text-xs rounded-lg px-3 py-1 text-zinc-400 outline-none">
                <option>Last 30 Days</option>
              </select>
            </div>

            {/* Decorative Graph */}
            <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4">
              {[35, 50, 45, 70, 60, 85, 95, 75, 60, 80, 50, 90].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-full bg-gradient-to-t from-blue-600/20 to-purple-500/60 rounded-t-sm"
                />
              ))}
            </div>
          </div>

          {/* 2. Recent Activity Feed */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-full">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-zinc-400" /> Recent Mints
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0"
                >
                  <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-zinc-200">
                      Student Credential
                    </p>
                    <p className="text-xs text-zinc-400">Minted just now</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
