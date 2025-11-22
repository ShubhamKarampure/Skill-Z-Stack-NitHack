"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

export default function Navbar() {
  const navItems = [
    { name: "Student", href: "/student" },
    { name: "Institute", href: "/institute" },
    { name: "Governance", href: "/governance" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-panel rounded-full px-6 py-3 border border-white/10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              SkillsPassport
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
