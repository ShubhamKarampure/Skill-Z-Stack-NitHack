"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Loader2,
  BarChart3,
  CheckCircle,
  GraduationCap,
  FileBadge,
  Plus,
  ScrollText,
} from "lucide-react";
import SkillConstellation from "@/components/skill-constellation";
import { SkillDetailSidebar } from "@/components/skill-detail-sidebar";
import { Credential, CredentialType } from "@/lib/types";
import { generateSkillConstellation } from "@/lib/generate-constellation";
import { credentialService } from "@/lib/api";
import { ConstellationNode, NodeStatus } from "@/lib/types";

// --- UTILS ---
// Helper for Icons based on Enum
const CredentialIcon = ({ type }: { type: CredentialType }) => {
  switch (type) {
    case CredentialType.DEGREE:
      return <ScrollText size={20} />;
    case CredentialType.CERTIFICATE:
      return <GraduationCap size={20} />;
    case CredentialType.BADGE:
      return <Award size={20} />;
    default:
      return <FileBadge size={20} />;
  }
};

// Helper for Colors based on Enum
const getCredentialColorClass = (type: CredentialType) => {
  switch (type) {
    case CredentialType.DEGREE:
      return "bg-purple-500/10 text-purple-400";
    case CredentialType.CERTIFICATE:
      return "bg-blue-500/10 text-blue-400";
    case CredentialType.BADGE:
      return "bg-amber-500/10 text-amber-400";
    default:
      return "bg-zinc-500/10 text-zinc-400";
  }
};

// --- SUB-COMPONENTS ---

const AnalyticsCard = () => (
  <div className="p-6 rounded-2xl bg-white/2 border border-white/5 relative overflow-hidden h-full min-h-[250px] flex flex-col justify-between">
    <div className="flex justify-between items-start z-10">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" /> Skill Growth
        </h3>
        <p className="text-xs text-zinc-400">Last 6 months</p>
      </div>
      <span className="text-2xl font-bold text-emerald-400">+24%</span>
    </div>

    {/* Simple Bar Chart Visualization */}
    <div className="flex items-end justify-between h-32 gap-2 z-10">
      {[40, 65, 45, 80, 60, 95].map((height, i) => (
        <div
          key={`chart-bar-${i}`}
          className="w-full flex flex-col gap-2 group"
        >
          <div className="relative w-full bg-white/5 rounded-t-sm h-full overflow-hidden">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="absolute bottom-0 w-full bg-linear-to-t from-cyan-500/20 to-cyan-500/60"
            />
          </div>
        </div>
      ))}
    </div>

    <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent pointer-events-none" />
  </div>
);

// --- MAIN PAGE ---
export default function StudentDashboard() {
  // State for Data
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);
  const [selectedCredential, setSelectedCredential] =
    useState<Credential | null>(null);

  // Constellation State
  const [constellationData, setConstellationData] = useState<
    ConstellationNode[]
  >([]);
  const [isGeneratingConstellation, setIsGeneratingConstellation] =
    useState(false);

  // 1. FETCH CREDENTIALS FROM API
  useEffect(() => {
    const fetchCredentials = async () => {
      setIsLoadingCredentials(true);
      try {
        const response = await credentialService.getAllCredentials();
        if (response.success && response.data) {
          setCredentials(response.data);
        } else {
          console.error("Failed to fetch:", response.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoadingCredentials(false);
      }
    };

    fetchCredentials();
  }, []);

  // 2. GENERATE CONSTELLATION (Depends on Credentials)
  useEffect(() => {
    const initConstellation = async () => {
      // Only run if we have credentials and are in browser
      if (typeof window === "undefined" || credentials.length === 0) return;

      // Extract unique skills safely
      const currentSkills = Array.from(
        new Set(
          credentials.flatMap((c) => c.metadata.skills || []) // Safe fallback
        )
      );

      if (currentSkills.length === 0) return;

      const cacheKey = `skill-constellation-v3-${currentSkills
        .sort()
        .join("-")}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        try {
          setConstellationData(JSON.parse(cachedData));
          return;
        } catch (error) {
          console.warn("Failed to parse cached constellation data", error);
        }
      }

      setIsGeneratingConstellation(true);
      try {
        const aiNodes = await generateSkillConstellation(currentSkills);
        if (aiNodes && aiNodes.length > 0) {
          setConstellationData(aiNodes);
          localStorage.setItem(cacheKey, JSON.stringify(aiNodes));
        }
      } catch (e) {
        console.error("Failed to generate constellation:", e);
      } finally {
        setIsGeneratingConstellation(false);
      }
    };

    if (!isLoadingCredentials) {
      initConstellation();
    }
  }, [credentials, isLoadingCredentials]);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const node = constellationData.find((n) => n.id === nodeId);
      if (!node) return;

      if (node.status === NodeStatus.GHOST) {
        alert(
          `Skill Path: ${node.name} is recommended for you. Course modules would open here.`
        );
        return;
      }

      const cred = credentials.find((c) =>
        (c.metadata.skills || []).some((skill) =>
          skill.toLowerCase().includes(node.name.toLowerCase())
        )
      );

      if (cred) {
        setSelectedCredential(cred);
      }
    },
    [constellationData, credentials]
  );

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      {/* Background Ambient Light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-20">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight mb-1">
              Student{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Dashboard
              </span>
            </h1>
            <p className="text-zinc-400 text-sm">
              Visualize your knowledge graph and credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-white/10">
              <Plus className="w-4 h-4" /> Add Credential
            </button>
          </div>
        </header>

        {/* LOADING STATE OVERLAY */}
        {isLoadingCredentials && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b]/80 backdrop-blur-md">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white">
              Fetching Credentials...
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              Verifying blockchain assets
            </p>
          </div>
        )}

        {!isLoadingCredentials && (
          <>
            {/* HERO: SKILL CONSTELLATION */}
            <section className="mb-8 relative">
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
                {isGeneratingConstellation && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
                    <p className="text-cyan-200 font-mono text-sm animate-pulse">
                      Constructing Neural Knowledge Graph...
                    </p>
                  </div>
                )}
                <SkillConstellation
                  nodes={constellationData}
                  onNodeClick={handleNodeClick}
                />
              </div>
            </section>

            {/* BOTTOM GRID: ANALYTICS & CREDENTIALS */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* LEFT: Analytics & Actions */}
              <div className="space-y-6">
                <div className="h-[280px]">
                  <AnalyticsCard />
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-zinc-400 text-xs uppercase font-bold mb-1">
                      Certificates
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      {
                        credentials.filter(
                          (c) => c.credentialType === CredentialType.CERTIFICATE
                        ).length
                      }
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-zinc-400 text-xs uppercase font-bold mb-1">
                      Badges
                    </div>
                    <div className="text-2xl font-bold text-amber-400">
                      {
                        credentials.filter(
                          (c) => c.credentialType === CredentialType.BADGE
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Credentials List (Span 2) */}
              <div className="lg:col-span-2 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileBadge className="w-5 h-5 text-zinc-400" /> Recent
                    Verification
                  </h2>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300">
                    View All
                  </button>
                </div>

                <div className="flex-1 space-y-3">
                  {credentials.map((cred) => {
                    const skills = cred.metadata.skills || [];
                    return (
                      <button
                        key={cred.tokenId}
                        onClick={() => setSelectedCredential(cred)}
                        className="w-full text-left group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${getCredentialColorClass(
                              cred.credentialType
                            )}`}
                          >
                            <CredentialIcon type={cred.credentialType} />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm md:text-base text-zinc-200 group-hover:text-white transition-colors">
                              {cred.metadata.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <span>{cred.issuer}</span>
                              <span>•</span>
                              <span>
                                {new Date(cred.issuedAt).toLocaleDateString(
                                  "en-US"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pl-4">
                          <div className="hidden md:flex flex-wrap gap-1 justify-end max-w-[200px]">
                            {skills.slice(0, 2).map((skill, i) => (
                              <span
                                key={`${cred.tokenId}-skill-${i}`}
                                className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-zinc-400 border border-white/5"
                              >
                                {skill}
                              </span>
                            ))}
                            {skills.length > 2 && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-zinc-500 border border-white/5">
                                +{skills.length - 2}
                              </span>
                            )}
                          </div>
                          <CheckCircle className="w-5 h-5 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* SIDEBAR OVERLAY */}
      <SkillDetailSidebar
        credential={selectedCredential}
        onClose={() => setSelectedCredential(null)}
      />
    </main>
  );
}
