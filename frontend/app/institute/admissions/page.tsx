"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, UserPlus, Clock, Mail } from "lucide-react";

// Mock Pending Requests
const PENDING_REQUESTS = [
  {
    id: "req1",
    name: "John Doe",
    email: "john.doe@university.edu",
    tokenUsed: "TOKEN-8821",
    date: "2 mins ago",
  },
  {
    id: "req2",
    name: "Alice Wang",
    email: "alice.w@university.edu",
    tokenUsed: "TOKEN-9912",
    date: "1 hour ago",
  },
];

export default function AdmissionsPage() {
  const [requests, setRequests] = useState(PENDING_REQUESTS);

  const handleApprove = (id: string) => {
    // Logic to move student to 'Registered' table
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Admissions</h1>
          <p className="text-zinc-400">
            Review students who have submitted their verification token.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>{requests.length} Pending Actions</span>
        </div>
      </header>

      <div className="space-y-4">
        <AnimatePresence>
          {requests.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl text-zinc-500">
              All caught up! No pending admission requests.
            </div>
          ) : (
            requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/5 p-6 rounded-xl flex items-center justify-between group hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{req.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {req.email}
                      </span>
                      <span className="px-2 py-0.5 bg-white/5 rounded text-xs font-mono border border-white/5">
                        Token: {req.tokenUsed}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReject(req.id)}
                    className="p-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-transparent hover:border-red-500/30"
                    title="Reject"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-900/20"
                  >
                    <Check className="w-5 h-5" /> Approve Admission
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
