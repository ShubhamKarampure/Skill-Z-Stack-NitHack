"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
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
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LogoCrest } from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hooks
  const { user, isAuthenticated, logout } = useAuthStore();
  const { disconnect, address } = useWallet();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // 1. Clear Auth Store
    logout();

    // 2. Clear Wallet State
    if (disconnect) disconnect();

    // 3. UI Feedback
    toast({
      title: "Logged Out",
      description: "You have been successfully signed out.",
    });

    // 4. Redirect
    router.push("/login");
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper: Get Role Icon & Label Colors
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

  // Dynamic Link Generation
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
  const displayAddress = user?.walletAddress || address;

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

                <div className="px-2 pb-2 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <Wallet className="w-3 h-3" />
                    <span>Connected Wallet</span>
                  </div>
                  {displayAddress ? (
                    <div className="bg-black/40 border border-zinc-800 rounded p-2 flex items-center justify-between gap-2 group/copy transition-colors hover:border-zinc-700">
                      <code className="text-xs font-mono text-emerald-400 truncate">
                        {displayAddress.slice(0, 10)}...
                        {displayAddress.slice(-6)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(displayAddress)}
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

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-3 rounded-xl bg-white/5 text-white border border-white/10"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-4 right-4 bg-[#18181b] border border-white/10 rounded-2xl p-6 shadow-2xl z-40"
          >
            <div className="flex flex-col gap-4">
              {currentLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-zinc-400 hover:text-white py-2 border-b border-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 mt-4">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div
                        className={`p-2 rounded-md border ${roleStyle?.color}`}
                      >
                        {roleStyle?.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold">
                          {user.name}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 text-center text-red-400 font-bold bg-red-900/10 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  // Fallback for weird state where user is not auth but on dashboard page
                  <Link
                    href="/login"
                    className="w-full py-3 text-center bg-white text-black font-bold rounded-xl"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
