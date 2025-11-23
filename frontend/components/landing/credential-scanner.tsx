"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export const CredentialScanner = () => {
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "verified" | "fake">("idle")

  useEffect(() => {
    const cycle = () => {
      setScanStatus("scanning")
      setTimeout(() => {
        setScanStatus("verified")
        setTimeout(() => setScanStatus("idle"), 2500)
      }, 2000)
    }
    const interval = setInterval(cycle, 6000)
    cycle()
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden relative shadow-2xl">
      <div className="h-8 bg-zinc-900/80 flex items-center px-4 gap-2 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>

      <div className="p-8 relative min-h-60 flex flex-col gap-4 opacity-90">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800" />
          <div className="w-20 h-4 bg-zinc-800 rounded" />
        </div>
        <div className="w-1/3 h-4 bg-zinc-800 rounded" />
        <div className="w-full h-2 bg-zinc-800/50 rounded mt-2" />
        <div className="w-full h-2 bg-zinc-800/50 rounded" />
        <div className="w-3/4 h-2 bg-zinc-800/50 rounded" />

        <div className="absolute inset-0 flex items-center justify-center z-20">
          {scanStatus === "verified" && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/50 px-6 py-4 rounded-2xl flex flex-col items-center gap-2"
            >
              <div className="bg-emerald-500 text-black rounded-full p-1">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="font-bold text-emerald-400 tracking-widest text-sm">VALID MATCH</span>
            </motion.div>
          )}
        </div>
      </div>

      {scanStatus === "scanning" && (
        <motion.div
          className="absolute top-8 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] z-10"
          animate={{ top: ["10%", "90%"] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      )}

      <div className="bg-zinc-900/80 p-3 border-t border-white/10 text-center">
        <p className="text-xs font-mono text-zinc-500">
          {scanStatus === "scanning" && "SCANNING HASH..."}
          {scanStatus === "verified" && "VERIFICATION COMPLETE"}
          {scanStatus === "idle" && "READY TO SCAN"}
        </p>
      </div>
    </div>
  )
}
