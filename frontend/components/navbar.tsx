"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
// Helper function to truncate wallet address for display
const truncateAddress = (address: string) =>
  `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // State to simulate wallet connection
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Governance", href: "/governance" },
    { label: "Docs", href: "#docs" },
  ];

  // --- WALLET CONNECTION HANDLER ---
  const handleConnectWallet = () => {
    if (walletAddress) {
      // Logic for Disconnect (Simulated)
      console.log("Disconnecting Wallet...");
      setWalletAddress(null);
    } else {
      // Logic for Connect (Simulated)
      console.log("Connecting Wallet...");
      const simulatedAddress = "0x4A6b98eC3d906Aa2621bE07B576C71D62423F5F4"; // Example address
      setWalletAddress(simulatedAddress);
      // In a real app, successful connection would trigger navigation/role check.
    }
    // Close mobile menu on action
    if (isOpen) {
      setIsOpen(false);
    }
  };
  // ------------------------------------

  // Define common button text/styles
  const buttonText = walletAddress
    ? truncateAddress(walletAddress)
    : "Connect Wallet";

  const buttonClass = walletAddress
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/20" // Connected style
    : "text-black bg-white hover:bg-zinc-200 border-none"; // Disconnected style (using your primary style from landing page)

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-8 py-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">Skill-Z</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="text-lg text-zinc-400 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* CTA Button + Mobile Menu */}
          <div className="flex items-center gap-6">
            {/* Desktop Connect Wallet Button */}
            <motion.button
              onClick={handleConnectWallet}
              className={`hidden md:flex items-center gap-3 px-6 py-3 text-base font-semibold rounded-full transition-all ${buttonClass}`}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
            >
              {walletAddress && <Wallet size={20} />}
              <span>{buttonText}</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-[#09090b]/90 border-t border-white/5"
            >
              <div className="px-7 py-5 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-3 text-lg text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Connect Wallet Button */}
                <motion.button
                  onClick={handleConnectWallet}
                  className={`mt-5 flex items-center justify-center gap-3 px-6 py-4 text-lg font-semibold rounded-full transition-all w-full ${buttonClass}`}
                  whileTap={{ scale: 0.98 }}
                >
                  {walletAddress && <Wallet size={22} />}
                  <span>{buttonText}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );

}
