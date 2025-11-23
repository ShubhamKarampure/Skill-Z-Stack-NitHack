"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  ShieldCheck,
  FileDigit,
  ArrowRight,
  Zap,
  Settings,
  Database,
  Bell,
} from "lucide-react";
import Link from "next/link";

// --- COMPONENTS ---
const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
  </div>
);

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="p-6 rounded-2xl bg-white/0.02 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
        <Activity className="w-3 h-3" /> +12%
      </span>
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
      {title}
    </p>
  </div>
);

const QuickAction = ({ title, desc, icon: Icon, href }: any) => (
  <Link
    href={href}
    className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all flex items-center gap-4"
  >
    <div className="p-3 rounded-lg bg-black/40 text-zinc-400 group-hover:text-emerald-400 transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
        {title}
      </h4>
      <p className="text-xs text-zinc-500">{desc}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
  </Link>
);

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      <Aurora />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Admin{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600">
              Overview
            </span>
          </h1>
          <p className="text-zinc-400">
            System health, analytics, and quick configuration.
          </p>
        </div>

        {/* Analytics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            title="Total Issuers"
            value="24"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Credentials Minted"
            value="8,942"
            icon={FileDigit}
            color="emerald"
          />
          <StatCard
            title="System Uptime"
            value="99.9%"
            icon={Zap}
            color="amber"
          />
          <StatCard
            title="Active Protocols"
            value="4"
            icon={ShieldCheck}
            color="purple"
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Quick Actions Menu */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" /> Quick Actions
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <QuickAction
                title="Manage Members"
                desc="Accredit institutes or revoke access."
                icon={Users}
                href="/admin/members"
              />
              <QuickAction
                title="System Logs"
                desc="View immutable audit trails."
                icon={Database}
                href="/admin/logs"
              />
              <QuickAction
                title="Global Settings"
                desc="Configure gas limits and fees."
                icon={Settings}
                href="/admin/settings"
              />
              <QuickAction
                title="Notifications"
                desc="Broadcast alerts to all users."
                icon={Bell}
                href="/admin/alerts"
              />
            </div>

            {/* Recent Activity Graph Placeholder */}
            <div className="p-6 rounded-2xl bg-white/0.02 border border-white/5 h-64 flex flex-col items-center justify-center text-zinc-500">
              <Activity className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">
                Network Activity Chart would render here
              </p>
            </div>
          </div>

          {/* Right: System Status */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" /> Node Status
            </h2>
            <div className="p-6 rounded-2xl bg-white/0.02 border border-white/5 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-sm text-zinc-400">Indexer</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  OPERATIONAL
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-sm text-zinc-400">IPFS Gateway</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  OPERATIONAL
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Gas Tracker</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                  HIGH TRAFFIC
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-linear-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20">
              <h3 className="font-bold mb-2">Smart Contract v2.1</h3>
              <p className="text-sm text-zinc-400 mb-4">
                The governance contract is running the latest stable version.
              </p>
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
                Check for Upgrades
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
