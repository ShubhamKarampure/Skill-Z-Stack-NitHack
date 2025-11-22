"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DecryptedText from "@/components/ui/DecryptedText";
import WordPullUp from "@/components/ui/WordPullUp";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-40">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white backdrop-blur-xl">
            <span className="mr-2 flex h-2 w-2 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            The Future of&nbsp;<DecryptedText text="Academic Verification" speed={60} />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-white">
            Your Achievements, <br />
            <WordPullUp text="Verifiable Forever." className="text-gradient" delayMultiple={0.08} />
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            SkillsPassport uses Blockchain and Zero-Knowledge Proofs to give students ownership of their credentials and institutes a fraud-proof verification system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/student" className="group relative px-8 py-4 rounded-full bg-white text-black font-semibold transition-all hover:bg-gray-200">
              For Students
              <span className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></span>
            </Link>
            <Link href="/institute" className="px-8 py-4 rounded-full bg-black border border-white/20 text-white font-semibold transition-all hover:bg-white/10 hover:border-white/40">
              For Institutes
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
