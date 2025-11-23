"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Award,
  FileBadge,
  GraduationCap,
  X,
  ChevronRight,
} from "lucide-react";

interface CredentialType {
  id: string;
  name: string;
  type: "Degree" | "Certificate" | "Badge";
  skills: string[];
  holders: number;
}

const INITIAL_DATA: CredentialType[] = [
  {
    id: "1",
    name: "Bachelor of Computer Science",
    type: "Degree",
    skills: ["Algorithms", "Data Structures", "System Design"],
    holders: 120,
  },
  {
    id: "2",
    name: "Full Stack Developer",
    type: "Certificate",
    skills: ["React", "Node.js", "PostgreSQL"],
    holders: 45,
  },
];

export default function CredentialsLibrary() {
  const [credentials, setCredentials] = useState(INITIAL_DATA);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCred, setSelectedCred] = useState<CredentialType | null>(null);

  // Simple Form State for creation
  const [newCred, setNewCred] = useState({
    name: "",
    type: "Certificate",
    skills: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: CredentialType = {
      id: Math.random().toString(),
      name: newCred.name,
      type: newCred.type as any,
      skills: newCred.skills.split(",").map((s) => s.trim()),
      holders: 0,
    };
    setCredentials([...credentials, newEntry]);
    setIsCreateOpen(false);
    setNewCred({ name: "", type: "Certificate", skills: "" });
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
        {credentials.map((cred) => (
          <motion.div
            key={cred.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedCred(cred)}
            className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${
                  cred.type === "Degree"
                    ? "bg-purple-500/20 text-purple-400"
                    : cred.type === "Certificate"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {cred.type === "Degree" ? (
                  <GraduationCap />
                ) : cred.type === "Certificate" ? (
                  <FileBadge />
                ) : (
                  <Award />
                )}
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                {cred.holders} Issued
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {cred.name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-4">
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
          </motion.div>
        ))}
      </div>

      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {selectedCred && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-white/10 w-full max-w-lg p-8 rounded-2xl relative"
            >
              <button
                onClick={() => setSelectedCred(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X />
              </button>
              <h2 className="text-2xl font-bold mb-1">{selectedCred.name}</h2>
              <span className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-6 block">
                {selectedCred.type}
              </span>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-zinc-400 mb-2">
                    Skills Awarded
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCred.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-zinc-500 text-sm">
                    Total Issued: {selectedCred.holders}
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-1">
                    View Holders <ChevronRight className="w-4 h-4" />
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
              className="bg-[#18181b] border border-white/10 w-full max-w-md p-8 rounded-2xl relative"
            >
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X />
              </button>
              <h2 className="text-xl font-bold mb-6">Create New Credential</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase block mb-2">
                    Credential Name
                  </label>
                  <input
                    required
                    value={newCred.name}
                    onChange={(e) =>
                      setNewCred({ ...newCred, name: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
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
                      setNewCred({ ...newCred, type: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                  >
                    <option>Degree</option>
                    <option>Certificate</option>
                    <option>Badge</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase block mb-2">
                    Skills (Comma separated)
                  </label>
                  <textarea
                    required
                    value={newCred.skills}
                    onChange={(e) =>
                      setNewCred({ ...newCred, skills: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none h-24"
                    placeholder="e.g. Economics, Finance, Mathematics"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 mt-2"
                >
                  Create Credential
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
