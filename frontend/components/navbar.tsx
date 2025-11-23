"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Wallet, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const roleLinks: Record<string, { label: string; href: string }[]> = {
    student: [
      { label: "Dashboard", href: "/student/dashboard" },
      { label: "My Institutes", href: "/student/institutes" },
    ],
    institute: [
      { label: "Overview", href: "/institute/dashboard" }, // New Analytics Hub
      { label: "Issue Credentials", href: "/institute/issue" }, // Separated Page
      { label: "Admissions", href: "/institute/admissions" },
      { label: "Library", href: "/institute/credentials" },
    ],
    admin: [
      { label: "Governance", href: "/admin/dashboard" },
      { label: "Members", href: "/admin/members" },
    ],
    employer: [{ label: "Search", href: "/employer" }],
  };

  const currentLinks =
    isAuthenticated && user?.role ? roleLinks[user.role] : [];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-[#09090b]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 py-4 px-6"
            : "bg-transparent py-6 px-4"
        } flex items-center justify-between`}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-xl text-white">S</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Skill-Z{" "}
            <span className="text-xs text-zinc-400 font-normal ml-2">
              {isAuthenticated ? user?.role : ""}
            </span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
          {currentLinks?.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>
                  {user?.walletAddress
                    ? `${user.walletAddress.slice(0, 6)}...`
                    : "No Wallet"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-500/10 text-zinc-400 hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 text-sm font-bold text-zinc-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu omitted for brevity */}
      </div>
    </motion.nav>
  );
}
