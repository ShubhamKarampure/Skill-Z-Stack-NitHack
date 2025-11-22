"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Download,
  Share2,
  Plus,
  Zap,
  CheckCircle,
  Clock,
  Menu,
  X,
  Wallet,
  Loader2,
  TrendingUp,
  Target,
  BookOpen,
  MoreHorizontal,
  Star,
  FileText,
  BarChart3,
} from "lucide-react";
import { SkillConstellation } from "@/components/skill-constellation";
import { SkillDetailSidebar } from "@/components/skill-detail-sidebar";

// --- TYPES & INTERFACES ---
interface Credential {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verified: boolean;
  color: string;
}

interface Skill {
  id: string;
  name: string;
  level?: number;
  endorsements: number;
  status: "verified" | "pending" | "expired";
  issuer?: string;
  issueDate?: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "loading";
}

// --- INITIAL MOCK DATA ---
const INITIAL_CREDENTIALS: Credential[] = [
  {
    id: "1",
    title: "Advanced React",
    issuer: "TechCertified Academy",
    date: "2024-11-15",
    verified: true,
    color: "#3b82f6",
  },
];

const INITIAL_SKILLS: Skill[] = [
  {
    id: "1",
    name: "React.js",
    level: 95,
    endorsements: 24,
    status: "verified",
    issuer: "Meta",
  },
];

// --- NEW MOCK DATA FOR FEATURES ---
const MOCK_BADGES = [
  {
    id: 1,
    icon: Zap,
    label: "Fast Learner",
    locked: false,
    color: "text-yellow-400",
  },
  {
    id: 2,
    icon: Star,
    label: "Top 1%",
    locked: false,
    color: "text-purple-400",
  },
  {
    id: 3,
    icon: Target,
    label: "Goal Crusher",
    locked: true,
    color: "text-zinc-600",
  },
  { id: 4, icon: Award, label: "Mentor", locked: true, color: "text-zinc-600" },
];

const MOCK_ACTIVITIES = [
  {
    id: 1,
    text: "Earned 'Advanced React'",
    time: "2h ago",
    type: "credential",
  },
  {
    id: 2,
    text: "Endorsed by Sarah Chen",
    time: "5h ago",
    type: "endorsement",
  },
  { id: 3, text: "Started 'Web3 Security'", time: "1d ago", type: "learning" },
];

const MOCK_LEARNING_PATHS = [
  {
    id: 1,
    title: "Smart Contract Security",
    level: "Hard",
    time: "12h",
    category: "Web3",
  },
  {
    id: 2,
    title: "UI/UX Principles",
    level: "Medium",
    time: "8h",
    category: "Design",
  },
  {
    id: 3,
    title: "Rust Fundamentals",
    level: "Hard",
    time: "20h",
    category: "Backend",
  },
];

// --- COMPONENTS ---

// 1. ANALYTICS COMPONENT
const AnalyticsCard = () => (
  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" /> Skill Growth
        </h3>
        <p className="text-xs text-zinc-400">Last 6 months activity</p>
      </div>
      <div className="text-right">
        <span className="text-2xl font-bold text-emerald-400">+24%</span>
        <div className="text-xs text-zinc-500">vs last month</div>
      </div>
    </div>

    {/* Mock Bar Chart */}
    <div className="flex items-end justify-between h-32 gap-2">
      {[40, 65, 45, 80, 60, 95].map((height, i) => (
        <div
          key={i}
          className="w-full flex flex-col gap-2 group cursor-pointer"
        >
          <div className="relative w-full bg-white/5 rounded-t-sm h-full overflow-hidden">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-500/20 to-cyan-500/60 group-hover:to-cyan-400 transition-all"
            />
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-between mt-2 text-xs text-zinc-500 font-mono">
      <span>MAY</span>
      <span>JUN</span>
      <span>JUL</span>
      <span>AUG</span>
      <span>SEP</span>
      <span>OCT</span>
    </div>
  </div>
);
// 2. ACTIVITY FEED COMPONENT
const ActivityFeed = () => (
  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
    <h3 className="font-bold mb-4 text-white flex items-center justify-between">
      <span>Recent Activity</span>
      <Clock className="w-4 h-4 text-zinc-500" />
    </h3>
    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:h-full before:w-px before:bg-white/10 before:bottom-0">
      {MOCK_ACTIVITIES.map((activity) => (
        <div key={activity.id} className="relative flex gap-4 pl-8 pr-2">
          <div className="absolute left-0 top-1 w-[23px] h-[23px] bg-[#09090b] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-200 break-words">{activity.text}</p>
            <span className="text-xs text-zinc-500 font-mono">
              {activity.time}
            </span>
          </div>
        </div>
      ))}
    </div>
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
          {toast.type === "info" && <Zap className="w-4 h-4 text-amber-400" />}
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
          <a href="/dashboard" className="text-white">
            Dashboard
          </a>
          <a
            href="/student/inventory"
            className="hover:text-white transition-colors"
          >
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
        <div className="md:hidden absolute w-full bg-[#09090b] border-b border-white/10 p-4 flex flex-col gap-4">
          <a href="/dashboard" className="text-white">
            Dashboard
          </a>
          <a href="/inventory" className="text-zinc-400">
            Inventory
          </a>
        </div>
      )}
    </nav>
  );
};

const RequestModal = ({
  isOpen,
  onClose,
  onRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRequest: (name: string, institute: string) => void;
}) => {
  const [skillName, setSkillName] = useState("");
  const [institute, setInstitute] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#18181b] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-white">
          Request Verification
        </h2>
        <div className="space-y-4">
          <input
            autoFocus
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="Skill Name (e.g. Next.js)"
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
          />
          <select
            value={institute}
            onChange={(e) => setInstitute(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select Institute</option>
            <option value="TechCertified Academy">TechCertified Academy</option>
            <option value="Web3 University">Web3 University</option>
          </select>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onRequest(skillName, institute);
                onClose();
              }}
              className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---
export default function StudentDashboard() {
  const [credentials, setCredentials] =
    useState<Credential[]>(INITIAL_CREDENTIALS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // --- LOCAL STORAGE SYNC ---
  useEffect(() => {
    // 1. Check for Pending Requests sent by me
    const storedPending = JSON.parse(
      localStorage.getItem("skill-z-pending-requests") || "[]"
    );

    // 2. Check for Approved Credentials (from Institute)
    const storedIssued = JSON.parse(
      localStorage.getItem("skill-z-issued-credentials") || "[]"
    );

    // Merge into local state for display
    if (storedIssued.length > 0) {
      const newCreds = storedIssued.map((c: any) => ({
        id: c.id,
        title: c.title,
        issuer: "TechCertified Academy", // Simplified for hackathon
        date: c.issuedDate,
        verified: true,
        color: "#8b5cf6", // Purple for verified
      }));

      // Filter out duplicates based on ID
      const uniqueCreds = [...INITIAL_CREDENTIALS, ...newCreds].filter(
        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
      );
      setCredentials(uniqueCreds);

      // Update Constellation Skills
      const newSkills = storedIssued.map((c: any) => ({
        id: c.id,
        name: c.title,
        level: 80, // Mock score
        endorsements: 1,
        status: "verified",
        issuer: "TechCertified Academy",
      }));
      const uniqueSkills = [...INITIAL_SKILLS, ...newSkills].filter(
        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
      );
      setSkills(uniqueSkills);
    }
  }, []);

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  };

  const handleRequest = (name: string, institute: string) => {
    if (!name || !institute) return;

    const newRequest = {
      id: Date.now().toString(),
      studentName: "Alex Chen", // Hardcoded user
      title: name,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    const existing = JSON.parse(
      localStorage.getItem("skill-z-pending-requests") || "[]"
    );
    localStorage.setItem(
      "skill-z-pending-requests",
      JSON.stringify([...existing, newRequest])
    );

    const tempCred: Credential = {
      id: newRequest.id,
      title: name,
      issuer: institute,
      date: "Processing...",
      verified: false,
      color: "#fbbf24",
    };
    setCredentials([tempCred, ...credentials]);
    addToast("Request sent to Institute Portal", "success");
  };

  const skillNodes = skills.map((s) => ({
    id: s.id,
    name: s.name,
    status: s.status,
    endorsements: s.endorsements,
  }));

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <ToastContainer toasts={toasts} />
      <Navbar />
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequest={handleRequest}
      />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Student <span className="text-cyan-400">Dashboard</span>
            </h1>
            <p className="text-zinc-400">
              Track verification status and view your wallet.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-6 py-3 bg-white text-black rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Request Verification
            </button>
          </motion.div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* --- LEFT/MAIN COLUMN (Span 2) --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Skill Constellation (Existing) */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl h-[450px]">
              <SkillConstellation
                skills={skillNodes}
                onNodeClick={(n) => {
                  const f = skills.find((s) => s.id === n.id);
                  if (f) setSelectedSkill(f);
                }}
              />
            </div>

            {/* FEATURE 1: Analytics Card */}
            <AnalyticsCard />

            {/* 2. Credentials List (Existing) */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Credential Status</h2>
              {credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex justify-between items-center transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${cred.color}15`,
                        color: cred.color,
                      }}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">{cred.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span>{cred.issuer}</span>
                        {cred.verified ? (
                          <span className="text-emerald-400 flex items-center text-xs gap-1">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center text-xs gap-1">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FEATURE 5: Learning Path Suggestions */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Recommended Paths
                </h2>
                <button className="text-sm text-cyan-400 hover:underline">
                  View All
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {MOCK_LEARNING_PATHS.map((path) => (
                  <div
                    key={path.id}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-white/5 text-zinc-400">
                        {path.category}
                      </span>
                      <BookOpen className="w-4 h-4 text-cyan-500" />
                    </div>
                    <h4 className="font-bold text-sm mb-2 line-clamp-1">
                      {path.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span
                        className={
                          path.level === "Hard"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }
                      >
                        {path.level}
                      </span>
                      <span>•</span>
                      <span>{path.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN / SIDEBAR --- */}
          <div className="space-y-6">
            {/* FEATURE 4: Quick Actions */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-900/20 to-transparent border border-white/10">
              <h3 className="font-bold mb-4 text-white text-sm uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" /> Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center justify-center gap-2 transition-all"
                  onClick={() => addToast("Portfolio PDF Exported", "success")}
                >
                  <Download className="w-5 h-5 text-zinc-300" />
                  <span className="text-xs text-zinc-400">Export PDF</span>
                </button>
                <button
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center justify-center gap-2 transition-all"
                  onClick={() => addToast("Profile Link Copied", "success")}
                >
                  <Share2 className="w-5 h-5 text-zinc-300" />
                  <span className="text-xs text-zinc-400">Share Profile</span>
                </button>
                <button
                  className="col-span-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2 transition-all"
                  onClick={() => addToast("Goal Tracking Started", "info")}
                >
                  <Target className="w-4 h-4 text-zinc-300" />
                  <span className="text-xs text-zinc-400">
                    Set Weekly Goals
                  </span>
                </button>
              </div>
            </div>

            {/* Existing Wallet Stats */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="font-bold mb-4 text-zinc-400 text-sm uppercase">
                Wallet Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Total Skills</span>
                  <span className="text-white font-mono">{skills.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Verified</span>
                  <span className="text-cyan-400 font-mono">
                    {credentials.filter((c) => c.verified).length}
                  </span>
                </div>
              </div>
            </div>

            {/* FEATURE 2: Achievement Badges */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-400 text-sm uppercase">
                  Achievements
                </h3>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">
                  2/4
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {MOCK_BADGES.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-1 group relative"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                        badge.locked
                          ? "bg-white/5 border-white/5 opacity-50"
                          : "bg-white/10 border-white/10 shadow-lg shadow-cyan-500/20"
                      }`}
                    >
                      <badge.icon className={`w-5 h-5 ${badge.color}`} />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute -top-8 scale-0 group-hover:scale-100 transition-all bg-black border border-white/20 text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE 3: Activity Feed */}
            <ActivityFeed />
          </div>
        </div>
      </div>
      <SkillDetailSidebar
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </main>
  );
}
