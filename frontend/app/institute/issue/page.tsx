"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Filter,
} from "lucide-react";

// Mock Data
const PRESETS = [
  { id: "c1", title: "Bachelor of Computer Science", type: "Degree" },
  { id: "c2", title: "Advanced React Certification", type: "Certificate" },
  { id: "c3", title: "Top Performer 2024", type: "Badge" },
];

const STUDENTS = [
  { id: "s1", name: "Alex Chen", email: "alex@edu.com", wallet: "0x12...34" },
  {
    id: "s2",
    name: "Sarah Jones",
    email: "sarah@edu.com",
    wallet: "0x56...78",
  },
  { id: "s3", name: "Mike Ross", email: "mike@edu.com", wallet: "0x99...88" },
  { id: "s4", name: "Jessica P", email: "jess@edu.com", wallet: "0xAA...BB" },
  { id: "s5", name: "Tom Holland", email: "tom@edu.com", wallet: "0xCC...DD" },
];

export default function IssuePage() {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedStudents.length === STUDENTS.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(STUDENTS.map((s) => s.id));
    }
  };

  const handleMint = () => {
    setIsMinting(true);
    // Simulate API/Blockchain call
    setTimeout(() => {
      setIsMinting(false);
      setSelectedStudents([]);
      alert("Minting Sequence Initiated: 0.0034 MATIC Consumed");
    }, 2500);
  };

  const filteredStudents = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Issue Credentials</h1>
          <p className="text-zinc-400">
            Mint SBTs (Soulbound Tokens) to registered student wallets.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-400 mb-1">Wallet Balance</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            142.05 MATIC
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-250px)] min-h-[600px]">
        {/* LEFT COL: SELECT CREDENTIAL (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <div className="flex-1 bg-white/0.02 border border-white/10 rounded-2xl p-6 overflow-y-auto">
            <h3 className="text-sm font-bold uppercase text-zinc-500 mb-4 tracking-wider">
              1. Select Template
            </h3>
            <div className="space-y-3">
              {PRESETS.map((cred) => (
                <button
                  key={cred.id}
                  onClick={() => setSelectedPreset(cred.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                    selectedPreset === cred.id
                      ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/40"
                      : "bg-black/20 border-white/5 hover:bg-white/5"
                  }`}
                >
                  <div className="relative z-10">
                    <div
                      className={`font-bold text-sm ${
                        selectedPreset === cred.id
                          ? "text-white"
                          : "text-zinc-300"
                      }`}
                    >
                      {cred.title}
                    </div>
                    <div
                      className={`text-xs mt-1 uppercase tracking-wider ${
                        selectedPreset === cred.id
                          ? "text-blue-200"
                          : "text-zinc-500"
                      }`}
                    >
                      {cred.type}
                    </div>
                  </div>
                  {selectedPreset === cred.id && (
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white/10 to-transparent" />
                  )}
                </button>
              ))}
            </div>
            <button className="w-full mt-4 py-3 border border-dashed border-white/20 rounded-xl text-sm text-zinc-400 hover:text-white hover:border-white/40 transition-colors">
              + Create New Template
            </button>
          </div>
        </div>

        {/* RIGHT COL: SELECT STUDENTS (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white/0.02 border border-white/5 rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/0.02">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-wider">
                2. Select Recipients
              </h3>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-zinc-300">
                {selectedStudents.length} Selected
              </span>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-zinc-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
                />
              </div>
              <button
                onClick={selectAll}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-zinc-300 transition-colors"
              >
                {selectedStudents.length === STUDENTS.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          </div>

          {/* List */}
          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {filteredStudents.map((student) => {
              const isSelected = selectedStudents.includes(student.id);
              return (
                <div
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-transparent border-transparent hover:bg-white/0.02"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "bg-blue-500 border-blue-500"
                          : "border-zinc-700 bg-zinc-900"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 size={14} className="text-white" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={`font-bold text-sm ${
                          isSelected ? "text-blue-100" : "text-zinc-300"
                        }`}
                      >
                        {student.name}
                      </h4>
                      <p className="text-xs text-zinc-600">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors">
                      {student.wallet}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? "bg-blue-500" : "bg-zinc-800"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Bar */}
          <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center">
            <div>
              <div className="text-xs text-zinc-400">Total Gas Estimate</div>
              <div className="text-sm font-mono text-white">
                ~ {(selectedStudents.length * 0.001).toFixed(4)} MATIC
              </div>
            </div>
            <button
              disabled={
                !selectedPreset || selectedStudents.length === 0 || isMinting
              }
              onClick={handleMint}
              className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2 transition-all transform active:scale-95"
            >
              {isMinting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Processing
                  Chain...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" /> Mint{" "}
                  {selectedStudents.length} Credentials
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
