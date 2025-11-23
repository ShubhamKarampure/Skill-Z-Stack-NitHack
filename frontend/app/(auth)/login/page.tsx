"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

import { authService } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { LogoCrest } from "@/components/logo";
import { Loader } from "@/components/loader";
import { useToast } from "@/hooks/use-toast";

// --- BACKGROUND COMPONENT ---
const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
  </div>
);

// --- MAIN PAGE COMPONENT ---
const DEMO_ACCOUNTS = [
  { email: "alice.student@example.com", role: "Student" },
  { email: "idfc@example.com", role: "Employer" },
  { email: "nits@example.com", role: "Admin" },
  { email: "spit@example.com", role: "Institute" },
];

const DEMO_PASSWORD = "Password123";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Kept for inline alert fallback, optional

  // New state for handling the full-screen loader
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);
  const [targetPath, setTargetPath] = useState("/");

  const handleSelectDemo = (demoEmail: string) => {
    const selected = DEMO_ACCOUNTS.find((acc) => acc.email === demoEmail);

    setEmail(demoEmail);

    if (selected?.role.toLowerCase() === "student") {
      setPassword("111111");
    } else {
      setPassword(DEMO_PASSWORD);
    }

    toast({
      title: "Demo Account Selected",
      description: `Loaded credentials for ${selected?.role}`,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const finalPassword = password || DEMO_PASSWORD;

    try {
      const response = await authService.login({
        email,
        password: finalPassword,
      });

      if (response.success && response.token && response.user) {
        login(response.user, response.token);

        const role = response.user.role;
        const redirectMap: Record<string, string> = {
          student: "/student/dashboard",
          institute: "/institute/dashboard",
          employer: "/employer/dashboard",
          admin: "/admin/dashboard",
        };

        const path = redirectMap[role] || "/";
        setShowSuccessLoader(true);
        
        setTargetPath(path);

        toast({
          title: "Login Successful",
          description: "Initializing your dashboard environment...",
          className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
        });

        // Trigger the full screen loader
      } else {
        const msg = response.message || "Invalid email or password";
        setError(msg);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: msg,
        });
        setIsLoading(false);
      }
    } catch (err) {
      const msg = "An unexpected error occurred. Please try again.";
      setError(msg);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: msg,
      });
      setIsLoading(false);
    }
  };

  // Called when the Loader finishes its animation
  const handleLoaderComplete = () => {
    router.push(targetPath);
  };

  return (
    <>
      {/* Conditionally render the Loader on top of everything */}
      <AnimatePresence>
        {showSuccessLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <Loader onComplete={handleLoaderComplete} />
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
              Login to access your decentralized portfolio.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Optional: Keep inline error for immediate visual feedback near form */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                  Quick Demo Login
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => handleSelectDemo(account.email)}
                      className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 text-zinc-300 transition-all"
                    >
                      {account.role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

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
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
