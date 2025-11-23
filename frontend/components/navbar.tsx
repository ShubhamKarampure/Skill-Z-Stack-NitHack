"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogIn,
  ChevronRight,
  Wallet,
  LogOut,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/app/lib/store";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  // --- SCROLL EFFECT ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // --- NAVIGATION CONFIG ---
  const publicLinks = [
    { label: "Features", href: "/#features" },
    { label: "Protocol", href: "/#how-it-works" },
    { label: "Governance", href: "/governance" },
  ];

  const roleLinks: Record<string, { label: string; href: string }[]> = {
    student: [
      { label: "Dashboard", href: "/student/dashboard" },
      { label: "Inventory", href: "/student/inventory" },
    ],
    institute: [
      { label: "Dashboard", href: "/institute/dashboard" },
      { label: "Students", href: "/institute/students" }, // Placeholder path
    ],
    admin: [
      { label: "Proposals", href: "/admin/dashboard" },
      { label: "Members", href: "/admin/members" },
    ],
    employer: [
      { label: "Dashboard", href: "/employer/dashboard" },
      { label: "Search", href: "/employer/search" }, // Placeholder path
    ],
  };

  // Determine which links to show
  const currentLinks =
    isAuthenticated && user?.role ? roleLinks[user.role] : publicLinks;

  return (
    <>
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-bold text-xl text-white">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Skill-Z{" "}
              <span className="text-xs font-normal text-zinc-400 ml-2 border border-white/10 px-2 py-0.5 rounded-full uppercase">
                {isAuthenticated ? user?.role : "Protocol"}
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>
                    {user?.walletAddress
                      ? `${user.walletAddress.slice(
                          0,
                          6
                        )}...${user.walletAddress.slice(-4)}`
                      : "No Wallet"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-3 text-sm font-bold text-zinc-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="group relative px-7 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started{" "}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 rounded-xl bg-white/5 text-white border border-white/10"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-24 left-4 right-4 bg-[#18181b] border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                {currentLinks?.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium text-zinc-400 hover:text-white py-3 border-b border-white/5 px-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="flex flex-col gap-3 mt-6">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full py-3 text-center text-red-400 font-bold bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                      Log Out
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 text-center text-white font-bold bg-white/10 rounded-xl"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 text-center bg-white text-black font-bold rounded-xl"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
