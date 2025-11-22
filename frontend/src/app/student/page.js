"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, FileCheck, Key, Upload, Download, Search } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import DecryptedText from "@/components/ui/DecryptedText";
import WordPullUp from "@/components/ui/WordPullUp";
import BlurFade from "@/components/ui/BlurFade";

export default function StudentPage() {
  const features = [
    {
      icon: Award,
      title: "Mint Your Credentials",
      description: "Transform your academic achievements into permanent, verifiable NFT credentials on the blockchain.",
      status: "Coming Soon"
    },
    {
      icon: Key,
      title: "Own Your Data",
      description: "Complete control over your academic records. Share selectively with employers and institutions.",
      status: "Coming Soon"
    },
    {
      icon: FileCheck,
      title: "Instant Verification",
      description: "Employers can verify your credentials instantly without contacting your university.",
      status: "Coming Soon"
    },
    {
      icon: Download,
      title: "Export Credentials",
      description: "Download and share your verified credentials anywhere, anytime.",
      status: "Coming Soon"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Link your Web3 wallet to securely manage your academic credentials."
    },
    {
      number: "02",
      title: "Receive Credentials",
      description: "Your institute mints NFT credentials directly to your wallet address."
    },
    {
      number: "03",
      title: "Share & Verify",
      description: "Generate ZK proofs to share credentials without revealing private data."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size:24px_24px"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BlurFade delay={0.1}>
              <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-xl">
                <GraduationCap className="w-4 h-4 mr-2" />
                <DecryptedText text="Student Portal" speed={50} />
              </div>
            </BlurFade>

            <WordPullUp
              text="Your Academic Credentials, Secured Forever"
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
              delayMultiple={0.08}
            />

            <BlurFade delay={0.3}>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Take control of your academic achievements with blockchain-verified credentials.
                Share your qualifications securely with employers while maintaining complete privacy.
              </p>
            </BlurFade>

            <BlurFade delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative px-8 py-4 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold transition-all hover:from-cyan-400 hover:to-blue-400 glow-cyan">
                  Connect Wallet
                  <span className="absolute inset-0 rounded-full ring-2 ring-cyan-400/20 group-hover:ring-cyan-400/40 transition-all"></span>
                </button>
                <button className="px-8 py-4 rounded-full border border-cyan-500/30 text-white font-semibold transition-all hover:bg-cyan-500/10 hover:border-cyan-400/50">
                  View Demo
                </button>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <SplitText text="What You Can Do" className="text-white" />
            </h2>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl glass-panel-cyan hover:bg-cyan-500/5 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <feature.icon className="w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-400">
                    {feature.status}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How It Works
            </h2>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-8xl font-bold text-white/5 absolute -top-8 -left-4">
                  {step.number}
                </div>
                <div className="relative glass-panel p-8 rounded-2xl h-full">
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BlurFade delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Connect your wallet to begin managing your academic credentials on the blockchain.
            </p>
            <button className="px-10 py-4 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg hover:from-cyan-400 hover:to-blue-400 transition-all glow-cyan">
              Launch Portal
            </button>
          </BlurFade>
        </div>
      </section>
    </div>
  );
}
