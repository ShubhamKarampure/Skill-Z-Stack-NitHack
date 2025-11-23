"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Filter,
  AlertCircle,
  Key,
  GraduationCap,
  FileBadge,
  Award,
} from "lucide-react";
import { enrollmentService, templateService, credentialService } from "@/lib/api";
import { CredentialType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/store";
import { getPrivateKey } from "@/lib/wallet-constants";

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

interface CredentialTemplate {
  id: string;
  name: string;
  description: string;
  type: CredentialType;
  image: string;
  skills: string[];
  metadataURI: string;
}

export default function IssuePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<CredentialTemplate | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [issuerPrivateKey, setIssuerPrivateKey] = useState(""); // Removed in favor of auto-lookup

  // API Data
  const [students, setStudents] = useState<StudentData[]>([]);
  const [templates, setTemplates] = useState<CredentialTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Students
        const enrollRes = await enrollmentService.getEnrolledStudents();
        console.log("enrolled :",enrollRes)
        if (enrollRes.success && Array.isArray((enrollRes as any).students)) {
          setStudents((enrollRes as any).students);
        }

        // Fetch Templates
        const tempRes = await templateService.getTemplates();
        console.log("templates : ",tempRes)
        if (tempRes.success && tempRes.data) {
          const mapped: CredentialTemplate[] = tempRes.data.map((item: any) => ({
            id: item.tokenId,
            name: item.metadata?.name || "Unnamed Credential",
            description: item.metadata?.description || "No description",
            type: item.credentialType,
            image: item.metadata?.image || "",
            skills: item.metadata?.skills || [],
            metadataURI: item.metadataURI || "",
          }));
          setTemplates(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s._id));
    }
  };

  const handleMint = async () => {
    const user = useAuthStore.getState().user;
    const privateKey = user?.walletAddress ? getPrivateKey(user.walletAddress) : null;

    if (!selectedTemplate || selectedStudents.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a template and at least one student.",
        variant: "destructive",
      });
      return;
    }

    if (!privateKey) {
      toast({
        title: "Wallet Error",
        description: "Could not find a private key for your connected wallet. Please check your configuration.",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);

    try {
      // Process each selected student
      for (const enrollmentId of selectedStudents) {
        const student = students.find((s) => s._id === enrollmentId);
        if (!student) continue;

        // Construct payload based on user request
        const payload = {
          issuerPrivateKey: privateKey,
          holderAddress: student.studentWalletAddress,
          credentialType: selectedTemplate.type,
          metadataURI: selectedTemplate.metadataURI,
          expirationDate: 0,
          revocable: true,
          credentialData: {
            name: selectedTemplate.name,
            major: "Computer Science",
            graduationYear: 2024,
            gpa: 3.8,
          },
        };

        const res = await credentialService.issueCredential(payload);
        
        if (!res.success) {
          throw new Error(res.message || `Failed to issue to ${student.studentName}`);
        }
      }

      toast({
        title: "Success",
        description: `Successfully issued credentials to ${selectedStudents.length} students.`,
      });
      
      // Reset selection
      setSelectedStudents([]);
      // setIssuerPrivateKey(""); // No longer needed
      
    } catch (error: any) {
      console.error("Minting error:", error);
      toast({
        title: "Minting Failed",
        description: error.message || "An error occurred during issuance",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = s.studentName?.toLowerCase().includes(query) || false;
    const emailMatch =
      s.studentId?.email?.toLowerCase().includes(query) || false;
    return nameMatch || emailMatch;
  });

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
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-sm">
                No templates found. Create one in the Library.
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((cred) => (
                  <button
                    key={cred.id}
                    onClick={() => setSelectedTemplate(cred)}
                    className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                      selectedTemplate?.id === cred.id
                        ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md ${
                          selectedTemplate?.id === cred.id
                            ? "bg-blue-500 text-white"
                            : "bg-white/10 text-zinc-400"
                        }`}
                      >
                        {cred.type === CredentialType.DEGREE ? "Degree" : cred.type === CredentialType.CERTIFICATE ? "Certificate" : "Badge"}
                      </span>
                      {selectedTemplate?.id === cred.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <h4
                      className={`font-bold ${
                        selectedTemplate?.id === cred.id
                          ? "text-white"
                          : "text-zinc-300"
                      }`}
                    >
                      {cred.name}
                    </h4>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Private Key Input - REMOVED (Auto-handled) */}
          <div className="bg-white/0.02 border border-white/10 rounded-2xl p-6">
             <h3 className="text-sm font-bold uppercase text-zinc-500 mb-2 tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4" /> Issuer Wallet
            </h3>
            <p className="text-xs text-zinc-400">
              Transaction will be signed using the private key associated with your connected wallet.
            </p>
          </div>
        </div>

        {/* RIGHT COL: SELECT STUDENTS (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-white/0.02 border border-white/10 rounded-2xl flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/0.02">
              <div>
                <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-wider mb-1">
                  2. Select Recipients
                </h3>
                <p className="text-xs text-zinc-400">
                  {selectedStudents.length} students selected
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students..."
                    className="bg-black/30 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm focus:border-white/30 outline-none w-64"
                  />
                </div>
                <button
                  onClick={selectAll}
                  className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {selectedStudents.length === students.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <Filter className="w-12 h-12 mb-4 opacity-20" />
                  <p>No students found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {filteredStudents.map((student) => (
                    <div
                      key={student._id}
                      onClick={() => toggleStudent(student._id)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all group ${
                        selectedStudents.includes(student._id)
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-white/0.02 border-transparent hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            selectedStudents.includes(student._id)
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-zinc-600 group-hover:border-zinc-400"
                          }`}
                        >
                          {selectedStudents.includes(student._id) && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                          )}
                        </div>
                        <div>
                          <h4
                            className={`font-bold ${
                              selectedStudents.includes(student._id)
                                ? "text-emerald-400"
                                : "text-zinc-200"
                            }`}
                          >
                            {student.studentName}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span>{student.studentId?.email}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span className="font-mono">
                              {student.studentWalletAddress?.slice(0, 6)}...
                              {student.studentWalletAddress?.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedStudents.includes(student._id) && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-white/10 bg-white/0.02">
              <button
                onClick={handleMint}
                disabled={
                  isMinting ||
                  selectedStudents.length === 0 ||
                  !selectedTemplate
                }
                className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Minting Credentials...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Issue {selectedStudents.length} Credentials
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
