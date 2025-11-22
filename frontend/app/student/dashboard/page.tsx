"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Award,
  Download,
  Share2,
  Plus,
  Zap,
  Lock,
  CheckCircle,
  Sparkles,
  MoreHorizontal,
  Hexagon,
  Shield,
  Clock
} from "lucide-react";

// Import your existing complex components
// Ensure these components accept className props or are transparent enough to blend in
import { SkillConstellation } from "@/components/skill-constellation";
import { SkillDetailSidebar } from "@/components/skill-detail-sidebar";

// --- SHARED STYLING COMPONENTS (From Landing Page) ---

const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute -top-1/2 -left-1/2 w-full h-full">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20"
        style={{ backgroundImage: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{ backgroundImage: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
        animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  </div>
);

const GridPattern = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.03] -z-10">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

const MagneticButton = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;
    setPos({ x, y });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
    >
      {children}
    </motion.button>
  );
};

// --- TYPES ---

interface Credential {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verified: boolean;
  nftAddress?: string;
  color: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  endorsements: number;
  status: "verified" | "pending" | "expired";
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
}

// --- DASHBOARD COMPONENT ---

export default function StudentDashboard() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Mock Data (Enhanced with colors for UI consistency)
  const credentials: Credential[] = [
    {
      id: "1",
      title: "Advanced React Development",
      issuer: "TechCertified Academy",
      date: "2024-11-15",
      verified: true,
      nftAddress: "0x1234...5678",
      color: "#3b82f6" // Blue
    },
    {
      id: "2",
      title: "Blockchain Fundamentals",
      issuer: "Web3 University",
      date: "2024-10-20",
      verified: true,
      nftAddress: "0x8765...4321",
      color: "#8b5cf6" // Purple
    },
    {
      id: "3",
      title: "UI/UX Design Masterclass",
      issuer: "Design Institute",
      date: "2024-09-10",
      verified: false,
      color: "#ec4899" // Pink
    },
  ];

  const skills: Skill[] = [
    { id: "1", name: "React.js", level: 95, endorsements: 24, status: "verified" },
    { id: "2", name: "Solidity", level: 88, endorsements: 18, status: "verified" },
    { id: "3", name: "Python", level: 82, endorsements: 15, status: "verified" },
    { id: "4", name: "AWS Cloud", level: 75, endorsements: 12, status: "verified" },
    { id: "6", name: "Java SE", level: 65, endorsements: 8, status: "expired" },
  ];

  const skillNodes = skills.map((s) => ({ id: s.id, name: s.name, status: s.status, endorsements: s.endorsements }));

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      <Aurora />
      <GridPattern />

      {/* Dashboard Container */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="font-bold text-lg">S</span>
               </div>
               <span className="text-zinc-400 font-mono text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
                 0x7f8...a3c2
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Your Skills <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Galaxy</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <MagneticButton className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2 group">
              <Plus className="w-4 h-4" />
              <span>Mint Credential</span>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Stats Row - Styled like Landing Page Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Credentials", value: credentials.length, color: "text-blue-400" },
            { label: "Verified", value: credentials.filter(c => c.verified).length, color: "text-emerald-400" },
            { label: "Endorsements", value: skills.reduce((acc, s) => acc + s.endorsements, 0), color: "text-purple-400" },
            { label: "Reputation Score", value: "847", color: "text-amber-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
            >
              <p className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 3D Visualization Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm min-h-[400px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 pointer-events-none" />
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Interactive Constellation</h2>
                <div className="flex gap-2">
                   <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"/>
                   <span className="text-xs text-zinc-500">Live Network</span>
                </div>
              </div>
              <div className="p-4 h-[400px]">
                {/* Assuming SkillConstellation handles its own transparency/sizing */}
                <SkillConstellation skills={skillNodes} onNodeClick={setSelectedSkill} />
              </div>
            </motion.section>

            {/* Credentials List */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Credentials</h2>
                <button className="text-sm text-zinc-400 hover:text-white transition-colors">View All</button>
              </div>
              
              <div className="space-y-4">
                {credentials.map((cred, idx) => (
                  <motion.div
                    key={cred.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1"
                  >
                    {/* Hover Gradient Effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                      style={{ background: `linear-gradient(to right, ${cred.color}10, transparent)` }}
                    />
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${cred.color}20` }}
                        >
                          <Award className="w-6 h-6" style={{ color: cred.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg">{cred.title}</h3>
                            {cred.verified && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 text-xs text-emerald-400 font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400">{cred.issuer} • {cred.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                         {cred.nftAddress && (
                            <div className="hidden md:block text-right mr-4">
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Token ID</p>
                                <p className="text-xs font-mono text-zinc-300">{cred.nftAddress}</p>
                            </div>
                         )}
                         <div className="flex gap-2">
                           <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-blue-400 transition-colors">
                             <Share2 className="w-4 h-4" />
                           </button>
                           <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-purple-400 transition-colors">
                             <Download className="w-4 h-4" />
                           </button>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (1/3) - Sidebar */}
          <div className="space-y-6">
            
            {/* Top Skills Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Hexagon className="w-4 h-4 text-purple-400" />
                Top Skills
              </h3>
              <div className="space-y-4">
                {skills.slice(0, 4).map((skill) => (
                  <div 
                    key={skill.id}
                    className="group cursor-pointer"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-200 group-hover:text-white transition-colors">{skill.name}</span>
                      <span className="text-blue-400 font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Zero Knowledge Proofs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-1 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20"
            >
              <div className="p-5 rounded-xl bg-[#09090b]/80 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-sm">Zero-Knowledge Proof</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Prove you have a skill 80% without revealing your identity or exact score.
                </p>
                <button className="w-full py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-colors">
                  Generate Proof
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 ml-2">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Request Endorsement", icon: Zap, color: "text-amber-400" },
                  { label: "Export CV to Wallet", icon: Share2, color: "text-blue-400" },
                  { label: "View Blockchain History", icon: Clock, color: "text-zinc-400" },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all flex items-center gap-3 text-sm text-zinc-300 group"
                  >
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                    <span className="group-hover:text-white transition-colors">{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <SkillDetailSidebar skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </main>
  );
}