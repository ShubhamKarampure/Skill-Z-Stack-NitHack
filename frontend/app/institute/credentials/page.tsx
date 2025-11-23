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
  LayoutTemplate,
  Sparkles,
  Loader2,
} from "lucide-react";
import { templateService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Define types locally or import from @/lib/types if available
type CredentialCategory = "Degree" | "Certificate" | "Badge";

interface CredentialTemplate {
  id: string;
  name: string;
  description: string;
  type: CredentialCategory;
  image: string;
  skills: string[];
  holders: number;
  department?: string;
}

const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
  </div>
);

export default function CredentialsLibrary() {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<CredentialTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCred, setSelectedCred] = useState<CredentialTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newCred, setNewCred] = useState<Partial<CredentialTemplate>>({
    name: "",
    description: "",
    type: "Certificate",
    image: "",
    skills: [],
    department: "",
  });
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await templateService.getTemplates();
      if (response.success && response.data) {
        // Map _id to id for frontend consistency
        const mapped = response.data.map((t: any) => ({
          ...t,
          id: t._id,
        }));
        setCredentials(mapped);
      }
    } catch (error) {
      console.error("Failed to load templates", error);
      toast({
        title: "Error",
        description: "Failed to load credential templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: newCred.name,
        description: newCred.description,
        type: newCred.type,
        image: newCred.image,
        skills: skillInput.split(",").map((s) => s.trim()).filter(Boolean),
        department: newCred.department,
      };

      const response = await templateService.createTemplate(payload);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Credential template created successfully",
        });
        await loadTemplates();
        setIsCreateOpen(false);
        setNewCred({ name: "", description: "", type: "Certificate", image: "", department: "" });
        setSkillInput("");
      } else {
        throw new Error(response.message || "Failed to create template");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create template",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen text-white font-sans selection:bg-indigo-500/30">
      <Aurora />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-400">
              Credential Library
            </h1>
            <p className="text-zinc-400 max-w-xl text-lg">
              Design and manage the credentials your institute issues. Create templates for degrees, certificates, and achievement badges.
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 hover:shadow-white/20 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> 
            Create Template
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
        ) : credentials.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <LayoutTemplate className="w-12 h-12 mx-auto text-zinc-500 mb-4" />
            <h3 className="text-xl font-bold text-zinc-300 mb-2">No Templates Found</h3>
            <p className="text-zinc-500 max-w-md mx-auto mb-6">
              You haven't created any credential templates yet. Start by creating your first degree, certificate, or badge template.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors"
            >
              Create First Template
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((cred) => (
              <motion.div
                key={cred.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCred(cred)}
                className="relative overflow-hidden rounded-2xl bg-white/0.02 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group"
              >
                {/* Image Header */}
                <div className="h-32 w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-[#09090b] to-transparent z-10" />
                  {cred.image ? (
                    <img 
                      src={cred.image} 
                      alt={cred.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <Award className="w-10 h-10 text-zinc-700" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <div
                      className={`p-2 rounded-lg backdrop-blur-md border border-white/10 ${
                        cred.type === "Degree"
                          ? "bg-purple-500/20 text-purple-300"
                          : cred.type === "Certificate"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {cred.type === "Degree" ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : cred.type === "Certificate" ? (
                        <FileBadge className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      {cred.department || "General"}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                    {cred.name}
                  </h3>
                  
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                    {cred.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {cred.skills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md bg-white/5 text-xs text-zinc-300 border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                    {cred.skills.length > 3 && (
                      <span className="text-xs text-zinc-500 py-1">
                        +{cred.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                      <LayoutTemplate className="w-3 h-3" /> {cred.holders} Issued
                    </span>
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>


      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {selectedCred && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCred(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#18181b] border border-white/10 w-full max-w-2xl rounded-2xl relative overflow-hidden shadow-2xl shadow-black/50 z-10"
            >
              <div className="h-48 w-full relative">
                <div className="absolute inset-0 bg-linear-to-t from-[#18181b] to-transparent z-10" />
                <img 
                  src={selectedCred.image} 
                  alt={selectedCred.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedCred(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-white hover:text-black transition-colors backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 -mt-12 relative z-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    selectedCred.type === "Degree"
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                      : selectedCred.type === "Certificate"
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}>
                    {selectedCred.type}
                  </span>
                  {selectedCred.department && (
                    <span className="text-zinc-400 text-sm flex items-center gap-1">
                      • {selectedCred.department}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl font-bold mb-4">{selectedCred.name}</h2>
                <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                  {selectedCred.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Skills & Competencies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCred.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm text-zinc-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-500 uppercase mb-2">Stats</h4>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-zinc-400">Total Issued</span>
                        <span className="text-2xl font-bold font-mono">{selectedCred.holders}</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                      Issue This Credential <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#18181b] border border-white/10 w-full max-w-xl p-8 rounded-2xl relative z-10 shadow-2xl"
            >
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Create Credential Template</h2>
                <p className="text-zinc-400 text-sm">Define the structure for a new credential type.</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">
                      Credential Name
                    </label>
                    <input
                      required
                      value={newCred.name}
                      onChange={(e) =>
                        setNewCred({ ...newCred, name: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g. Master of Science in AI"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">
                      Type
                    </label>
                    <div className="relative">
                      <select
                        value={newCred.type}
                        onChange={(e) =>
                          setNewCred({ ...newCred, type: e.target.value as CredentialCategory })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none appearance-none"
                      >
                        <option value="Degree">Degree</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Badge">Badge</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">
                      Department
                    </label>
                    <input
                      value={newCred.department}
                      onChange={(e) =>
                        setNewCred({ ...newCred, department: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={newCred.description}
                    onChange={(e) =>
                      setNewCred({ ...newCred, description: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none h-24 resize-none"
                    placeholder="Describe what this credential represents..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">
                    Cover Image URL
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        value={newCred.image}
                        onChange={(e) =>
                          setNewCred({ ...newCred, image: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 p-3 text-sm focus:border-indigo-500 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">
                    Skills (Comma separated)
                  </label>
                  <input
                    required
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none"
                    placeholder="e.g. React, Leadership, Project Management"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors mt-4 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Create Template
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
