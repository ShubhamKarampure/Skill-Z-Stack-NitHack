"use client"

import { motion } from "framer-motion"
import { Cpu, School } from "lucide-react"

export const SmartDiplomaCard = () => {
  return (
    <div className="relative w-full max-w-[450px] h-80 perspective-1000">
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={{ rotateY: -15, rotateX: 5 }}
        animate={{
          rotateY: [-15, -5, -15],
          rotateX: [5, 0, 5],
          y: [0, -15, 0],
        }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl -z-10" />

        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-black/90 to-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <div className="h-full flex flex-col justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                  <School className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">University of Tech</h3>
                  <p className="text-blue-400 text-xs font-mono">OFFICIAL CREDENTIAL</p>
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400 font-bold tracking-wide">VERIFIED</span>
              </div>
            </div>

            <div className="space-y-1 pl-1">
              <p className="text-zinc-500 text-xs uppercase tracking-widest">Recipient</p>
              <h2 className="text-2xl font-semibold text-white">Alex J. Student</h2>
              <p className="text-zinc-400">Bachelor of Computer Science</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <code className="text-xs text-zinc-500 font-mono bg-black/50 px-2 py-1 rounded">0x71C...4B5f</code>
              </div>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SkillZ-Verified"
                alt="QR code for credential verification"
                className="w-10 h-10 opacity-50 mix-blend-screen grayscale"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-8 top-1/2 -translate-y-1/2 bg-zinc-800/90 backdrop-blur border border-white/10 p-3 rounded-xl shadow-xl z-20 flex items-center gap-3"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
      >
        <div className="bg-emerald-500/20 p-2 rounded-full">
          <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="pr-2">
          <p className="text-xs text-zinc-400 uppercase">Blockchain</p>
          <p className="text-sm font-bold text-white">Confirmed</p>
        </div>
      </motion.div>
    </div>
  )
}
