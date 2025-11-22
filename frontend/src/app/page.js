"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Zap, Globe, Users, Award } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import DecryptedText from "@/components/ui/DecryptedText";
import WordPullUp from "@/components/ui/WordPullUp";
import MagicBento, { BentoCard } from "@/components/ui/MagicBento";
import LightRays from "@/components/ui/LightRays";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white selection:bg-cyan-500/30">
      {/* Light Rays Background */}
      <div className="absolute inset-0 w-full h-full">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.5}
          lightSpread={1.5}
          rayLength={3.5}
          followMouse={false}
          mouseInfluence={0.2}
          noiseAmount={0.2}
          distortion={0.1}
          saturation={2.0}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
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

      {/* Features Bento Grid */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <SplitText text="Platform Features" className="text-white" />
            </h2>
            <p className="text-gray-400 text-lg">Everything you need for secure credential management</p>
          </motion.div>

          <MagicBento>
            {/* Large Feature - Tamper Proof */}
            <BentoCard 
              className="col-span-1 md:col-span-3 row-span-2 flex flex-col justify-between min-h-[400px] bg-linear-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20"
            >
              <div>
                <ShieldCheck className="w-16 h-16 text-cyan-400 mb-6" />
                <h3 className="text-3xl font-bold mb-4">Tamper-Proof Credentials</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Academic records are secured on the blockchain, making them impossible to forge or alter. 
                  Each credential is cryptographically signed and permanently stored.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-cyan-400">100%</div>
                  <div className="text-sm text-gray-400">Fraud Prevention Rate</div>
                </div>
              </div>
            </BentoCard>

            {/* Privacy */}
            <BentoCard 
              className="col-span-1 md:col-span-3 flex flex-col min-h-[190px]"
            >
              <Lock className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacy Preserved</h3>
              <p className="text-gray-400 text-sm">
                Zero-Knowledge Proofs allow verification without revealing sensitive personal data.
              </p>
            </BentoCard>

            {/* Instant Verification */}
            <BentoCard 
              className="col-span-1 md:col-span-3 flex flex-col min-h-[190px]"
            >
              <Zap className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
              <p className="text-gray-400 text-sm">
                Employers and institutes can verify credentials in seconds, not weeks.
              </p>
            </BentoCard>

            {/* Network Stats */}
            <BentoCard 
              className="col-span-1 md:col-span-2 flex flex-col justify-center items-center text-center min-h-[200px] bg-linear-to-br from-purple-500/10 to-fuchsia-500/10 border-purple-500/20"
            >
              <Users className="w-12 h-12 text-purple-400 mb-4" />
              <div className="text-4xl font-bold text-gradient-purple mb-2">247+</div>
              <p className="text-gray-400 text-sm">Verified Institutes</p>
            </BentoCard>

            {/* Global Recognition */}
            <BentoCard 
              className="col-span-1 md:col-span-2 flex flex-col justify-center min-h-[200px] bg-linear-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20"
            >
              <Globe className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Recognition</h3>
              <p className="text-gray-400 text-sm">
                A decentralized standard accepted worldwide.
              </p>
            </BentoCard>

            {/* Credentials Issued */}
            <BentoCard 
              className="col-span-1 md:col-span-2 flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <Award className="w-10 h-10 text-cyan-400 mb-3" />
                <h3 className="text-lg font-bold mb-2">NFT Credentials</h3>
                <p className="text-gray-400 text-sm">
                  Each credential is a unique NFT owned by the student.
                </p>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gradient-cyan">10K+</div>
                <div className="text-xs text-gray-400 mt-1">Credentials Issued</div>
              </div>
            </BentoCard>
          </MagicBento>
        </div>
      </section>

      </div>
    </div>
  );
}
