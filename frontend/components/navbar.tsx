"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Wallet, LogOut, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { LogoCrest } from "./logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WALLET_PRIVATE_KEYS } from "@/lib/wallet-constants";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const router = useRouter();

  // Wallet Modal State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletAddressInput, setWalletAddressInput] = useState("");
  const [privateKeyInput, setPrivateKeyInput] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSaveWallet = () => {
    if (!walletAddressInput) return;

    // 1. Update User Store
    updateUser({ walletAddress: walletAddressInput });

    // 2. Save Private Key to LocalStorage (if provided)
    if (privateKeyInput) {
      localStorage.setItem(
        `MANUAL_PRIVATE_KEY_${walletAddressInput.toLowerCase()}`,
        privateKeyInput
      );
    }

    setIsWalletModalOpen(false);
    setWalletAddressInput("");
    setPrivateKeyInput("");
  };

  // --- DYNAMIC LINK GENERATION ---
  let currentLinks: { label: string; href: string }[] = [];

  if (isAuthenticated && user?.role) {
    if (user.role === "institute") {
      // 1. Base link (Always visible)
      currentLinks = [{ label: "Dashboard", href: "/institute/dashboard" }];

      // 2. Conditional Links (Only if Accredited)
      if (user.instituteData?.isAccredited) {
        currentLinks.push(
          { label: "Issue Credentials", href: "/institute/issue" },
          { label: "Issued", href: "/institute/issued" },
          { label: "Admissions", href: "/institute/admissions" },
          { label: "Library", href: "/institute/credentials" }
        );
      }
    } else {
      // Standard links for other roles
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
        employer: [{ label: "Search", href: "/employer" }],
      };
      currentLinks = otherRoles[user.role] || [];
    }
  }

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
          {isAuthenticated ? (
            <>
              <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-colors"
                    onClick={() => {
                        setWalletAddressInput(user?.walletAddress || "");
                        setPrivateKeyInput("");
                    }}
                  >
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span>
                      {user?.walletAddress
                        ? `${user.walletAddress.slice(0, 6)}...`
                        : "Connect Wallet"}
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Connect Wallet</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Enter your wallet details manually for this session.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="wallet-address">Wallet Address</Label>
                      <Input
                        id="wallet-address"
                        placeholder="0x..."
                        value={walletAddressInput}
                        onChange={(e) => setWalletAddressInput(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 font-mono"
                      />
                      {Object.entries(WALLET_PRIVATE_KEYS).find(
                        ([address]) =>
                          address.toLowerCase() === walletAddressInput.toLowerCase()
                      )?.[1] && (
                        <div className="mt-2 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-xs flex flex-col gap-2">
                          <p className="text-red-400 font-bold">
                            Do <span className="underline">NOT</span> share your private key with anyone. Anyone with this key can control your wallet.
                          </p>
                          <div className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                            <code className="flex-1 font-mono text-emerald-400 truncate">
                              {
                                Object.entries(WALLET_PRIVATE_KEYS).find(
                                  ([address]) =>
                                    address.toLowerCase() ===
                                    walletAddressInput.toLowerCase()
                                )?.[1]
                              }
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-zinc-400 hover:text-white"
                              onClick={() =>
                                setPrivateKeyInput(
                                  Object.entries(WALLET_PRIVATE_KEYS).find(
                                    ([address]) =>
                                      address.toLowerCase() ===
                                      walletAddressInput.toLowerCase()
                                  )?.[1] || ""
                                )
                              }
                            >
                              Use
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="private-key">Private Key</Label>
                      <Input
                        id="private-key"
                        type="password"
                        placeholder="0x..."
                        value={privateKeyInput}
                        onChange={(e) => setPrivateKeyInput(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 font-mono"
                      />
                      <p className="text-xs text-zinc-500">
                        Required for signing transactions (e.g., issuing/revoking). Stored locally.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsWalletModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveWallet} className="bg-emerald-600 hover:bg-emerald-700">
                      Save & Connect
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
