"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Loader2,
  BarChart3,
  GraduationCap,
  FileBadge,
  Plus,
  ScrollText,
  Sparkles,
  X,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import SkillConstellation from "@/components/skill-constellation";
import { SkillDetailSidebar } from "@/components/skill-detail-sidebar";
import {
  Credential,
  CredentialType,
  ConstellationNode,
  NodeStatus,
} from "@/lib/types";
import { generateSkillConstellation } from "@/lib/generate-constellation";
import { credentialService } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

// --- UTILS ---

const resolveIPFS = (url?: string) => {
  if (!url) return null;
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }
  if (
    !url.startsWith("http") &&
    (url.startsWith("Qm") || url.startsWith("bafy"))
  ) {
    return `https://gateway.pinata.cloud/ipfs/${url}`;
  }
  return url;
};

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

const getCredentialColorClass = (type: CredentialType) => {
  switch (type) {
    case CredentialType.DEGREE:
      return "bg-pink-500/10 text-pink-400";
    case CredentialType.CERTIFICATE:
      return "bg-cyan-500/10 text-cyan-400";
    case CredentialType.BADGE:
      return "bg-amber-500/10 text-amber-400";
    default:
      return "bg-zinc-500/10 text-zinc-400";
  }
};

// --- UPDATED ANALYTICS CARD ---
const AnalyticsCard = () => {
  // MOCK DATA: Simulating skill acquisition over 6 months
  const chartData = [
    { label: "May", value: 30 },
    { label: "Jun", value: 45 },
    { label: "Jul", value: 40 },
    { label: "Aug", value: 75 },
    { label: "Sep", value: 60 },
    { label: "Oct", value: 90 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden h-full min-h-[280px] flex flex-col justify-between group hover:border-white/10 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start z-10 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" /> Skill Growth
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-400">Last 6 Months</span>
            <span className="flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
              <TrendingUp size={10} className="mr-1" /> +24%
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-white">12</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            New Skills
          </span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex items-end justify-between h-36 gap-3 z-10 px-1">
        {chartData.map((data, i) => (
          <div
            key={`chart-bar-${i}`}
            className="w-full flex flex-col gap-2 group/bar relative"
          >
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
              {data.value}% Coverage
            </div>

            <div className="relative w-full bg-white/5 rounded-t-sm h-full overflow-hidden rounded-md">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${data.value}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-500/20 via-cyan-500/50 to-cyan-400 group-hover/bar:to-cyan-300 transition-colors"
              />
            </div>
            <span className="text-[10px] text-zinc-500 text-center font-medium">
              {data.label}
            </span>
          </div>
        ))}
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
    </div>
  );
};

// --- MAIN PAGE ---
export default function StudentDashboard() {
  const { user } = useAuthStore();

  // Data State
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);

  // UI State
  const [selectedCredential, setSelectedCredential] =
    useState<Credential | null>(null);
  const [recommendationPopup, setRecommendationPopup] = useState<{
    name: string;
    reason: string;
  } | null>(null);

  // Constellation State
  const [constellationData, setConstellationData] = useState<
    ConstellationNode[]
  >([]);
  const [isGeneratingConstellation, setIsGeneratingConstellation] =
    useState(false);

  // 1. FETCH CREDENTIALS
  useEffect(() => {
    const fetchCredentials = async () => {
      if (!user?.walletAddress) {
        setIsLoadingCredentials(false);
        return;
      }
      setIsLoadingCredentials(true);
      try {
        const response = await credentialService.getCredentialsByAddress(
          user.walletAddress
        );
        if (response.success && response.data) {
          const rawCreds = response.data.credentials;
          const enrichedCredentials = await Promise.all(
            rawCreds.map(async (cred: any) => {
              let metadata = {
                name: "Unknown Credential",
                description: "No description available",
                image: "",
                skills: [],
                ...(cred.metadata?.metadata || cred.metadata || {}),
              };
              const uri = cred.metadataURI || cred.metadata?.metadataURI;
              if (uri) {
                try {
                  const ipfsUrl = resolveIPFS(uri);
                  if (ipfsUrl) {
                    const metaRes = await fetch(ipfsUrl);
                    if (metaRes.ok) {
                      const metaJson = await metaRes.json();
                      metadata = { ...metadata, ...metaJson };
                    }
                  }
                } catch (e) {
                  console.warn(
                    `Failed to resolve IPFS for token ${cred.tokenId}`,
                    e
                  );
                }
              }
              return {
                ...cred,
                metadata: metadata,
                issuer: cred.issuer || cred.metadata?.issuer,
                credentialType:
                  cred.credentialType !== undefined ? cred.credentialType : 0,
                issuedAt: cred.issuedAt || new Date().toISOString(),
              };
            })
          );
          setCredentials(enrichedCredentials);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoadingCredentials(false);
      }
    };
    fetchCredentials();
  }, [user?.walletAddress]);

  // 2. GENERATE CONSTELLATION
  useEffect(() => {
    const initConstellation = async () => {
      if (typeof window === "undefined" || isLoadingCredentials) return;

      const allSkills = credentials.flatMap((c) => c.metadata?.skills || []);
      const uniqueSkills = Array.from(new Set(allSkills)).filter(Boolean);

      if (uniqueSkills.length === 0) {
        setConstellationData([]);
        return;
      }

      const sortedSkillsStr = [...uniqueSkills].sort().join("|");
      const cacheKey = `skill-constellation-v5-${user?.walletAddress}-${btoa(
        sortedSkillsStr
      )}`;
      const cachedData = localStorage.getItem(cacheKey);

      let nodesToSet: ConstellationNode[] = [];

      if (cachedData) {
        try {
          nodesToSet = JSON.parse(cachedData);
        } catch (error) {
          console.warn("Failed to parse cache");
        }
      }

      if (nodesToSet.length === 0) {
        setIsGeneratingConstellation(true);
        try {
          const aiNodes = await generateSkillConstellation(uniqueSkills);
          if (aiNodes && aiNodes.length > 0) {
            nodesToSet = aiNodes;
            localStorage.setItem(cacheKey, JSON.stringify(aiNodes));
          }
        } catch (e) {
          console.error("Generation failed:", e);
        } finally {
          setIsGeneratingConstellation(false);
        }
      }

      if (nodesToSet.length > 0) {
        const hydratedNodes = nodesToSet.map((node) => {
          if (node.status === NodeStatus.GHOST) return node;
          const sourceCred = credentials.find((c) => {
            const skills = c.metadata.skills || [];
            return skills.some((userSkill: string) => {
              const s = userSkill.toLowerCase().trim();
              const n = node.name.toLowerCase().trim();
              return s === n || s.includes(n) || n.includes(s);
            });
          });

          return {
            ...node,
            credentialType: sourceCred
              ? sourceCred.credentialType
              : CredentialType.BADGE,
            sourceCredentialId: sourceCred ? sourceCred.tokenId : undefined,
          };
        });
        setConstellationData(hydratedNodes);
      }
    };

    initConstellation();
  }, [credentials, isLoadingCredentials, user?.walletAddress]);

  // 3. HANDLERS
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const node = constellationData.find((n) => n.id === nodeId);
      if (!node) return;
      if (node.status === NodeStatus.GHOST) {
        setRecommendationPopup({
          name: node.name,
          reason:
            (node as any).reason ||
            `Our AI analysis suggests ${node.name} complements your existing skill set.`,
        });
        return;
      }
      if (node.sourceCredentialId) {
        const specificCred = credentials.find(
          (c) => c.tokenId === node.sourceCredentialId
        );
        if (specificCred) setSelectedCredential(specificCred);
      }
    },
    [constellationData, credentials]
  );

  if (!user?.walletAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
        <p>Please connect your wallet.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight mb-1">
              Student{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Dashboard
              </span>
            </h1>
            <p className="text-zinc-400 text-sm">
              Visualize your knowledge graph.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-white/10">
            <Plus className="w-4 h-4" /> Add Credential
          </button>
        </header>

        {isLoadingCredentials ? (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b]/80 backdrop-blur-md">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-zinc-400">Syncing Blockchain Data...</p>
          </div>
        ) : (
          <>
            {/* Graph Section */}
            <section className="mb-8 relative">
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
                {isGeneratingConstellation && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                    <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
                    <p className="text-cyan-200 font-mono text-sm animate-pulse">
                      Constructing Neural Graph...
                    </p>
                  </div>
                )}

                {!isGeneratingConstellation &&
                  constellationData.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                      <p>
                        No skills found. Add credentials to generate your graph.
                      </p>
                    </div>
                  )}

                <AnimatePresence>
                  {recommendationPopup && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-[#09090b]/90 backdrop-blur-xl border border-purple-500/30 p-4 rounded-2xl shadow-2xl shadow-purple-500/10 flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white text-sm mb-1">
                            AI Recommendation
                          </h4>
                          <button
                            onClick={() => setRecommendationPopup(null)}
                            className="text-zinc-500 hover:text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-purple-200 font-bold text-sm mb-1">
                          {recommendationPopup.name}
                        </p>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          {recommendationPopup.reason}
                        </p>
                        <button className="mt-3 text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-3 py-1.5 rounded-lg transition-colors font-medium border border-purple-500/20">
                          View Learning Path →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <SkillConstellation
                  nodes={constellationData}
                  onNodeClick={handleNodeClick}
                  isGenerating={isGeneratingConstellation}
                />
              </div>
            </section>

            {/* Stats & List Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Analytics & Stats */}
              <div className="space-y-6 flex flex-col">
                {/* Analytics Card */}
                <div className="flex-1 min-h-[280px]">
                  <AnalyticsCard />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
                    <div>
                      <div className="text-zinc-400 text-xs uppercase font-bold mb-1">
                        Degrees
                      </div>
                      <div className="text-2xl font-bold text-pink-400">
                        {
                          credentials.filter(
                            (c) => c.credentialType === CredentialType.DEGREE
                          ).length
                        }
                      </div>
                    </div>
                    <ScrollText className="text-pink-500/20 w-8 h-8" />
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="text-zinc-400 text-xs uppercase font-bold mb-1">
                      Certificates
                    </div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {
                        credentials.filter(
                          (c) => c.credentialType === CredentialType.CERTIFICATE
                        ).length
                      }
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
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

              {/* Right Column: Verification List */}
              {/* Added max-height and overflow to align vertically with left column */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileBadge className="w-5 h-5 text-zinc-400" /> Recent
                    Activity
                  </h2>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    View All <ArrowUpRight size={14} />
                  </button>
                </div>

                {/* Scroll Container for Alignment */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-2 h-[420px] overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    {credentials.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-10">
                        <FileBadge size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">No credentials found</p>
                      </div>
                    )}
                    {credentials.map((cred) => (
                      <button
                        key={cred.tokenId}
                        onClick={() => setSelectedCredential(cred)}
                        className="w-full text-left group p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all flex items-center justify-between"
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
                            <h3 className="font-bold text-sm md:text-base text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                              {cred.metadata.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <span className="max-w-[100px] truncate">
                                {cred.issuer}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(cred.issuedAt).toLocaleDateString(
                                  "en-US"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden md:flex gap-1">
                          {(cred.metadata.skills || [])
                            .slice(0, 3)
                            .map((s, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-zinc-400 border border-white/5 group-hover:border-white/10 transition-colors"
                              >
                                {s}
                              </span>
                            ))}
                          {(cred.metadata.skills?.length || 0) > 3 && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-zinc-500">
                              +{cred.metadata.skills!.length - 3}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <SkillDetailSidebar
        credential={selectedCredential}
        onClose={() => setSelectedCredential(null)}
      />
    </main>
  );
}
