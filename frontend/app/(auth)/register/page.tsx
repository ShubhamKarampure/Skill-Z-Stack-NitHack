"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Wallet,
  Building2,
  GraduationCap,
  Briefcase,
  ShieldAlert,
} from "lucide-react";
import { authService } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { LogoCrest } from "@/components/logo";
import { Loader } from "@/components/loader";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";

// --- CONFIGURATION ---
const IS_PRODUCTION = process.env.NEXT_PUBLIC_NODE_ENV === "production";

// --- BACKGROUND ---
const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px]" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[120px]" />
  </div>
);

type Role = "student" | "institute" | "employer" | "admin";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);
  const { connectWallet } = useWallet();

  const [role, setRole] = useState<Role>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);
  const [targetPath, setTargetPath] = useState("/");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
    companyName: "",
  });

  // AUTO-FILL WALLET LOGIC
  useEffect(() => {
    const initWallet = async () => {
      // 1. Check URL params (if redirected from Login)
      const urlAddress = searchParams.get("address");
      if (urlAddress) {
        setFormData((prev) => ({ ...prev, walletAddress: urlAddress }));
        return;
      }

      // 2. If Production, auto-connect to fill field
      if (IS_PRODUCTION) {
        const address = await connectWallet();
        if (address) {
          setFormData((prev) => ({ ...prev, walletAddress: address }));
        }
      }
    };
    initWallet();
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      walletAddress: formData.walletAddress,
      ...(role === "employer" && { companyName: formData.companyName }),
    };

    try {
      const response = await authService.register(payload);

      if (response.success && response.token && response.user) {
        login(response.user, response.token);

        const redirectMap: Record<Role, string> = {
          student: "/student/dashboard",
          institute: "/institute/dashboard",
          employer: "/employer/dashboard",
          admin: "/admin/dashboard",
        };

        setTargetPath(redirectMap[role] || "/");
        setShowSuccessLoader(true);
      } else {
        setError(response.message || "Registration failed");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <AnimatePresence>
        {showSuccessLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <Loader onComplete={() => router.push(targetPath)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 font-sans text-white">
        <Aurora />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 group"
            >
              <LogoCrest className="w-16 h-16 group-hover:scale-105 transition-transform" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-zinc-400">
              Join the decentralized credential network.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-4 gap-2 p-1 bg-white/5 rounded-2xl mb-8 border border-white/10">
            {[
              { id: "student", label: "Student", icon: GraduationCap },
              { id: "institute", label: "Institute", icon: Building2 },
              { id: "employer", label: "Employer", icon: Briefcase },
              { id: "admin", label: "Admin", icon: ShieldAlert },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRole(tab.id as Role)}
                className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${
                  role === tab.id
                    ? "bg-white text-black shadow-lg scale-105"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Role Glow */}
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                role === "student"
                  ? "from-cyan-500 to-blue-500"
                  : role === "institute"
                  ? "from-purple-500 to-pink-500"
                  : role === "employer"
                  ? "from-emerald-500 to-green-500"
                  : "from-red-500 to-orange-500"
              }`}
            />

            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    {role === "institute" ? "Institute Name" : "Full Name"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      name="name"
                      type="text"
                      onChange={handleChange}
                      value={formData.name}
                      placeholder={
                        role === "institute"
                          ? "Stanford University"
                          : "John Doe"
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-white/30 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Employer Only: Company Name */}
                {role === "employer" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                      Company
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        name="companyName"
                        type="text"
                        onChange={handleChange}
                        value={formData.companyName}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-white/30 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      name="email"
                      type="email"
                      onChange={handleChange}
                      value={formData.email}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-white/30 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Wallet Address - Locked in Prod */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 flex items-center justify-between">
                    <span>Wallet Address</span>
                    {IS_PRODUCTION && formData.walletAddress && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                        AUTO-FILLED
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Wallet
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        IS_PRODUCTION ? "text-emerald-500" : "text-zinc-500"
                      }`}
                    />
                    <input
                      name="walletAddress"
                      type="text"
                      onChange={handleChange}
                      value={formData.walletAddress}
                      readOnly={IS_PRODUCTION}
                      placeholder="0x..."
                      className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-4 text-white font-mono text-sm transition-all ${
                        IS_PRODUCTION
                          ? "border-emerald-500/30 text-emerald-300 cursor-not-allowed bg-emerald-900/10"
                          : "border-white/10 focus:border-white/30 focus:outline-none"
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      name="password"
                      type="password"
                      onChange={handleChange}
                      value={formData.password}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-white/30 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6 ${
                  role === "student"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600"
                    : role === "institute"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : role === "employer"
                    ? "bg-gradient-to-r from-emerald-600 to-green-600"
                    : "bg-gradient-to-r from-red-600 to-orange-600"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-8 text-zinc-500 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white font-semibold hover:underline underline-offset-4"
            >
              Log in instead
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}

// Suspense Wrapper for useSearchParams
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]" />}>
      <RegisterContent />
    </Suspense>
  );
}
