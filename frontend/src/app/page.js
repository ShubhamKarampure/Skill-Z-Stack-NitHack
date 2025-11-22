"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Zap, Globe } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import DecryptedText from "@/components/ui/DecryptedText";

export default function Home() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Tamper-Proof Credentials",
      description: "Academic records are secured on the blockchain, making them impossible to forge or alter."
    },
    {
      icon: Lock,
      title: "Privacy Preserved",
      description: "Zero-Knowledge Proofs allow verification without revealing sensitive personal data."
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description: "Employers and institutes can verify credentials in seconds, not weeks."
    },
    {
      icon: Globe,
      title: "Global Recognition",
      description: "A decentralized standard accepted worldwide by accredited institutions."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
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
              <SplitText text="Verifiable Forever." className="text-gradient" delay={0.1} />
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

      {/* Features Grid */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl glass-panel hover:bg-white/10 transition-colors"
              >
                <feature.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why SkillsPassport?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <span className="text-red-400 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Eliminate Fake Degrees</h3>
                    <p className="text-gray-400">Traditional paper degrees are easily forged. Our NFT-based credentials are cryptographically secured by the issuer.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <span className="text-red-400 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Decentralized Trust</h3>
                    <p className="text-gray-400">No central authority controls your data. A DAO of accredited institutes governs the network.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden glass-panel flex items-center justify-center">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20"></div>
              <div className="text-center p-8">
                <div className="text-6xl font-bold text-white mb-2">100%</div>
                <div className="text-xl text-gray-300">Tamper Proof</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
