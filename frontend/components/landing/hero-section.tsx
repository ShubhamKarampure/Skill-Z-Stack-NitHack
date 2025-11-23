"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { GraduationCap, Database, Globe, Users, ArrowRight } from "lucide-react"
import { SmartDiplomaCard } from "./smart-diploma-card"

export const HeroSection = () => {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300 tracking-wide">NITSHACKS 8.0</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 animate-gradient-x">
              Academic Trust
            </span>
          </h1>

          <p className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Issue tamper-proof degrees using Blockchain & Privacy-Preserving technology. Empower students to own their
            achievements and eliminate fake credentials forever.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Issue Credential <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 font-medium transition-colors backdrop-blur-sm">
              Verify a Student
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-xs text-zinc-500 mb-4 uppercase tracking-widest text-center lg:text-left">Powered By</p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-zinc-400 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Database className="w-4 h-4" /> MongoDB
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <Globe className="w-4 h-4" /> Next.js
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4" /> IPFS
              </span>
              <span className="flex items-center gap-2 text-sm font-bold">Ξ Ethereum</span>
            </div>
          </div>
        </motion.div>

        <div className="h-96 flex items-center justify-center relative perspective-1000">
          <SmartDiplomaCard />
        </div>
      </div>
    </section>
  )
}
