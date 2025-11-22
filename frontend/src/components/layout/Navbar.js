"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wallet, GraduationCap, Building2, Vote } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Student", href: "/student", icon: GraduationCap },
    { name: "Institute", href: "/institute", icon: Building2 },
    { name: "Governance", href: "/governance", icon: Vote },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-white">
                SkillsPassport
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
              <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-panel"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
            <button className="w-full mt-4 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
