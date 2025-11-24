"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Award,
  FileBadge,
  GraduationCap,
  X,
  ChevronRight,
  Image as ImageIcon,
  AlignLeft,
  Type,
  List,
  Key,
  Loader2,
} from "lucide-react";
import { CredentialType } from "@/lib/types";
import { templateService, metadataService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/store";

interface CredentialTemplate {
  id: string;
  name: string;
  description: string;
  type: CredentialType;
  image: string;
  skills: string[];
  holders: number;
}

export default function CredentialsLibrary() {
  const [credentials, setCredentials] = useState<CredentialTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCred, setSelectedCred] = useState<CredentialTemplate | null>(null);
  const { toast } = useToast();

  // Form State for creation
  const [newCred, setNewCred] = useState<{
    name: string;
    description: string;
    type: CredentialType;
    image: string;
    skills: string;
    file: File | null;
  }>({
    name: "",
    description: "",
    type: CredentialType.DEGREE,
    image: "",
    skills: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const res = await templateService.getTemplates();
    console.log(res)
    if (res.success && res.data) {
      // Map backend data to frontend model
      const mapped: CredentialTemplate[] = res.data.map((item: any) => ({
        id: item.tokenId,
        name: item.metadata?.name || "Unnamed Credential",
        description: item.metadata?.description || "No description",
        type: item.credentialType,
        image: item.metadata?.image || "https://via.placeholder.com/400",
        skills: item.metadata?.skills || [],
        holders: 0, 
      }));
      setCredentials(mapped);
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch credential templates",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = useAuthStore.getState().user;
    
    if (!newCred.file) {
      toast({
        title: "Missing File",
        description: "Please upload an image for the credential.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Metadata
      const formData = new FormData();
      formData.append("name", newCred.name);
      formData.append("description", newCred.description);
      formData.append("credentialType", newCred.type.toString());
      formData.append("file", newCred.file);
      
      const additionalData = {
        skills: newCred.skills.split(",").map((s) => s.trim()),
      };
      formData.append("additionalData", JSON.stringify(additionalData));

      const uploadRes = await metadataService.uploadMetadata(formData);

      if (!uploadRes.success || !uploadRes.data) {
        throw new Error(uploadRes.message || "Failed to upload metadata");
      }

      const { metadataURI, imageURL } = uploadRes.data;

      // 2. Create Template (Issue Credential)
      const res = await templateService.createTemplate({
        name: newCred.name,
        description: newCred.description,
        type: newCred.type,
        image: imageURL,
        skills: newCred.skills.split(",").map((s) => s.trim()),
        metadataURI: metadataURI,
      });

      if (res.success) {
        toast({
          title: "Success",
          description: "Credential template created successfully",
        });
        setIsCreateOpen(false);
        setNewCred({
          name: "",
          description: "",
          type: CredentialType.DEGREE,
          image: "",
          skills: "",
          file: null,
        });
        fetchTemplates(); // Refresh list
      } else {
        throw new Error(res.message || "Failed to create template");
      }
    } catch (error: any) {
      console.error("Creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create template",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type: CredentialType) => {
    switch (type) {
      case CredentialType.DEGREE:
        return "bg-purple-500/20 text-purple-400 border-purple-500/20";
      case CredentialType.CERTIFICATE:
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      case CredentialType.BADGE:
        return "bg-amber-500/20 text-amber-400 border-amber-500/20";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/20";
    }
  };

  const getTypeIcon = (type: CredentialType) => {
    switch (type) {
      case CredentialType.DEGREE:
        return <GraduationCap className="w-5 h-5" />;
      case CredentialType.CERTIFICATE:
        return <FileBadge className="w-5 h-5" />;
      case CredentialType.BADGE:
        return <Award className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getTypeName = (type: CredentialType) => {
    switch (type) {
      case CredentialType.DEGREE:
        return "Degree";
      case CredentialType.CERTIFICATE:
        return "Certificate";
      case CredentialType.BADGE:
        return "Badge";
      default:
        return "Unknown";
    }
  };

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Credential Library</h1>
          <p className="text-zinc-400">
            Define the degrees, certificates, and badges your institute offers.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
        >
          <Plus className="w-4 h-4" /> Create New
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          </div>
        ) : credentials.length === 0 ? (
          <div className="col-span-full text-center py-20 text-zinc-500">
            No credential templates found. Create one to get started.
          </div>
        ) : (
          credentials.map((cred) => (
            <motion.div
              key={cred.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedCred(cred)}
              className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
            >
              {/* Image Header */}
              <div className="h-48 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent z-10" />
                <img
                  src={cred.image}
                  alt={cred.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md border ${getTypeColor(cred.type)}`}>
                  {getTypeIcon(cred.type)}
                  {getTypeName(cred.type)}
                </div>
              </div>

              <div className="p-6 relative z-20 -mt-12">
                <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                    {cred.name}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4 h-10">
                    {cred.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <List className="w-3 h-3" />
                      {cred.skills.length} Skills
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                      {cred.holders} Issued
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {selectedCred && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-white/10 w-full max-w-2xl rounded-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="h-48 w-full relative shrink-0">
                <img
                  src={selectedCred.image}
                  alt={selectedCred.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#18181b] to-transparent" />
                <button
                  onClick={() => setSelectedCred(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 border ${getTypeColor(selectedCred.type)}`}>
                      {getTypeIcon(selectedCred.type)}
                      {getTypeName(selectedCred.type)}
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{selectedCred.name}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-500 mb-1">Total Issued</div>
                    <div className="text-2xl font-mono font-bold text-white">{selectedCred.holders}</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlignLeft className="w-4 h-4" /> Description
                    </h4>
                    <p className="text-zinc-300 leading-relaxed">
                      {selectedCred.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <List className="w-4 h-4" /> Skills & Competencies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCred.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm text-zinc-300 hover:bg-white/10 transition-colors"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                    View Holders List <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-white/10 w-full max-w-xl p-8 rounded-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X />
              </button>
              <h2 className="text-2xl font-bold mb-1">Create New Credential</h2>
              <p className="text-zinc-400 text-sm mb-6">Add a new credential template to your library.</p>
              
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase flex mb-2 items-center gap-2">
                      <Type className="w-3 h-3" /> Credential Name
                    </label>
                    <input
                      required
                      value={newCred.name}
                      onChange={(e) =>
                        setNewCred({ ...newCred, name: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors"
                      placeholder="e.g. Master in Economics"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase block mb-2">
                      Type
                    </label>
                    <select
                      value={newCred.type}
                      onChange={(e) =>
                        setNewCred({ ...newCred, type: Number(e.target.value) })
                      }
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value={CredentialType.DEGREE}>Degree</option>
                      <option value={CredentialType.CERTIFICATE}>Certificate</option>
                      <option value={CredentialType.BADGE}>Badge</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase flex mb-2 items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Credential Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewCred({ ...newCred, file });
                      }}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase flex mb-2 items-center gap-2">
                    <AlignLeft className="w-3 h-3" /> Description
                  </label>
                  <textarea
                    required
                    value={newCred.description}
                    onChange={(e) =>
                      setNewCred({ ...newCred, description: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none h-24 resize-none transition-colors"
                    placeholder="Describe the credential..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase flex mb-2 items-center gap-2">
                    <List className="w-3 h-3" /> Skills (Comma separated)
                  </label>
                  <textarea
                    required
                    value={newCred.skills}
                    onChange={(e) =>
                      setNewCred({ ...newCred, skills: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none h-24 resize-none transition-colors"
                    placeholder="e.g. Economics, Finance, Mathematics"
                  />
                </div>

                {/* Private Key Input - REMOVED (Auto-handled) */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase flex mb-1 items-center gap-2">
                    <Key className="w-3 h-3" /> Issuer Wallet
                  </label>
                  <p className="text-xs text-zinc-500">
                    Transaction will be signed automatically using your connected wallet's key.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 mt-4 transition-colors shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Credential Template"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
