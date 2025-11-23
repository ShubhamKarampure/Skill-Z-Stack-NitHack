"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  FileJson,
  Copy,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  Lock,
  ChevronRight,
  Upload,
} from "lucide-react";
import { verifierService, userService, credentialService } from "@/lib/api";

const ZKP_TEMPLATES = {
  age: {
    title: "Age Verification",
    description: "Prove age without revealing exact birthdate.",
    template: {
      proofType: "age",
      proof: { a: ["0x...", "0x..."], b: [["0x...", "0x..."], ["0x...", "0x..."]], c: ["0x...", "0x..."] },
      publicSignals: ["18"],
    },
  },
  credential: {
    title: "Credential Ownership",
    description: "Prove you own a specific credential without revealing the credential ID.",
    template: {
      proofType: "credential",
      proof: { a: ["0x...", "0x..."], b: [["0x...", "0x..."], ["0x...", "0x..."]], c: ["0x...", "0x..."] },
      publicSignals: ["0xRoot..."],
    },
  },
};

const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
  </div>
);

// Use the developer-provided local path (will be transformed to a usable URL by your environment)
const VERIFICATION_DECOR_IMAGE = "/mnt/data/6953a4c3-e77e-4722-9e4b-ef9c9a7e7760.png";

export default function CandidateProfile() {
  const params = useParams();
  const router = useRouter();

  const [candidate, setCandidate] = useState<any>(null);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"zkp" | "tamper">("zkp");
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof ZKP_TEMPLATES | null>("age");

  // age input (editable) -> used in publicSignals / simulated checks
  const [ageThreshold, setAgeThreshold] = useState("18");
  const [zkpInput, setZkpInput] = useState(JSON.stringify({ ...ZKP_TEMPLATES.age.template, publicSignals: [ageThreshold] }, null, 2));
  const [isVerifying, setIsVerifying] = useState(false);

  // credential merkle root (from file upload or user input)
  const [credentialRoot, setCredentialRoot] = useState<string>("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
  const [isCalculatingRoot, setIsCalculatingRoot] = useState(false);

  // Inline verification responses mapped by tokenId
  const [verificationDetailsById, setVerificationDetailsById] = useState<Record<string, any>>({});

  // ----- Tamper-check state -----
  // NOTE: this now APPENDS newly selected files to the existing list rather than replacing it.
  const [tamperFiles, setTamperFiles] = useState<File[]>([]);
  const [tamperPreviews, setTamperPreviews] = useState<string[]>([]);
  const [tamperResults, setTamperResults] = useState<{ idx: number; hash: string; tampered: boolean }[]>([]);
  const [isVerifyingTamper, setIsVerifyingTamper] = useState(false);

  // Hidden internal threshold used in age verification logic
  const HIDDEN_AGE_THRESHOLD = 22;

  // fetch user + credentials
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await userService.getUserById(params.id as string);
        if (userRes.success && userRes.data?.user) {
          const user = userRes.data.user as any;
          setCandidate({
            id: user.id || user._id,
            name: user.name,
            role: "Student",
            walletAddress: user.walletAddress,
            avatar: user.name?.substring(0, 2).toUpperCase() || "NA",
            bio: user.studentData?.bio || "No bio provided.",
            email: user.email,
            location: user.studentData?.location || "Unknown",
          });

          if (user.walletAddress) {
            const credRes = await credentialService.getCredentialsByAddress(user.walletAddress);
            localStorage.setItem("candidate_credRes", JSON.stringify(credRes));
            if (credRes.success && credRes.data?.credentials) {
              const CREDENTIAL_TYPES = ["Degree", "Certificate", "Badge"];
              setCredentials(
                credRes.data.credentials.map((c: any) => ({
                  id: c.tokenId,
                  title: c.metadata?.name || CREDENTIAL_TYPES[c.credentialType] || "Credential",
                  issuer: c.issuer,
                  date: c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : "",
                  type: CREDENTIAL_TYPES[c.credentialType] || "Certificate",
                  status: c.isRevoked ? "Revoked" : "Unverified",
                }))
              );
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch candidate data", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // keep zkpInput in sync when template or ageThreshold changes
  useEffect(() => {
    if (!selectedTemplate) return;
    const template = JSON.parse(JSON.stringify(ZKP_TEMPLATES[selectedTemplate].template));
    if (selectedTemplate === "age") template.publicSignals = [ageThreshold];
    if (selectedTemplate === "credential") template.publicSignals = [credentialRoot];
    setZkpInput(JSON.stringify(template, null, 2));
  }, [selectedTemplate, ageThreshold, credentialRoot]);

  // ---------- helpers ----------
  const sha256Hex = async (buffer: ArrayBuffer) => {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return "0x" + hashHex;
  };

  const hashString = async (s: string) => {
    const enc = new TextEncoder().encode(s);
    return await sha256Hex(enc.buffer);
  };

  // simple merkle root calc
  const calculateMerkleRoot = async (leaves: string[]) => {
    if (leaves.length === 0) return "0x0";
    let current = leaves.slice();
    while (current.length > 1) {
      const next: string[] = [];
      for (let i = 0; i < current.length; i += 2) {
        if (i + 1 < current.length) {
          const combined = current[i] + current[i + 1].slice(2);
          next.push(await hashString(combined));
        } else {
          next.push(current[i]);
        }
      }
      current = next;
    }
    return current[0];
  };

  const handleCredentialFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsCalculatingRoot(true);
    try {
      const files = Array.from(e.target.files);
      const hashes = await Promise.all(
        files.map(async (f) => {
          const text = await f.text();
          return await hashString(text);
        })
      );
      const root = await calculateMerkleRoot(hashes);
      setCredentialRoot(root);
    } catch (err) {
      console.error("error calc merkle root", err);
    } finally {
      setIsCalculatingRoot(false);
      // reset file input so user can re-select same file if needed
      if (e.target) e.target.value = "";
    }
  };

  // evaluate backend response + hidden age rule
  const evaluateVerification = (res: any, opts?: { enforceAgeRule?: boolean }) => {
    const verificationObj = res?.verification || res?.data?.verification || res?.data || res;
    if (!verificationObj) return { ok: false, status: "Failed", verificationObj: null };

    const fullPass =
      verificationObj.isValid === true &&
      verificationObj.exists === true &&
      verificationObj.isActive === true &&
      verificationObj.isExpired === false &&
      verificationObj.isRevoked === false &&
      verificationObj.issuerAccredited === true;

    const quickFail = verificationObj.isValid === false || verificationObj.isActive === false || verificationObj.isRevoked === true;

    if (opts?.enforceAgeRule) {
      let candidateAge: number | null = null;
      if (typeof verificationObj.age === "number") candidateAge = verificationObj.age;
      if (!candidateAge && typeof verificationObj.candidateAge === "number") candidateAge = verificationObj.candidateAge;
      if (!candidateAge && Array.isArray(verificationObj.publicSignals) && verificationObj.publicSignals.length) {
        const v0 = verificationObj.publicSignals[0];
        const asNum = Number(v0);
        if (!Number.isNaN(asNum) && asNum > 0 && asNum < 200) candidateAge = asNum;
      }
      if (candidateAge !== null && candidateAge > HIDDEN_AGE_THRESHOLD) {
        return { ok: false, status: "Failed", verificationObj };
      }
    }

    if (verificationObj.isRevoked === true) {
      return { ok: false, status: "Revoked", verificationObj };
    }
    if (fullPass && !quickFail) {
      return { ok: true, status: "Verified", verificationObj };
    }
    return { ok: false, status: "Failed", verificationObj };
  };

  // Verify a single credential via backend (saves response under verificationDetailsById)
  const verifyCredential = async (tokenId: string) => {
    if (!zkpInput) return;
    setIsVerifying(true);
    try {
      const proofData = JSON.parse(zkpInput);
      const proofType = proofData.proofType || "age";
      const proof = proofData.proof;
      const publicSignals = proofData.publicSignals;

      const res = await verifierService.verifyZKProof(tokenId, proofType, proof, publicSignals);

      setVerificationDetailsById((prev) => ({ ...prev, [String(tokenId)]: res }));

      const { ok, verificationObj } = evaluateVerification(res, { enforceAgeRule: proofType === "age" });

      setCredentials((prev) =>
        prev.map((c) => {
          if (String(c.id) === String(tokenId) || String(c.id) === String(res.tokenId)) {
            return { ...c, status: verificationObj?.isRevoked ? "Revoked" : ok ? "Verified" : "Failed" };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("verifyCredential error", err);
      setVerificationDetailsById((prev) => ({ ...prev, [String(tokenId)]: { error: String(err) } }));
      setCredentials((prev) => prev.map((c) => (String(c.id) === String(tokenId) ? { ...c, status: "Failed" } : c)));
    } finally {
      setIsVerifying(false);
    }
  };

  // Simulated age verification (no backend) - used by "Quick Age Check"
  const simulateAgeVerification = async (tokenId: string) => {
    // read age from zkpInput.publicSignals or ageThreshold
    let signalAge: number | null = null;
    try {
      const parsed = JSON.parse(zkpInput);
      const signals = parsed.publicSignals;
      if (Array.isArray(signals) && signals.length) {
        const asNum = Number(signals[0]);
        if (!Number.isNaN(asNum)) signalAge = asNum;
      }
    } catch (e) {
      // ignore
    }
    if (signalAge === null) {
      const a = Number(ageThreshold);
      if (!Number.isNaN(a)) signalAge = a;
    }
    const age = signalAge ?? -1;
    const passes = age <= HIDDEN_AGE_THRESHOLD;

    const simulated = {
      tokenId,
      verification: {
        isValid: passes,
        exists: true,
        isActive: true,
        isExpired: false,
        isRevoked: false,
        issuerAccredited: true,
        publicSignals: [String(age)],
        age,
      },
    };

    setVerificationDetailsById((prev) => ({ ...prev, [String(tokenId)]: simulated }));

    const { ok, verificationObj } = evaluateVerification(simulated, { enforceAgeRule: true });

    setCredentials((prev) =>
      prev.map((c) => {
        if (String(c.id) === String(tokenId)) {
          return { ...c, status: verificationObj?.isRevoked ? "Revoked" : ok ? "Verified" : "Failed" };
        }
        return c;
      })
    );
  };

  // ---------- Tamper check logic ----------
  // Append newly selected images to existing list (instead of replacing)
  const onTamperFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    // Create new previews for the newly selected files
    const newPreviews = files.map((f) => URL.createObjectURL(f));

    // Append files and previews
    setTamperFiles((prev) => [...prev, ...files]);
    setTamperPreviews((prev) => [...prev, ...newPreviews]);

    // Reset previous results (we'll recompute on Verify)
    setTamperResults([]);

    // Reset the file input so users can re-select the same file later if needed
    if (e.target) e.target.value = "";
  };

  const verifyTamperImages = async () => {
    if (!tamperFiles.length) return;
    setIsVerifyingTamper(true);
    try {
      const buffers = await Promise.all(tamperFiles.map((f) => f.arrayBuffer()));
      const hashes = await Promise.all(buffers.map((b) => sha256Hex(b)));
      const baseline = hashes[0];
      const results = hashes.map((h, idx) => ({ idx, hash: h, tampered: h !== baseline }));
      setTamperResults(results);
    } catch (err) {
      console.error("verifyTamperImages error", err);
      setTamperResults([]);
    } finally {
      setIsVerifyingTamper(false);
    }
  };

  const clearTamper = () => {
    // revoke previews
    tamperPreviews.forEach((p) => URL.revokeObjectURL(p));
    setTamperFiles([]);
    setTamperPreviews([]);
    setTamperResults([]);
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      tamperPreviews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [tamperPreviews]);

  // ---------- rendering helpers ----------
  const renderVerificationPanel = (tokenId: string) => {
    const raw = verificationDetailsById[String(tokenId)];
    if (!raw) return null;

    if (raw.error) {
      return (
        <div className="mt-3 rounded-lg border border-white/5 bg-black/30 p-4">
          <div className="text-sm font-bold text-red-400">Verification Error</div>
          <pre className="mt-2 text-xs font-mono text-zinc-300">{raw.error}</pre>
        </div>
      );
    }

    const verificationObj = raw?.verification || raw?.data?.verification || raw?.data || raw;
    const passed =
      verificationObj &&
      verificationObj.isValid === true &&
      verificationObj.exists === true &&
      verificationObj.isActive === true &&
      verificationObj.isExpired === false &&
      verificationObj.isRevoked === false &&
      verificationObj.issuerAccredited === true;

    const boolClass = (k: string) => {
      if (!verificationObj) return "text-zinc-400";
      const v = verificationObj[k];
      if (typeof v === "undefined") return "text-zinc-400";
      return v === true ? "text-green-300" : "text-red-400"; // false => red
    };

    const field = (k: string) => {
      if (!verificationObj) return "–";
      const v = verificationObj[k];
      if (typeof v === "undefined") return "–";
      return String(v);
    };

    const displayToken = raw.tokenId || verificationObj?.tokenId || tokenId;

    return (
      <div className="mt-3 rounded-2xl border border-white/5 bg-black/30 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`rounded-full p-1 ${passed ? "bg-green-900/40" : "bg-red-900/30"}`}>
            <CheckCircle2 className={`w-5 h-5 ${passed ? "text-green-400" : "text-red-400"}`} />
          </div>
          <div>
            <div className={`text-sm font-bold ${passed ? "text-green-400" : "text-red-400"}`}>
              {passed ? "Verified Successfully" : "Verification Result"}
            </div>
            <div className="text-xs text-zinc-400">{passed ? "All checks passed" : "One or more checks failed"}</div>
          </div>

          {VERIFICATION_DECOR_IMAGE && (
            <img src={VERIFICATION_DECOR_IMAGE} alt="verification-decor" className="ml-auto hidden md:block w-28 h-12 object-contain opacity-60" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="col-span-1 md:col-span-2 bg-white/2 p-2 rounded font-mono text-xs flex items-center justify-between">
            <span className="text-zinc-400">Token ID</span>
            <span className="text-sm">{displayToken}</span>
          </div>

          <div className="bg-white/2 p-2 rounded text-xs flex items-center justify-between">
            <span className="text-zinc-400">Is Valid</span>
            <span className={`font-mono ${boolClass("isValid")}`}>{field("isValid")}</span>
          </div>

          <div className="bg-white/2 p-2 rounded text-xs flex items-center justify-between">
            <span className="text-zinc-400">Exists</span>
            <span className={`font-mono ${boolClass("exists")}`}>{field("exists")}</span>
          </div>

          <div className="bg-white/2 p-2 rounded text-xs flex items-center justify-between">
            <span className="text-zinc-400">Is Active</span>
            <span className={`font-mono ${boolClass("isActive")}`}>{field("isActive")}</span>
          </div>

          <div className="bg-white/2 p-2 rounded text-xs flex items-center justify-between">
            <span className="text-zinc-400">Is Expired</span>
            <span className={`font-mono ${boolClass("isExpired")}`}>{field("isExpired")}</span>
          </div>

          <div className="bg-white/2 p-2 rounded text-xs flex items-center justify-between">
            <span className="text-zinc-400">Is Revoked</span>
            <span className={`font-mono ${boolClass("isRevoked")}`}>{field("isRevoked")}</span>
          </div>

          <div className="bg-white/2 p-2 rounded text-xs flex items-center justify-between">
            <span className="text-zinc-400">Issuer Accredited</span>
            <span className={`font-mono ${boolClass("issuerAccredited")}`}>{field("issuerAccredited")}</span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Candidate Not Found</h2>
          <button onClick={() => router.back()} className="text-indigo-400 hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ---------- final render ----------
  return (
    <main className="min-h-screen font-sans text-white selection:bg-indigo-500/30">
      <Aurora />
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
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
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" /> ID
                    </span>
                    <span className="font-mono text-white">{candidate.id}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Wallet
                    </span>
                    <span className="font-mono text-white truncate w-32 text-right">{candidate.walletAddress}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-sm font-bold text-zinc-500 uppercase mb-3">About</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">{candidate.bio}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
              <button
                onClick={() => setActiveTab("zkp")}
                className={`pb-3 px-2 text-sm font-bold transition-all relative ${
                  activeTab === "zkp" ? "text-indigo-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                ZKP
                {activeTab === "zkp" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400" />}
              </button>

              <button
                onClick={() => setActiveTab("tamper")}
                className={`pb-3 px-2 text-sm font-bold transition-all relative ${
                  activeTab === "tamper" ? "text-indigo-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                Tamper Check
                {activeTab === "tamper" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400" />}
              </button>
            </div>

            {activeTab === "zkp" ? (
              // ZKP tab: contains Age and Credential Ownership merged + credential list with per-credential Verify
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/0.02 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <FileJson className="w-5 h-5 text-indigo-400" /> Verify (Age & Credential Ownership)
                    </h3>
                    <button onClick={() => navigator.clipboard.writeText(zkpInput)} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Copy className="w-3 h-3" /> Copy Template
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Age input */}
                    <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <label className="text-xs font-bold text-indigo-300 uppercase mb-2 block">Age (public signal)</label>
                      <input
                        type="number"
                        value={ageThreshold}
                        onChange={(e) => setAgeThreshold(e.target.value)}
                        className="w-full bg-black/40 border border-indigo-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                      />
                      <p className="text-xs text-zinc-400 mt-2">This value is used for age proof public signals.</p>
                    </div>

                    {/* Credential merkle root + upload */}
                    <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <label className="text-xs font-bold text-indigo-300 uppercase mb-2 block">Credential Merkle Root & Upload</label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="flex items-center justify-center w-full p-3 border-2 border-dashed border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors">
                            <div className="flex items-center gap-2 text-sm text-indigo-300">
                              <Upload className="w-4 h-4" />
                              <span>Upload Credential Files</span>
                            </div>
                            <input type="file" multiple className="hidden" onChange={handleCredentialFilesUpload} />
                          </div>
                        </label>

                        <div className="relative">
                          <input type="text" value={credentialRoot} onChange={(e) => setCredentialRoot(e.target.value)} className="w-full bg-black/40 border border-indigo-500/30 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all pr-10" placeholder="0x..." />
                          {isCalculatingRoot && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2">Upload credential files to calculate the Merkle root or enter it manually.</p>
                    </div>
                  </div>

                  <details className="group">
                    <summary className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase cursor-pointer hover:text-zinc-300 transition-colors mb-2 select-none">
                      <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" /> View Raw Proof JSON
                    </summary>
                    <textarea value={zkpInput} readOnly className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-zinc-400 focus:outline-none resize-none" />
                  </details>
                </motion.div>

                {/* Credentials list: per-credential Verify (uses same uploaded files / merkle input) */}
                <div className="space-y-4">
                  {credentials.map((cred) => (
                    <div key={cred.id} className="space-y-2">
                      <div className="bg-white/0.02 border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-indigo-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                            {cred.type === "Degree" ? <GraduationCap className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-indigo-300 transition-colors">{cred.title}</h3>
                            <p className="text-sm text-zinc-400">
                              {cred.issuer} • {cred.date}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1 font-mono truncate">{String(cred.id)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold
                              ${cred.status === "Revoked" ? "text-red-400 bg-red-400/10" : ""}
                              ${cred.status === "Verified" ? "text-green-400 bg-green-400/10" : ""}
                              ${cred.status === "Failed" ? "text-red-300 bg-white/3" : ""}
                              ${cred.status === "Unverified" ? "text-zinc-300 bg-white/2" : ""}
                            `}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {cred.status}
                          </div>

                          <div className="flex gap-2">
                            {/* normal backend verify */}
                            <button
                              onClick={() => verifyCredential(String(cred.id))}
                              disabled={isVerifying}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-all disabled:opacity-50"
                            >
                              {isVerifying ? "Verifying..." : "Verify"}
                            </button>

                            {/* quick/simulated age verify (useful for testing age logic) */}
                            <button
                              onClick={() => simulateAgeVerification(String(cred.id))}
                              disabled={isVerifying}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md transition-all disabled:opacity-50"
                            >
                              Quick Age Check
                            </button>
                          </div>
                        </div>
                      </div>

                      {verificationDetailsById[String(cred.id)] && <div className="px-1">{renderVerificationPanel(String(cred.id))}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Tamper Check tab
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/0.02 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <FileJson className="w-5 h-5 text-indigo-400" /> Tamper Check
                    </h3>
                  </div>

                  <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 mb-4">
                    <label className="text-xs font-bold text-indigo-300 uppercase mb-2 block">Upload Images </label>

                    <div className="flex items-center gap-3 mb-3">
                      {/* Beautified upload: dashed card that appends files to the list */}
                      <label
                        className="flex items-center gap-3 cursor-pointer bg-black/20 px-4 py-2 rounded-lg border-2 border-dashed border-indigo-500/30 hover:bg-indigo-500/10 transition-colors"
                        title="Click to add images (appends to existing list)"
                      >
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-indigo-300" />
                          <div className="text-sm text-indigo-300">Add Images</div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={onTamperFilesChange}
                          className="hidden"
                        />
                        <div className="ml-3 text-xxs text-zinc-400 font-mono">{tamperFiles.length > 0 ? `${tamperFiles.length} total` : "No images"}</div>
                      </label>

                      {/* Option A: enable verify when >= 1 image */}
                      <button
                        onClick={verifyTamperImages}
                        disabled={isVerifyingTamper || tamperFiles.length === 0}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-all disabled:opacity-50"
                      >
                        {isVerifyingTamper ? "Verifying..." : "Verify Images"}
                      </button>

                      <button onClick={clearTamper} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs font-bold rounded-md transition-all">
                        Clear
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400 mb-3">Upload one or more images. Different SHA-256 hashes are marked "Tampered".</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {tamperPreviews.map((p, i) => {
                        const res = tamperResults.find((r) => r.idx === i);
                        const label = res ? (res.tampered ? "Tampered" : "Not tampered") : "Pending";
                        const colorClass = res ? (res.tampered ? "text-red-400" : "text-green-400") : "text-zinc-300";
                        return (
                          <div key={i} className="bg-black/20 rounded p-3 text-center">
                            <img src={p} alt={`img-${i}`} className="w-full h-24 object-cover rounded mb-2" />
                            <div className={`text-xs font-mono ${colorClass}`}>{label}</div>
                            <div className="text-xxs mt-1 text-zinc-400 truncate">{res?.hash?.slice(0, 12) ?? "—"}</div>
                            <div className="text-xxs text-zinc-500 mt-1">#{i + 1}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <details className="group">
                    <summary className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase cursor-pointer hover:text-zinc-300 transition-colors mb-2 select-none">
                      <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" /> View Tamper Results JSON
                    </summary>
                    <pre className="bg-black/40 p-3 rounded text-xs max-h-48 overflow-auto">{JSON.stringify(tamperResults, null, 2)}</pre>
                  </details>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
