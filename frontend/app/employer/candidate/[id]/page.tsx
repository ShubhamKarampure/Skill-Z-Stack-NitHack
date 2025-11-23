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

// Developer-provided image path (will be transformed by your environment into a URL)
const VERIFICATION_DECOR_IMAGE = "";

export default function CandidateProfile() {
  const params = useParams();
  const router = useRouter();

  const [candidate, setCandidate] = useState<any>(null);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"credentials" | "zkp">("credentials");
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof ZKP_TEMPLATES | null>("age");

  // age input is editable by user (used to build publicSignals shown in textarea)
  const [ageThreshold, setAgeThreshold] = useState("18");
  const [zkpInput, setZkpInput] = useState(JSON.stringify({ ...ZKP_TEMPLATES.age.template, publicSignals: [ageThreshold] }, null, 2));
  const [isVerifying, setIsVerifying] = useState(false);

  // Map tokenId -> full backend response object (used to render inline panel)
  const [verificationDetailsById, setVerificationDetailsById] = useState<Record<string, any>>({});

  const [credentialRoot, setCredentialRoot] = useState("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
  const [isCalculatingRoot, setIsCalculatingRoot] = useState(false);

  // Hidden internal threshold used internally in simulated verification (the user controls the publicSignals input)
  const HIDDEN_AGE_THRESHOLD = 22;

  React.useEffect(() => {
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
            avatar: user.name.substring(0, 2).toUpperCase(),
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
                  date: c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : "Invalid Date",
                  type: CREDENTIAL_TYPES[c.credentialType] || "Certificate",
                  // start as Unverified: user must click Verify
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

  // Keep zkpInput synced when selected template or ageThreshold changes
  React.useEffect(() => {
    if (!selectedTemplate) return;
    const template = JSON.parse(JSON.stringify(ZKP_TEMPLATES[selectedTemplate].template));
    if (selectedTemplate === "age") {
      template.publicSignals = [ageThreshold];
    }
    setZkpInput(JSON.stringify(template, null, 2));
  }, [selectedTemplate, ageThreshold]);

  // ---------- helpers ----------
  const sha256 = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return "0x" + hashHex;
  };

  const calculateMerkleRoot = async (leaves: string[]) => {
    if (leaves.length === 0) return "0x0";
    let currentLevel = leaves;
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combined = currentLevel[i] + currentLevel[i + 1].slice(2);
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
      const fileHashes = await Promise.all(
        files.map(async (file) => {
          const text = await file.text();
          return await sha256(text);
        })
      );
      const root = await calculateMerkleRoot(fileHashes);
      setCredentialRoot(root);
    } catch (error) {
      console.error("Error calculating Merkle root:", error);
    } finally {
      setIsCalculatingRoot(false);
    }
  };

  // Evaluate backend response; uses hidden threshold logic for age proofs when requested
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

    const quickFail =
      verificationObj.isValid === false || verificationObj.isActive === false || verificationObj.isRevoked === true;

    // Age rule (internal): if candidateAge detected and > HIDDEN_AGE_THRESHOLD => fail
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

  // Verify a single credential via backend — saves response into verificationDetailsById[tokenId]
  const verifyCredential = async (tokenId: string) => {
    if (!zkpInput) return;
    setIsVerifying(true);

    try {
      const proofData = JSON.parse(zkpInput);
      const proofType = proofData.proofType || "age";
      const proof = proofData.proof;
      const publicSignals = proofData.publicSignals;

      const res = await verifierService.verifyZKProof(tokenId, proofType, proof, publicSignals);

      // Save response for inline rendering under that credential
      setVerificationDetailsById((prev) => ({ ...prev, [String(tokenId)]: res }));

      // Evaluate (apply age rule when proofType === 'age')
      const { ok, status, verificationObj } = evaluateVerification(res, { enforceAgeRule: proofType === "age" });

      // Update credential status in UI
      setCredentials((prev) =>
        prev.map((c) => {
          if (String(c.id) === String(tokenId) || String(c.id) === String(res.tokenId)) {
            return {
              ...c,
              status: verificationObj?.isRevoked ? "Revoked" : ok ? "Verified" : "Failed",
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Credential verify failed", err);
      setVerificationDetailsById((prev) => ({ ...prev, [String(tokenId)]: { error: String(err) } }));
      setCredentials((prev) => prev.map((c) => (String(c.id) === String(tokenId) ? { ...c, status: "Failed" } : c)));
    } finally {
      setIsVerifying(false);
    }
  };

  // ---------- Simulated (temp) verification for Age tab ----------
  // This does not call backend: it builds a fake verification object using the age publicSignal (or ageThreshold)
  // and applies the internal rule: if age > 22 => fail, otherwise succeed.
  const simulateAgeVerification = async (tokenId: string) => {
    // parse local publicSignals (from zkpInput) to extract age if present; otherwise use ageThreshold state
    let signalAge: number | null = null;
    try {
      const parsed = JSON.parse(zkpInput);
      const signals = parsed.publicSignals;
      if (Array.isArray(signals) && signals.length) {
        const asNum = Number(signals[0]);
        if (!Number.isNaN(asNum)) signalAge = asNum;
      }
    } catch (e) {
      // fallback below
    }
    if (signalAge === null) {
      const asNum = Number(ageThreshold);
      if (!Number.isNaN(asNum)) signalAge = asNum;
    }

    // Build a fake response structure that looks like backend verification
    const age = signalAge ?? -1;
    const passesAgeRule = age <= HIDDEN_AGE_THRESHOLD;
    // Compose simulated verification object
    const simulated = {
      tokenId,
      verification: {
        isValid: passesAgeRule ? true : false,
        exists: true,
        isActive: true,
        isExpired: false,
        isRevoked: false,
        issuerAccredited: true,
        // include publicSignals and candidateAge so evaluateVerification can reuse them
        publicSignals: [String(age)],
        age,
      },
    };

    // Save simulated response
    setVerificationDetailsById((prev) => ({ ...prev, [String(tokenId)]: simulated }));

    // Evaluate using same evaluator (apply age rule)
    const { ok, status, verificationObj } = evaluateVerification(simulated, { enforceAgeRule: true });

    // Update the credential status in UI based on simulated result
    setCredentials((prev) =>
      prev.map((c) => {
        if (String(c.id) === String(tokenId)) {
          return {
            ...c,
            status: verificationObj?.isRevoked ? "Revoked" : ok ? "Verified" : "Failed",
          };
        }
        return c;
      })
    );
  };

  // ---------- rendering ----------
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

  // Render inline verification panel (matches earlier visual)
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

    // helper used for coloring boolean fields correctly (true = green, false = red, undefined = neutral)
    const boolClass = (k: string) => {
      if (!verificationObj) return "text-zinc-400";
      const v = verificationObj[k];
      if (typeof v === "undefined") return "text-zinc-400";
      return v === true ? "text-green-300" : "text-red-400"; // false -> red
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

          {/* decorative image (local path; transformed by your environment) */}
          {/* <img src={VERIFICATION_DECOR_IMAGE} alt="verification-decor" className="ml-auto hidden md:block w-28 h-12 object-contain opacity-60" /> */}
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
                onClick={() => setActiveTab("credentials")}
                className={`pb-3 px-2 text-sm font-bold transition-all relative ${
                  activeTab === "credentials" ? "text-indigo-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                Credentials
                {activeTab === "credentials" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400" />}
              </button>

              <button
                onClick={() => setActiveTab("zkp")}
                className={`pb-3 px-2 text-sm font-bold transition-all relative ${
                  activeTab === "zkp" ? "text-indigo-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                ZKP Verification
                {activeTab === "zkp" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400" />}
              </button>
            </div>

            {activeTab === "credentials" ? (
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

                        <button
                          onClick={() => verifyCredential(String(cred.id))}
                          disabled={isVerifying}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-all disabled:opacity-50"
                        >
                          {isVerifying ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                    </div>

                    {/* Inline verification panel for this credential (shown after clicking Verify) */}
                    {verificationDetailsById[String(cred.id)] && <div className="px-1">{renderVerificationPanel(String(cred.id))}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(ZKP_TEMPLATES) as Array<keyof typeof ZKP_TEMPLATES>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedTemplate === key ? "bg-indigo-600/20 border-indigo-500" : "bg-white/0.02 border-white/5 hover:border-white/20"
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
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/0.02 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <FileJson className="w-5 h-5 text-indigo-400" /> Verify {ZKP_TEMPLATES[selectedTemplate].title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigator.clipboard.writeText(zkpInput)} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors">
                          <Copy className="w-3 h-3" /> Copy Template
                        </button>


                        {selectedTemplate === "age" && (
                          <button
                            onClick={() => {
                              const first = credentials?.[0]?.id;
                              if (first) simulateAgeVerification(String(first));
                            }}
                            disabled={isVerifying || credentials.length === 0}
                            className="text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-bold"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedTemplate === "age" && (
                        <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 mb-4">
                          <label className="text-xs font-bold text-indigo-300 uppercase mb-2 block">Minimum Age Requirement</label>
                          <input
                            type="number"
                            value={ageThreshold}
                            onChange={(e) => setAgeThreshold(e.target.value)}
                            className="w-full bg-black/40 border border-indigo-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                          />
                          <p className="text-xs text-zinc-400 mt-2">Enter the minimum age to use for proof generation.</p>
                        </div>
                      )}

                      {selectedTemplate === "credential" && (
                        <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 mb-4">
                          <label className="text-xs font-bold text-indigo-300 uppercase mb-2 block">Credential Merkle Root</label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <label className="flex-1 cursor-pointer">
                                <div className="flex items-center justify-center w-full p-3 border-2 border-dashed border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors">
                                  <div className="flex items-center gap-2 text-sm text-indigo-300">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Credential Files</span>
                                  </div>
                                  <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                                </div>
                              </label>
                            </div>

                            <div className="relative">
                              <input type="text" value={credentialRoot} onChange={(e) => setCredentialRoot(e.target.value)} className="w-full bg-black/40 border border-indigo-500/30 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all pr-10" placeholder="0x..." />
                              {isCalculatingRoot && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-zinc-400 mt-2">Upload credential files to calculate the Merkle root, or enter it manually.</p>
                        </div>
                      )}

                      <details className="group">
                        <summary className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase cursor-pointer hover:text-zinc-300 transition-colors mb-2 select-none">
                          <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" /> View Raw Proof JSON
                        </summary>
                        <textarea value={zkpInput} readOnly className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-zinc-400 focus:outline-none resize-none" />
                      </details>

                      <div className="text-xs text-zinc-400">
                        Use the <strong>Verify</strong> button on a credential in the Credentials tab to run verification for that credential.
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
