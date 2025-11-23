"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  FileJson,
  Copy,
  CheckCircle2,
  XCircle,
  ExternalLink,
  User,
  Briefcase,
  GraduationCap,
  Lock,
  ChevronRight,
  Upload,
} from "lucide-react";
import { verifierService } from "@/lib/api";

// --- MOCK DATA (Shared with Dashboard) ---
const MOCK_CANDIDATES = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Frontend Developer",
    walletAddress: "0x7f8...a3c2",
    avatar: "AC",
    bio: "Passionate frontend developer with 5 years of experience in React and Web3.",
    email: "alex.chen@example.com",
    location: "San Francisco, CA",
  },
  {
    id: "2",
    name: "Sarah Jones",
    role: "Smart Contract Eng",
    walletAddress: "0x3a2...b1b9",
    avatar: "SJ",
    bio: "Solidity expert specializing in DeFi protocols and security audits.",
    email: "sarah.jones@example.com",
    location: "New York, NY",
  },
  {
    id: "3",
    name: "Mike Ross",
    role: "Product Designer",
    walletAddress: "0x99c...d2e1",
    avatar: "MR",
    bio: "UI/UX designer focused on creating intuitive decentralized applications.",
    email: "mike.ross@example.com",
    location: "Remote",
  },
];

const MOCK_CREDENTIALS = [
  {
    id: "101",
    title: "Advanced React Patterns",
    issuer: "TechCertified Academy",
    date: "2024-11-15",
    type: "Certificate",
    status: "Verified",
  },
  {
    id: "102",
    title: "Solidity Developer Bootcamp",
    issuer: "ConsenSys",
    date: "2024-08-20",
    type: "Certificate",
    status: "Verified",
  },
  {
    id: "103",
    title: "Computer Science Degree",
    issuer: "Stanford University",
    date: "2023-06-10",
    type: "Degree",
    status: "Verified",
  },
];

// --- ZKP TEMPLATES ---
const ZKP_TEMPLATES = {
  age: {
    title: "Age Verification",
    description: "Prove you are over 18 without revealing your birthdate.",
    template: {
      proofType: "age",
      proof: {
        a: ["0x...", "0x..."],
        b: [["0x...", "0x..."], ["0x...", "0x..."]],
        c: ["0x...", "0x..."]
      },
      publicSignals: ["18"] // Threshold
    }
  },
  credential: {
    title: "Credential Ownership",
    description: "Prove you own a specific credential without revealing the credential ID.",
    template: {
      proofType: "credential",
      proof: {
        a: ["0x...", "0x..."],
        b: [["0x...", "0x..."], ["0x...", "0x..."]],
        c: ["0x...", "0x..."]
      },
      publicSignals: ["0xRoot..."] // Merkle Root
    }
  },
  rank: {
    title: "University Rank",
    description: "Prove your university is ranked within the top 100.",
    template: {
      proofType: "rank",
      proof: {
        a: ["0x...", "0x..."],
        b: [["0x...", "0x..."], ["0x...", "0x..."]],
        c: ["0x...", "0x..."]
      },
      publicSignals: ["100"] // Rank Threshold
    }
  }
};

const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
  </div>
);

export default function CandidateProfile() {
  const params = useParams();
  const router = useRouter();
  const candidate = MOCK_CANDIDATES.find((c) => c.id === params.id);

  const [activeTab, setActiveTab] = useState<"credentials" | "zkp">("credentials");
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof ZKP_TEMPLATES | null>(null);
  const [zkpInput, setZkpInput] = useState("");
  const [verificationResult, setVerificationResult] = useState<"success" | "error" | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Form states
  const [ageThreshold, setAgeThreshold] = useState("18");
  const [credentialRoot, setCredentialRoot] = useState("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
  const [maxRank, setMaxRank] = useState("100");
  const [isCalculatingRoot, setIsCalculatingRoot] = useState(false);

  // Helper function to hash data using SHA-256
  const sha256 = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return '0x' + hashHex;
  };

  // Simple Merkle Tree implementation
  const calculateMerkleRoot = async (leaves: string[]) => {
    if (leaves.length === 0) return '0x0';
    
    let currentLevel = leaves;
    
    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combined = currentLevel[i] + currentLevel[i + 1].slice(2); // Remove 0x from second
          nextLevel.push(await sha256(combined));
        } else {
          nextLevel.push(currentLevel[i]);
        }
      }
      currentLevel = nextLevel;
    }
    
    return currentLevel[0];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsCalculatingRoot(true);
    try {
      const files = Array.from(e.target.files);
      const fileHashes = await Promise.all(files.map(async (file) => {
        const text = await file.text();
        return await sha256(text);
      }));
      
      const root = await calculateMerkleRoot(fileHashes);
      setCredentialRoot(root);
    } catch (error) {
      console.error("Error calculating Merkle root:", error);
    } finally {
      setIsCalculatingRoot(false);
    }
  };

  // Update JSON when inputs change
  React.useEffect(() => {
    if (!selectedTemplate) return;
    
    const template = JSON.parse(JSON.stringify(ZKP_TEMPLATES[selectedTemplate].template));
    
    if (selectedTemplate === 'age') {
      template.publicSignals = [ageThreshold];
    } else if (selectedTemplate === 'credential') {
      template.publicSignals = [credentialRoot];
    } else if (selectedTemplate === 'rank') {
      template.publicSignals = [maxRank];
    }
    
    setZkpInput(JSON.stringify(template, null, 2));
  }, [selectedTemplate, ageThreshold, credentialRoot, maxRank]);

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Candidate not found</p>
      </div>
    );
  }

  const handleCopyTemplate = (type: keyof typeof ZKP_TEMPLATES) => {
    const template = JSON.stringify(ZKP_TEMPLATES[type].template, null, 2);
    navigator.clipboard.writeText(template);
    // Ideally show a toast here
  };

  const handleVerifyZKP = async () => {
    if (!zkpInput) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const proofData = JSON.parse(zkpInput);
      // In a real app, we would use the selected template type or infer it
      const type = proofData.proofType || "age"; 
      
      const res = await verifierService.verifyZKProof(type, proofData.proof, proofData.publicSignals);
      
      if (res.success && res.data?.isValid) {
        setVerificationResult("success");
      } else {
        setVerificationResult("error");
      }
    } catch (error) {
      console.error("ZKP Verification failed", error);
      setVerificationResult("error");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen font-sans text-white selection:bg-indigo-500/30">
      <Aurora />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <button 
          onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/0.02 border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold mb-4">
                {candidate.avatar}
              </div>
              <h1 className="text-2xl font-bold mb-1">{candidate.name}</h1>
              <p className="text-indigo-400 font-medium mb-4">{candidate.role}</p>
              
              <div className="w-full space-y-3 text-sm text-zinc-400">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> ID</span>
                  <span className="font-mono text-white">{candidate.id}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Wallet</span>
                  <span className="font-mono text-white truncate w-32 text-right">{candidate.walletAddress}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <h3 className="text-sm font-bold text-zinc-500 uppercase mb-3">About</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {candidate.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2">
          <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
            <button
              onClick={() => setActiveTab("credentials")}
              className={`pb-3 px-2 text-sm font-bold transition-all relative ${
                activeTab === "credentials" ? "text-indigo-400" : "text-zinc-400 hover:text-white"
              }`}
            >
              Credentials
              {activeTab === "credentials" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("zkp")}
              className={`pb-3 px-2 text-sm font-bold transition-all relative ${
                activeTab === "zkp" ? "text-indigo-400" : "text-zinc-400 hover:text-white"
              }`}
            >
              ZKP Verification
              {activeTab === "zkp" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400" />
              )}
            </button>
          </div>

          {activeTab === "credentials" ? (
            <div className="space-y-4">
              {MOCK_CREDENTIALS.map((cred) => (
                <div key={cred.id} className="bg-white/0.02 border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-indigo-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                      {cred.type === "Degree" ? <GraduationCap className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-indigo-300 transition-colors">{cred.title}</h3>
                      <p className="text-sm text-zinc-400">{cred.issuer} • {cred.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    {cred.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(ZKP_TEMPLATES) as Array<keyof typeof ZKP_TEMPLATES>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedTemplate === key
                        ? "bg-indigo-600/20 border-indigo-500"
                        : "bg-white/0.02 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="mb-2 text-indigo-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{ZKP_TEMPLATES[key].title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{ZKP_TEMPLATES[key].description}</p>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/0.02 border border-white/5 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <FileJson className="w-5 h-5 text-indigo-400" />
                      Verify {ZKP_TEMPLATES[selectedTemplate].title}
                    </h3>
                    <button
                      onClick={() => handleCopyTemplate(selectedTemplate)}
                      className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Template
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Dynamic Inputs based on Template */}
                    <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 mb-4">
                      {selectedTemplate === 'age' && (
                        <div>
                          <label className="text-xs font-bold text-indigo-300 uppercase mb-2 block">
                            Minimum Age Requirement
                          </label>
                          <input 
                            type="number" 
                            value={ageThreshold}
                            onChange={(e) => setAgeThreshold(e.target.value)}
                            className="w-full bg-black/40 border border-indigo-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                          />
                          <p className="text-xs text-zinc-400 mt-2">
                            The system will verify if the candidate is older than this age using the provided ZK proof.
                          </p>
                        </div>
                      )}

                      {selectedTemplate === 'credential' && (
                        <div>
                          <label className="text-xs font-bold text-indigo-300 uppercase mb-2 block">
                            Credential Merkle Root
                          </label>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <label className="flex-1 cursor-pointer">
                                <div className="flex items-center justify-center w-full p-3 border-2 border-dashed border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors">
                                  <div className="flex items-center gap-2 text-sm text-indigo-300">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Credential Files</span>
                                  </div>
                                  <input 
                                    type="file" 
                                    multiple 
                                    className="hidden" 
                                    onChange={handleFileUpload}
                                  />
                                </div>
                              </label>
                            </div>

                            <div className="relative">
                              <input 
                                type="text" 
                                value={credentialRoot}
                                onChange={(e) => setCredentialRoot(e.target.value)}
                                className="w-full bg-black/40 border border-indigo-500/30 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all pr-10"
                                placeholder="0x..."
                              />
                              {isCalculatingRoot && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-zinc-400 mt-2">
                            Upload credential files to calculate the Merkle root, or enter it manually.
                          </p>
                        </div>
                      )}

                      {selectedTemplate === 'rank' && (
                        <div>
                          <label className="text-xs font-bold text-indigo-300 uppercase mb-2 block">
                            Maximum University Rank
                          </label>
                          <input 
                            type="number" 
                            value={maxRank}
                            onChange={(e) => setMaxRank(e.target.value)}
                            className="w-full bg-black/40 border border-indigo-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                          />
                          <p className="text-xs text-zinc-400 mt-2">
                            Verify if the candidate's university is ranked within this top N list.
                          </p>
                        </div>
                      )}
                    </div>

                    <details className="group">
                      <summary className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase cursor-pointer hover:text-zinc-300 transition-colors mb-2 select-none">
                        <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                        View Raw Proof JSON
                      </summary>
                      <textarea
                        value={zkpInput}
                        readOnly
                        className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-zinc-400 focus:outline-none resize-none"
                      />
                    </details>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        {verificationResult === "success" && (
                          <span className="flex items-center gap-2 text-green-400 text-sm font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Verified Successfully
                          </span>
                        )}
                        {verificationResult === "error" && (
                          <span className="flex items-center gap-2 text-red-400 text-sm font-bold">
                            <XCircle className="w-4 h-4" /> Verification Failed
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={handleVerifyZKP}
                        disabled={isVerifying || !zkpInput}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isVerifying ? "Verifying..." : "Verify Proof"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </main>
  );
}
