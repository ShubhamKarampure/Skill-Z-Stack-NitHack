"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Zap, Globe, Users, Award } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import MagicBento, { BentoCard } from "@/components/ui/MagicBento";

export default function Features() {
  return (
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
  );
}
