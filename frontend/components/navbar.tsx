"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  Wallet,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Copy,
  Check,
  Mail,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { LogoCrest } from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- HELPER: Get Role Icon & Label Colors ---
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "student":
        return {
          icon: <GraduationCap className="w-3 h-3" />,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        };
      case "institute":
        return {
          icon: <Building2 className="w-3 h-3" />,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        };
      case "employer":
        return {
          icon: <Briefcase className="w-3 h-3" />,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        };
      case "admin":
        return {
          icon: <ShieldCheck className="w-3 h-3" />,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
        };
      default:
        return {
          icon: <UserIcon className="w-3 h-3" />,
          color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
        };
    }
  };

  // --- DYNAMIC LINK GENERATION ---
  let currentLinks: { label: string; href: string }[] = [];

  if (isAuthenticated && user?.role) {
    if (user.role === "institute") {
      currentLinks = [{ label: "Dashboard", href: "/institute/dashboard" }];
      if (user.instituteData?.isAccredited) {
        currentLinks.push(
          { label: "Issue Credentials", href: "/institute/issue" },
          { label: "Issued", href: "/institute/issued" },
          { label: "Admissions", href: "/institute/admissions" },
          { label: "Library", href: "/institute/credentials" }
        );
      }
    } else {
      const otherRoles: Record<string, { label: string; href: string }[]> = {
        student: [
          { label: "Dashboard", href: "/student/dashboard" },
          { label: "My Institutes", href: "/student/institutes" },
          { label: "Inventory", href: "/student/inventory" },
        ],
        admin: [
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Manage Institutes", href: "/admin/institutes" },
        ],
        employer: [{ label: "Dashboard", href: "/employer/dashboard" }],
      };
      currentLinks = otherRoles[user.role] || [];
    }
  }

  const roleStyle = user ? getRoleBadge(user.role) : null;

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
          <LogoCrest className="w-10 h-10 group-hover:scale-105 transition-transform" />
          <span className="font-bold text-2xl tracking-tight text-white">
            Skill-Z
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
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      roleStyle?.color
                        .replace("text-", "border-")
                        .split(" ")[2] || "border-zinc-700"
                    } bg-black/20`}
                  >
                    {roleStyle?.icon}
                  </div>
                  <div className="flex flex-col items-start text-xs">
                    <span className="font-semibold text-white max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <span className="opacity-60 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors ml-1" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-72 bg-[#09090b] border-zinc-800 text-zinc-200 mt-2 p-2"
                align="end"
              >
                <div className="flex items-start gap-3 p-2">
                  {/* Role Icon Large */}
                  <div className={`p-2 rounded-md border ${roleStyle?.color}`}>
                    {roleStyle?.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="font-semibold text-white truncate">
                      {user.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[180px]">
                        {user.email}
                      </span>
                    </div>

                    {/* Conditional Details based on Role */}
                    {user.role === "employer" && user.companyName && (
                      <span className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {user.companyName}
                      </span>
                    )}
                    {user.role === "institute" &&
                      user.instituteData?.isAccredited && (
                        <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 w-fit">
                          <BadgeCheck className="w-3 h-3" /> Accredited
                        </span>
                      )}
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-zinc-800 my-2" />

                {/* Wallet Address Section */}
                <div className="px-2 pb-2 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <Wallet className="w-3 h-3" />
                    <span>Connected Wallet</span>
                  </div>
                  {user.walletAddress ? (
                    <div className="bg-black/40 border border-zinc-800 rounded p-2 flex items-center justify-between gap-2 group/copy transition-colors hover:border-zinc-700">
                      <code className="text-xs font-mono text-emerald-400 truncate">
                        {user.walletAddress.slice(0, 10)}...
                        {user.walletAddress.slice(-6)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(user.walletAddress!)}
                        className="hover:bg-zinc-800 p-1.5 rounded-md transition-colors"
                        title="Copy address"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover/copy:text-zinc-300" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500 italic px-2 py-1 bg-zinc-900/50 rounded border border-zinc-800/50">
                      No wallet connected
                    </div>
                  )}
                </div>

                <DropdownMenuSeparator className="bg-zinc-800 my-1" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer m-1 rounded-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 text-sm font-bold text-zinc-300 bg-white/5 rounded-full hover:bg-white/10 border border-white/10 transition-all"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle would go here */}
      </div>
    </motion.nav>
  );
}
