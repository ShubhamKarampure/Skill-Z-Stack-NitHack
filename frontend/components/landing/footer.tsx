"use client"

import { Github, Twitter } from "lucide-react"
import { LogoCrest } from "@/components/logo"

export const LandingFooter = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-zinc-950">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LogoCrest className="w-4 h-4 group-hover:scale-105 transition-transform" />
            <p className="text-xs text-zinc-500">Decentralized & Privacy-Preserving Skill Passport</p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">
            Team
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Protocol
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Governance
          </a>
        </div>

        <div className="flex gap-4">
          <Github className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
          <Twitter className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  )
}
