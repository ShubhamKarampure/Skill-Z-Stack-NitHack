"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Download,
  Share2,
  Search,
  CheckCircle,
  Loader2,
  Hexagon,
  ShieldAlert,
  ExternalLink,
  GraduationCap,
  FileBadge,
  Calendar,
  Hash,
} from "lucide-react";
import { credentialService } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Credential, CredentialType } from "@/lib/types";

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "loading";
}

const resolveIPFS = (url?: string) => {
  if (!url) return null;
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }
  // Handle raw CIDs or other IPFS formats if necessary
  if (!url.startsWith("http") && (url.startsWith("Qm") || url.startsWith("bafy"))) {
    return `https://gateway.pinata.cloud/ipfs/${url}`;
  }
  return url;
};

const CATEGORIES = ["All", "Degree", "Certificate", "Badge", "Revoked"];

const CredentialCard = ({ cred, index }: { cred: Credential; index: number }) => {
  const [imgError, setImgError] = useState(false);
  
  const getCredentialStyles = (type: CredentialType) => {
    switch (type) {
      case CredentialType.DEGREE:
        return {
          icon: GraduationCap,
          color: "text-pink-400",
          bg: "bg-pink-500/10",
          border: "border-pink-500/20",
          label: "Degree",
        };
      case CredentialType.CERTIFICATE:
        return {
          icon: FileBadge,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          label: "Certificate",
        };
      case CredentialType.BADGE:
        return {
          icon: Award,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          label: "Badge",
        };
      default:
        return {
          icon: Award,
          color: "text-zinc-400",
          bg: "bg-zinc-500/10",
          border: "border-zinc-500/20",
          label: "Credential",
        };
    }
  };

  const style = getCredentialStyles(cred.credentialType);
  const Icon = style.icon;
  const imageUrl = resolveIPFS(cred.metadata.image);
  console.log("Credential Image URL:", imageUrl);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrl) return;
    
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cred.metadata.name.replace(/\s+/g, '_')}_credential.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(console.error);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all cursor-pointer ${
        cred.isRevoked ? "opacity-75 grayscale" : ""
      }`}
    >
      {/* Image Header */}
      <div className="h-48 w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent z-10" />
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={cred.metadata.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${style.bg}`}
          >
            <Icon className={`w-16 h-16 ${style.color} opacity-50`} />
          </div>
        )}

        <div
          className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md border ${style.bg} ${style.color} ${style.border}`}
        >
          <Icon className="w-4 h-4" />
          {style.label}
        </div>
      </div>

      <div className="p-6 relative z-20 -mt-12">
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl">
          <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
            {cred.metadata.name}
          </h3>
          <p className="text-zinc-400 text-sm line-clamp-2 mb-4 h-10">
            {cred.metadata.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <div className="w-4 h-4 rounded-full bg-linear-to-tr from-cyan-500 to-blue-500" />
              <span className="truncate max-w-[100px]" title={cred.issuer}>
                {cred.issuer}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {!cred.isRevoked && imageUrl && !imgError && (
                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Download Credential"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              
              {cred.isRevoked ? (
                <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Revoked
                </span>
              ) : (
                <a
                  href={`https://sepolia.etherscan.io/tx/${cred.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded hover:bg-emerald-400/20 transition-colors flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Hash className="w-3 h-3" /> On-Chain
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPONENT ---
export default function InventoryPage() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inventoryData, setInventoryData] = useState<Credential[]>([]);
  const [filteredData, setFilteredData] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthStore();

  // Fetch Credentials from Blockchain/Backend
  useEffect(() => {
    const fetchCredentials = async () => {
      if (!user?.walletAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await credentialService.getCredentialsByAddress(user.walletAddress);
        
        if (response.success && response.data) {
          // Enrich credentials with IPFS data
          const enrichedCredentials = await Promise.all(
            response.data.credentials.map(async (cred: any) => {
              // Start with existing metadata from DB (handling nested structure if present)
              let metadata = {
                name: "Unknown Credential",
                description: "No description available",
                image: "",
                skills: [],
                ...(cred.metadata?.metadata || cred.metadata || {})
              };

              // If metadataURI exists, fetch it to get the full metadata (image, name, etc.)
              if (cred.metadataURI) {
                try {
                   const ipfsUrl = resolveIPFS(cred.metadataURI);
                   if (ipfsUrl) {
                     const metaRes = await fetch(ipfsUrl);
                     if (metaRes.ok) {
                       const metaJson = await metaRes.json();
                       // Merge IPFS data over DB data
                       metadata = { ...metadata, ...metaJson };
                     }
                   }
                } catch (e) {
                  console.error("Failed to fetch IPFS metadata for", cred.tokenId, e);
                }
              }
              
              // Ensure we have the top-level fields expected by UI
              return {
                ...cred,
                metadata: metadata,
                // Map other fields if necessary (e.g. issuer is in cred.issuer)
                issuer: cred.issuer || cred.metadata?.issuer,
                transactionHash: cred.transactionHash || cred.metadata?.transactionHash,
                isRevoked: cred.isRevoked || cred.metadata?.isRevoked,
              };
            })
          );
          
          setInventoryData(enrichedCredentials);
        } else {
          console.error("Failed to fetch credentials:", response.message);
          // Fallback to empty or show error
        }
      } catch (error) {
        console.error("Error fetching credentials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [user?.walletAddress]);


  // Filter Logic
  useEffect(() => {
    const filtered = inventoryData.filter((item) => {
      const matchesSearch =
        (item.metadata?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.issuer?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.tokenId?.includes(searchTerm) || false);

      let matchesCategory = true;
      if (selectedCategory === "Degree")
        matchesCategory = item.credentialType === CredentialType.DEGREE;
      if (selectedCategory === "Certificate")
        matchesCategory = item.credentialType === CredentialType.CERTIFICATE;
      if (selectedCategory === "Badge")
        matchesCategory = item.credentialType === CredentialType.BADGE;
      if (selectedCategory === "Revoked") matchesCategory = item.isRevoked;

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

  // --- Styles Helper ---
  const getCredentialStyles = (type: CredentialType) => {
    switch (type) {
      case CredentialType.DEGREE:
        return {
          icon: GraduationCap,
          color: "text-pink-400",
          bg: "bg-pink-500/10",
          border: "border-pink-500/20",
          label: "Degree",
        };
      case CredentialType.CERTIFICATE:
        return {
          icon: FileBadge,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          label: "Certificate",
        };
      case CredentialType.BADGE:
        return {
          icon: Award,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          label: "Badge",
        };
      default:
        return {
          icon: Award,
          color: "text-zinc-400",
          bg: "bg-zinc-500/10",
          border: "border-zinc-500/20",
          label: "Unknown",
        };
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-[#09090b] border border-white/10 shadow-2xl text-sm font-medium"
            >
              {toast.type === "loading" && (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              )}
              {toast.type === "success" && (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-white">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                My{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
                  Inventory
                </span>
              </h1>
              <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Hexagon className="w-4 h-4 text-cyan-400" />{" "}
                  {inventoryData.length} Total Assets
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />{" "}
                  {inventoryData.filter((c) => !c.isRevoked).length} Active
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search name, issuer, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-white/0.03 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/0.05 transition-all"
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
                        : "bg-white/0.03 border-white/10 text-zinc-400 hover:text-white hover:bg-white/0.05"
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredData.map((cred, idx) => (
                <CredentialCard key={cred.tokenId} cred={cred} index={idx} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
