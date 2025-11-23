"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Mail,
  Calendar,
  Wallet,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { enrollmentService } from "@/lib/api";

// Define the shape based on your JSON response
interface StudentDetails {
  _id: string;
  name: string;
  email: string;
  walletAddress: string;
}

interface EnrollmentRecord {
  _id: string;
  studentId: StudentDetails; // This is the nested object
  studentName: string;
  studentWalletAddress: string;
  enrolledAt: string;
  isActive: boolean;
}

export default function AdmissionsPage() {
  // Initialize as empty array to prevent "map of undefined" errors
  const [students, setStudents] = useState<EnrollmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Data
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await enrollmentService.getEnrolledStudents();
        console.log("API Response:", response);

        // Check specifically for the "students" array from your JSON
        if (response.success && Array.isArray((response as any).students)) {
          setStudents((response as any).students);
        } else {
          // Safety fallback: if success is false or students is missing, set empty
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to fetch students", error);
        setStudents([]); // Ensure it's an array even on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // 2. Filter Logic (Updated for nested JSON structure)
  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();

    // Safety checks using optional chaining (?.)
    const nameMatch = s.studentName?.toLowerCase().includes(query) || false;

    // Email is inside the nested 'studentId' object
    const emailMatch =
      s.studentId?.email?.toLowerCase().includes(query) || false;

    return nameMatch || emailMatch;
  });

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            Enrolled Students
          </h1>
          <p className="text-zinc-400">
            View details of all students currently enrolled in your institute.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
          <Users className="w-4 h-4" />
          {/* Safety check for length */}
          <span>{students?.length || 0} Total Students</span>
        </div>
      </header>

      {/* SEARCH BAR */}
      <div className="mb-8 relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-600"
        />
      </div>

      {/* CONTENT AREA */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-zinc-500">Loading student directory...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredStudents.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl text-zinc-500">
                {searchQuery
                  ? "No students found matching your search."
                  : "No students have been enrolled yet."}
              </div>
            ) : (
              filteredStudents.map((student, index) => (
                <motion.div
                  key={student._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#18181b] border border-white/5 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between group hover:border-white/10 transition-all gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar Placeholder */}
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {/* Fallback if name is missing */}
                      {(student.studentName || "U").charAt(0).toUpperCase()}
                    </div>

                    <div className="overflow-hidden">
                      <h3 className="font-bold text-lg text-white mb-1 truncate">
                        {student.studentName || "Unknown Student"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                        <span className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          {/* Access Nested Email Safely */}
                          {student.studentId?.email || "No email provided"}
                        </span>

                        {student.studentWalletAddress && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md font-mono text-xs text-zinc-500">
                            <Wallet className="w-3 h-3 shrink-0" />
                            {student.studentWalletAddress.slice(0, 6)}...
                            {student.studentWalletAddress.slice(-4)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side Info */}
                  <div className="flex items-center justify-between md:justify-end gap-6 text-sm text-zinc-500 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined{" "}
                        {new Date(
                          student.enrolledAt || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                        student.isActive
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
