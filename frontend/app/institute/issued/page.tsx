"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ShieldAlert,
  Loader2,
  ExternalLink,
  Calendar,
  User,
  FileBadge,
  GraduationCap,
  Award,
  MoreVertical,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { credentialService } from "@/lib/api";
import { Credential, CredentialType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/store";
import { getPrivateKey } from "@/lib/wallet-constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function IssuedCredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  
  // Revocation State
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [selectedCredId, setSelectedCredId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useAuthStore();
  const { toast } = useToast();

  const fetchIssuedCredentials = async () => {
    setIsLoading(true);
    try {
      const response = await credentialService.getIssuedCredentials();
      if (response.success && response.data) {
        // Enrich with IPFS data
        const enriched = await Promise.all(
          response.data.map(async (cred) => {
            let metadata: any = cred.metadata || {};
            
            // Handle potential double nesting or missing data
            if (metadata.metadata) {
                metadata = { ...metadata, ...metadata.metadata };
            }

            // If name is missing or generic, try to fetch from IPFS
            // Check both top-level (blockchain) and nested metadata (database) for the URI
            const uri = (cred as any).metadataURI || (cred.metadata as any)?.metadataURI;

            if ((!metadata.name || metadata.name === "Unnamed Credential") && uri) {
              try {
                const ipfsUrl = resolveIPFS(uri);
                if (ipfsUrl) {
                  const res = await fetch(ipfsUrl);
                  if (res.ok) {
                    const ipfsData = await res.json();
                    metadata = { ...metadata, ...ipfsData };
                  }
                }
              } catch (e) {
                console.error("Failed to fetch IPFS for", cred.tokenId, e);
              }
            }
            return { ...cred, metadata };
          })
        );
        setCredentials(enriched);
      }
    } catch (error) {
      console.error("Failed to fetch issued credentials:", error);
      toast({
        title: "Error",
        description: "Failed to load issued credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuedCredentials();
  }, []);

  const handleRevoke = async () => {
    if (!selectedCredId || !revokeReason) return;

    setIsRevoking(true);
    try {
      // 1. Get Private Key
      const privateKey = getPrivateKey(user?.walletAddress || "");
      if (!privateKey) {
        throw new Error("Issuer private key not found for this wallet");
      }

      // 2. Call API
      const response = await credentialService.revokeCredential({
        tokenId: selectedCredId,
        issuerPrivateKey: privateKey,
        reason: revokeReason,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Credential revoked successfully",
        });
        setIsDialogOpen(false);
        setRevokeReason("");
        // Refresh list
        fetchIssuedCredentials();
      } else {
        throw new Error(response.message || "Revocation failed");
      }
    } catch (error: any) {
      console.error("Revocation error:", error);
      toast({
        title: "Revocation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const filteredCredentials = credentials.filter((cred) => {
    const matchesSearch =
      cred.metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.holder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.tokenId.includes(searchQuery);

    const matchesType =
      filterType === "All" ||
      (filterType === "Degree" && cred.credentialType === CredentialType.DEGREE) ||
      (filterType === "Certificate" && cred.credentialType === CredentialType.CERTIFICATE) ||
      (filterType === "Badge" && cred.credentialType === CredentialType.BADGE);

    return matchesSearch && matchesType;
  });

  const getIcon = (type: CredentialType) => {
    switch (type) {
      case CredentialType.DEGREE:
        return <GraduationCap className="w-5 h-5 text-pink-400" />;
      case CredentialType.CERTIFICATE:
        return <FileBadge className="w-5 h-5 text-blue-400" />;
      case CredentialType.BADGE:
        return <Award className="w-5 h-5 text-amber-400" />;
      default:
        return <Award className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-500">
              Issued Credentials
            </h1>
            <p className="text-zinc-400 mt-1">
              Manage and monitor credentials issued by your institute
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-zinc-900/50 p-1 rounded-lg border border-white/10">
            {["All", "Degree", "Certificate", "Badge"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterType === type
                    ? "bg-white text-black shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by credential name, holder address, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
            <FileBadge className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-400">No credentials found</h3>
            <p className="text-zinc-600 mt-2">
              {searchQuery ? "Try adjusting your search terms" : "Start issuing credentials to see them here"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCredentials.map((cred) => (
              <motion.div
                key={cred.tokenId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group relative bg-zinc-900/50 border ${
                  cred.isRevoked ? "border-red-500/20 bg-red-500/5" : "border-white/5 hover:border-white/10"
                } rounded-xl p-4 transition-all hover:bg-zinc-900/80`}
              >
                <div className="flex items-center gap-4">
                  {/* Image/Icon */}
                  <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                    {cred.metadata?.image ? (
                      <img
                        src={resolveIPFS(cred.metadata.image) || ""}
                        alt={cred.metadata.name}
                        className={`w-full h-full object-cover ${cred.isRevoked ? "grayscale opacity-50" : ""}`}
                      />
                    ) : (
                      getIcon(cred.credentialType)
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${cred.isRevoked ? "text-zinc-500 line-through" : "text-white"}`}>
                        {cred.metadata?.name || "Unnamed Credential"}
                      </h3>
                      {cred.isRevoked && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20 uppercase tracking-wider">
                          Revoked
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span className="font-mono text-xs truncate max-w-[150px]" title={cred.holder}>
                          {cred.holder}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(cred.issuedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                          ID: {cred.tokenId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${cred.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-blue-400 transition-colors"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {!cred.isRevoked && (
                      <Dialog open={isDialogOpen && selectedCredId === cred.tokenId} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                          setSelectedCredId(null);
                          setRevokeReason("");
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => setSelectedCredId(cred.tokenId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-400">
                              <AlertTriangle className="w-5 h-5" />
                              Revoke Credential
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400">
                              Are you sure you want to revoke this credential? This action cannot be undone and will be recorded on the blockchain.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="reason" className="text-zinc-300">Revocation Reason</Label>
                              <Input
                                id="reason"
                                placeholder="e.g., Academic misconduct, Issued in error..."
                                value={revokeReason}
                                onChange={(e) => setRevokeReason(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 focus:border-red-500/50"
                              />
                            </div>
                            
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-300">
                              Warning: This will permanently invalidate the credential ID #{cred.tokenId}.
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              variant="ghost"
                              onClick={() => setIsDialogOpen(false)}
                              className="hover:bg-zinc-800 text-zinc-400"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleRevoke}
                              disabled={!revokeReason || isRevoking}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {isRevoking ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Revoking...
                                </>
                              ) : (
                                "Confirm Revocation"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
