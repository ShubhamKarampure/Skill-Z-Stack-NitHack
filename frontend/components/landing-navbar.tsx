"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoCrest } from "./logo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Features", href: "/#features" },
    { label: "Protocol", href: "/#how-it-works" },
    { label: "Governance", href: "/governance" },
    { label: "Ecosystem", href: "/ecosystem" },
  ];

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
            <LogoCrest className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <span className="font-bold text-2xl tracking-tight text-white">
              Skill-Z
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-zinc-400 hover:text-white hover:scale-105 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
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
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
