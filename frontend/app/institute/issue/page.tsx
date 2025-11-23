"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Filter,
  AlertCircle,
} from "lucide-react";
// Ensure this import matches your actual file structure
import { enrollmentService } from "@/lib/api";

// Mock Data for Templates (Kept static as requested)
const PRESETS = [
  { id: "c1", title: "Bachelor of Computer Science", type: "Degree" },
  { id: "c2", title: "Advanced React Certification", type: "Certificate" },
  { id: "c3", title: "Top Performer 2024", type: "Badge" },
];

// Define interface matching your Backend Response
interface StudentData {
  _id: string; // Enrollment ID
  studentName: string;
  studentWalletAddress: string;
  isActive: boolean;
  studentId: {
    email: string;
    _id: string;
  };
}

export default function IssuePage() {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // New State for API Data
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Students on Mount
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await enrollmentService.getEnrolledStudents();
        // Check specifically for the "students" array based on your backend structure
        if (response.success && Array.isArray((response as any).students)) {
          setStudents((response as any).students);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to fetch students for issuing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // 2. Updated Toggle Logic using database _id
  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // 3. Updated Select All Logic
  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s._id));
    }
  };

  const handleMint = () => {
    setIsMinting(true);
    // Simulate API/Blockchain call
    setTimeout(() => {
      setIsMinting(false);
      setSelectedStudents([]);
      alert(
        `Minting Sequence Initiated for ${selectedStudents.length} students.`
      );
    }, 2500);
  };

  // 4. Updated Filter Logic for Nested Objects
  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = s.studentName?.toLowerCase().includes(query) || false;
    const emailMatch =
      s.studentId?.email?.toLowerCase().includes(query) || false;
    return nameMatch || emailMatch;
  });

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Issue Credentials</h1>
          <p className="text-zinc-400">
            Mint SBTs (Soulbound Tokens) to registered student wallets.
          </p>
        </div>
        <div className="text-right bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/20">
          <div className="text-sm text-zinc-400 mb-1">Wallet Balance</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            142.05 MATIC
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-250px)] min-h-[600px]">
        {/* LEFT COL: SELECT CREDENTIAL (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-6 overflow-y-auto">
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
                </button>
              ))}
            </div>
            <button className="w-full mt-4 py-3 border border-dashed border-white/20 rounded-xl text-sm text-zinc-400 hover:text-white hover:border-white/40 transition-colors">
              + Create New Template
            </button>
          </div>
        </div>

        {/* RIGHT COL: SELECT STUDENTS (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center bg-white/[0.02] gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-wider">
                2. Select Recipients
              </h3>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-zinc-300">
                {selectedStudents.length} Selected
              </span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-2.5 text-zinc-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={selectAll}
                disabled={students.length === 0}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-zinc-300 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {selectedStudents.length === students.length &&
                students.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="p-2 space-y-1 overflow-y-auto flex-1 relative">
            {isLoading ? (
              // Loading State
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                <p>Fetching enrolled students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              // Empty State
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                <p>
                  {searchQuery
                    ? "No students match your search"
                    : "No students enrolled yet"}
                </p>
              </div>
            ) : (
              // Student List
              filteredStudents.map((student) => {
                const isSelected = selectedStudents.includes(student._id);
                const walletDisplay = student.studentWalletAddress
                  ? `${student.studentWalletAddress.slice(
                      0,
                      6
                    )}...${student.studentWalletAddress.slice(-4)}`
                  : "No Wallet";

                return (
                  <div
                    key={student._id}
                    onClick={() => toggleStudent(student._id)}
                    className={`group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-500/10 border-blue-500/30"
                        : "bg-transparent border-transparent hover:bg-white/[0.02]"
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
                      <div className="overflow-hidden">
                        <h4
                          className={`font-bold text-sm truncate ${
                            isSelected ? "text-blue-100" : "text-zinc-300"
                          }`}
                        >
                          {student.studentName}
                        </h4>
                        <p className="text-xs text-zinc-600 truncate">
                          {student.studentId?.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors hidden sm:block">
                        {walletDisplay}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? "bg-blue-500" : "bg-zinc-800"
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
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
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2 transition-all transform active:scale-95"
            >
              {isMinting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Processing...
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
