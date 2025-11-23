"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px]" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[120px]" />
  </div>
);

type Role = "student" | "institute" | "employer" | "admin";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [role, setRole] = useState<Role>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Define form state explicitly
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
    companyName: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Create payload with specific type structure
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      walletAddress: formData.walletAddress,
      ...(role === "employer" && { companyName: formData.companyName }),
    };

    const response = await authService.register(payload);

    if (response.success && response.token && response.user) {
      // Update Global State
      login(response.user, response.token);

      const redirectMap: Record<Role, string> = {
        student: "/student/dashboard",
        institute: "/institute/dashboard",
        employer: "/employer/dashboard",
        admin: "/admin/dashboard",
      };

      router.push(redirectMap[role]);
    } else {
      setError(response.message || "Registration failed");
      setIsLoading(false);
    }
  };

  // Type-safe change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 font-sans text-white">
      <Aurora />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg pt-20"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Join{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500">
              Skill-Z
            </span>
          </h1>
          <p className="text-zinc-400">
            Select your role to initialize your account.
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
          {/* Role Glow Indicator */}
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
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                  {role === "institute"
                    ? "Institute Name"
                    : role === "employer"
                    ? "HR Rep Name"
                    : "Full Name"}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    name="name"
                    type="text"
                    onChange={handleChange}
                    value={formData.name}
                    placeholder={
                      role === "institute" ? "Stanford University" : "John Doe"
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
                    required
                  />
                </div>
              </div>

              {role === "employer" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      name="companyName"
                      type="text"
                      onChange={handleChange}
                      value={formData.companyName}
                      placeholder="Google Inc."
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    name="email"
                    type="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder={
                      role === "institute"
                        ? "admin@stanford.edu"
                        : "john@example.com"
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                  Wallet Address
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    name="walletAddress"
                    type="text"
                    onChange={handleChange}
                    value={formData.walletAddress}
                    placeholder="0x..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all font-mono text-sm"
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
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
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
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/25"
                  : role === "institute"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/25"
                  : role === "employer"
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-emerald-500/25"
                  : "bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-red-500/25"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
                </>
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
  );
}
