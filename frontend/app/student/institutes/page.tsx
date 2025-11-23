"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Key,
  Mail,
  CheckCircle,
  Loader2,
  Search,
} from "lucide-react";

interface Institute {
  id: string;
  name: string;
  status: "active" | "pending";
  joinedAt?: string;
}

export default function StudentInstitutes() {
  const [institutes, setInstitutes] = useState<Institute[]>([
    {
      id: "1",
      name: "TechCertified Academy",
      status: "active",
      joinedAt: "2023-09-01",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ email: "", token: "" });

  const handleJoinRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // SIMULATE API CALL
    setTimeout(() => {
      const newInst: Institute = {
        id: Math.random().toString(),
        name: "Requested Institute (Pending)", // In real app, fetch name via token
        status: "pending",
      };
      setInstitutes([...institutes, newInst]);
      setIsLoading(false);
      setIsModalOpen(false);
      setFormData({ email: "", token: "" });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Institutes</h1>
            <p className="text-zinc-400 text-sm">
              Manage your academic affiliations and permissions.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-sm shadow-lg shadow-blue-900/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Join New Institute
          </button>
        </div>

        {/* List */}
        <div className="grid gap-4">
          {institutes.map((inst) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    inst.status === "active"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{inst.name}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-full border ${
                        inst.status === "active"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {inst.status === "active"
                        ? "Registered"
                        : "Awaiting Approval"}
                    </span>
                    {inst.joinedAt && (
                      <span className="text-zinc-500">
                        Since {inst.joinedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {inst.status === "active" && (
                <div className="text-right text-xs text-zinc-500">
                  <p>Credentials Auto-Syncing</p>
                  <p className="text-emerald-500 flex items-center justify-end gap-1 mt-1">
                    <CheckCircle className="w-3 h-3" /> Active
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* JOIN MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>

              <h2 className="text-xl font-bold mb-1">Join Institute</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Enter the unique token provided by your institute administrator.
              </p>

              <form onSubmit={handleJoinRequest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase">
                    Institute Email ID
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="admin@university.edu"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase">
                    Invitation Token
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="sk-8921..."
                      value={formData.token}
                      onChange={(e) =>
                        setFormData({ ...formData, token: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      "Send Request"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
