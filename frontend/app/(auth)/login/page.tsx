"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { authService } from "@/app/lib/api";
import { useAuthStore } from "@/app/lib/store";

const Aurora = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
    </div>
);

const DEMO_EMAILS = [
    "student@demo.com",
    "employer@demo.com",
    "admin@demo.com",
    "institute@demo.com",
];
const DEMO_PASSWORD = "password";

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSelectDemo = (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword(DEMO_PASSWORD);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const finalPassword = password || DEMO_PASSWORD;

        const response = await authService.login({ email, password: finalPassword });

        if (response.success && response.token && response.user) {
            login(response.user, response.token);

            const role = response.user.role;
            const redirectMap: Record<string, string> = {
                student: "/student/dashboard",
                institute: "/institute/dashboard",
                employer: "/employer/dashboard",
                admin: "/admin/dashboard",
            };

            router.push(redirectMap[role] || "/");
        } else {
            setError(response.message || "Invalid email or password");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 font-sans text-white">
            <Aurora />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="font-bold text-xl text-white">S</span>
                        </div>
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
                                {DEMO_EMAILS.map((demoEmail) => (
                                    <button
                                        key={demoEmail}
                                        type="button"
                                        onClick={() => handleSelectDemo(demoEmail)}
                                        className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 text-zinc-300 transition-all"
                                    >
                                        {demoEmail.split("@")[0]}
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
    );
}
