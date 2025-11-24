"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  CheckCircle2,
  Building2,
  Loader2,
  RefreshCcw,
  Link as LinkIcon,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { adminService, Institute } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// --- COMPONENTS ---
const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute top-[-20%] right-[20%] w-[60%] h-[60%] rounded-full bg-emerald-900/20 blur-[120px]" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px]" />
  </div>
);

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. CHANGE: State now holds an object with ID and TYPE, or null
  const [processingState, setProcessingState] = useState<{
    id: string;
    type: "register" | "accredit";
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();

  // --- API FETCHING ---
  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getInstitutes();
      if (response.success) {
        const sortedData = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setMembers(sortedData);
      } else {
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: response.message || "Failed to load institutes.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // --- ACTIONS ---

  const handleRegister = async (member: Institute) => {
    // 2. CHANGE: Set specific action type
    setProcessingState({ id: member.id, type: "register" });

    try {
      const res = await adminService.registerIssuer(member.walletAddress);
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === member.id ? { ...m, isRegistered: true } : m
          )
        );
        toast({
          title: "Registration Successful",
          description: `${member.name} is now registered on-chain.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: res.message,
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Could not reach the server.",
      });
    } finally {
      setProcessingState(null);
    }
  };

  const handleAccredit = async (member: Institute) => {
    // 2. CHANGE: Set specific action type
    setProcessingState({ id: member.id, type: "accredit" });

    try {
      const res = await adminService.accreditIssuer(member.walletAddress);
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === member.id ? { ...m, isAccredited: true } : m
          )
        );
        toast({
          title: "Accreditation Successful",
          description: `${member.name} has been granted issuer rights.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Accreditation Failed",
          description: res.message,
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Could not reach the server.",
      });
    } finally {
      setProcessingState(null);
    }
  };

  // --- DERIVED STATE & HELPERS ---

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusInfo = (m: Institute) => {
    if (m.isRegistered && m.isAccredited) {
      return {
        label: "Operational",
        colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        icon: <CheckCircle2 className="w-3 h-3" />,
      };
    }
    if (m.isRegistered && !m.isAccredited) {
      return {
        label: "Registered Only",
        colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        icon: <LinkIcon className="w-3 h-3" />,
      };
    }
    return {
      label: "Action Required",
      colorClass: "bg-red-500/10 text-red-400 border-red-500/20",
      icon: <AlertCircle className="w-3 h-3" />,
    };
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      <Aurora />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Manage{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-600">
                Issuers
              </span>
            </h1>
            <p className="text-zinc-400">
              Process registrations and accreditations.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={fetchMembers}
              disabled={isLoading}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <RefreshCcw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search institutes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-white/0.05 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* MAIN TABLE */}
        <div className="bg-white/0.02 border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-xs uppercase text-zinc-400 border-b border-white/5">
                <tr>
                  <th className="p-6 font-bold tracking-wider">
                    Institute Details
                  </th>
                  <th className="p-6 font-bold tracking-wider">
                    Current Status
                  </th>
                  <th className="p-6 font-bold tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading && members.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
                      <p className="text-zinc-500">Loading issuers...</p>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-zinc-500">
                      No institutes found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const status = getStatusInfo(member);

                    // 3. CHANGE: Check if this specific row is processing
                    const isProcessingThis = processingState?.id === member.id;
                    const isRegistering =
                      isProcessingThis && processingState?.type === "register";
                    const isAccrediting =
                      isProcessingThis && processingState?.type === "accredit";
                    const isGlobalProcessing = !!processingState; // Any action on any row

                    return (
                      <tr
                        key={member.id}
                        className="group hover:bg-white/0.01 transition-colors"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-900/20 to-teal-900/20 border border-white/10 flex items-center justify-center text-emerald-400">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-lg text-white">
                                {member.name}
                              </div>
                              <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                                {member.walletAddress}
                                <span className="bg-white/5 px-1.5 rounded text-[10px] text-zinc-400">
                                  {new Date(
                                    member.requestedAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-6">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${status.colorClass}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </td>

                        <td className="p-6">
                          <div className="flex items-center justify-end gap-3">
                            {/* BUTTON 1: REGISTER */}
                            <button
                              onClick={() => handleRegister(member)}
                              // Disable if already registered OR if any action is currently running globally
                              disabled={
                                member.isRegistered || isGlobalProcessing
                              }
                              className={`relative px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                member.isRegistered
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default opacity-60"
                                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {member.isRegistered ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />{" "}
                                  Registered
                                </>
                              ) : isRegistering ? (
                                // 4. CHANGE: Only show loader if specifically registering
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <LinkIcon className="w-3 h-3" /> Register
                                </>
                              )}
                            </button>

                            {/* BUTTON 2: ACCREDIT */}
                            <button
                              onClick={() => handleAccredit(member)}
                              // Disable if already accredited OR if any action is currently running globally
                              disabled={
                                member.isAccredited || isGlobalProcessing
                              }
                              className={`relative px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                member.isAccredited
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default opacity-60"
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {member.isAccredited ? (
                                <>
                                  <ShieldCheck className="w-3 h-3" /> Accredited
                                </>
                              ) : isAccrediting ? (
                                // 4. CHANGE: Only show loader if specifically accrediting
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <ShieldCheck className="w-3 h-3" /> Accredit
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
