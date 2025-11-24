"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Wallet,
  ShieldCheck,
} from "lucide-react";

import { authService } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { LogoCrest } from "@/components/logo";
import { Loader } from "@/components/loader";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";

// --- CONFIGURATION ---
// Change this to 'true' manually if you want to test Web3 Mode locally
const IS_PRODUCTION = process.env.NEXT_PUBLIC_NODE_ENV === "production";

// --- BACKGROUND COMPONENT ---
const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
  </div>
);

// --- DEMO DATA (Only for Dev Mode) ---
const DEMO_ACCOUNTS = [
  { email: "student1@demo.com", role: "Student" },
  { email: "institute1@demo.com", role: "Institute" },
  { email: "employer1@demo.com", role: "Employer" },
  { email: "admin1@gmail.com", role: "Admin" },
];
const DEMO_PASSWORD = "password";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);
  const { connectWallet, isConnecting } = useWallet();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);
  const [targetPath, setTargetPath] = useState("/");

  // --- HANDLER: WEB3 LOGIN (Production) ---
  const handleWeb3Login = async () => {
    setError("");
    setIsLoading(true);

    try {
      // 1. Connect MetaMask
      const address = await connectWallet();

      if (!address) {
        setIsLoading(false);
        return;
      }

      // 2. Backend Login
      // Note: Ensure your authService has a loginWithWallet method!
      // If not, you can temporarily use standard login logic here
      const response = await authService.loginWithWallet(address);

      if (response.success && response.user) {
        handleSuccess(response.user, response.token);
      } else {
        // User not found -> Send to Register
        toast({
          title: "Wallet Not Registered",
          description: "Redirecting you to create an account...",
        });
        router.push(`/register?address=${address}`);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try connecting again.");
      setIsLoading(false);
    }
  };

  // --- HANDLER: STANDARD LOGIN (Dev) ---
  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({
        email,
        password: password || DEMO_PASSWORD,
      });

      if (response.success && response.token && response.user) {
        handleSuccess(response.user, response.token);
      } else {
        setError(response.message || "Invalid credentials");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Connection failed. Please try again.");
      setIsLoading(false);
    }
  };

  // --- SHARED SUCCESS LOGIC ---
  const handleSuccess = (user: any, token: string) => {
    login(user, token);

    const redirectMap: Record<string, string> = {
      student: "/student/dashboard",
      institute: "/institute/dashboard",
      employer: "/employer/dashboard",
      admin: "/admin/dashboard",
    };

    setTargetPath(redirectMap[user.role] || "/");
    setShowSuccessLoader(true);
  };

  const handleDemoClick = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
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

      <div className="min-h-screen flex items-center justify-center px-4 font-sans text-white">
        <Aurora />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 group"
            >
              <LogoCrest className="w-16 h-16 group-hover:scale-105 transition-transform" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-zinc-400">
              {IS_PRODUCTION
                ? "Connect your wallet to verify identity."
                : "Login to access your decentralized portfolio."}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* --- MODE SWITCHER --- */}
            {IS_PRODUCTION ? (
              // 🦊 PRODUCTION MODE: WALLET LOGIN
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-b from-blue-500/10 to-purple-500/5 border border-blue-500/20 rounded-xl text-center">
                  <ShieldCheck className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Secure Web3 Login
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    Authenticate using your blockchain wallet. No password
                    required.
                  </p>

                  <button
                    onClick={handleWeb3Login}
                    disabled={isConnecting || isLoading}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold shadow-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-3"
                  >
                    {isConnecting || isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Connect MetaMask
                      </>
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500">
                    By connecting, you agree to our Terms of Service.
                  </p>
                </div>
              </div>
            ) : (
              // 💻 DEV MODE: STANDARD LOGIN
              <form onSubmit={handleStandardLogin} className="space-y-5">
                {/* Dev Mode Indicator */}
                <div className="absolute top-0 right-0 px-3 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold rounded-bl-xl border-l border-b border-yellow-500/20">
                  DEV MODE
                </div>

                {/* Demo Buttons */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    Quick Demo Login
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_ACCOUNTS.map((account) => (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => handleDemoClick(account.email)}
                        className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 text-zinc-300 transition-all"
                      >
                        {account.role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Login <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center mt-8 text-zinc-500 text-sm">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-white font-semibold hover:underline underline-offset-4 decoration-blue-500"
            >
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
