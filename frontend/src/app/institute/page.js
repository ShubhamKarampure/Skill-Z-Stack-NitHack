"use client";

import { motion } from "framer-motion";
import { Building2, Users, Shield, FileSignature, CheckCircle2, Database } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import DecryptedText from "@/components/ui/DecryptedText";
import WordPullUp from "@/components/ui/WordPullUp";
import BlurFade from "@/components/ui/BlurFade";

export default function InstitutePage() {
  const features = [
    {
      icon: FileSignature,
      title: "Issue NFT Credentials",
      description: "Mint tamper-proof academic credentials as NFTs directly to your students' wallets.",
      status: "Coming Soon"
    },
    {
      icon: Shield,
      title: "Zero-Knowledge Proofs",
      description: "Enable students to prove qualifications without revealing sensitive personal information.",
      status: "Coming Soon"
    },
    {
      icon: CheckCircle2,
      title: "Instant Verification",
      description: "Verify credentials from other institutes in seconds, not days or weeks.",
      status: "Coming Soon"
    },
    {
      icon: Database,
      title: "Decentralized Registry",
      description: "Your credentials are stored on-chain, accessible forever without central servers.",
      status: "Coming Soon"
    }
  ];

  const benefits = [
    {
      title: "Eliminate Fraud",
      description: "Blockchain technology makes credential forgery mathematically impossible.",
      metric: "100%",
      label: "Fraud Prevention"
    },
    {
      title: "Reduce Costs",
      description: "Automated verification cuts administrative overhead dramatically.",
      metric: "80%",
      label: "Cost Reduction"
    },
    {
      title: "Instant Processing",
      description: "Issue and verify credentials in seconds, not weeks.",
      metric: "99%",
      label: "Faster Processing"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Register Institute",
      description: "Apply to join the network through our DAO governance process."
    },
    {
      number: "02",
      title: "Get Verified",
      description: "Existing members vote to verify your institution's credentials."
    },
    {
      number: "03",
      title: "Start Issuing",
      description: "Begin minting and issuing blockchain credentials to your students."
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
                <Building2 className="w-4 h-4 mr-2" />
                <DecryptedText text="Institute Portal" speed={50} />
              </div>
            </BlurFade>

            <WordPullUp
              text="Issue Credentials That Last Forever"
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
              delayMultiple={0.08}
            />

            <BlurFade delay={0.3}>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Join the future of academic verification. Issue blockchain-based credentials 
                that your students own forever and employers can verify instantly.
              </p>
            </BlurFade>

            <BlurFade delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative px-8 py-4 rounded-full bg-linear-to-r from-purple-500 to-fuchsia-500 text-white font-semibold transition-all hover:from-purple-400 hover:to-fuchsia-400 glow-purple">
                  Register Institute
                  <span className="absolute inset-0 rounded-full ring-2 ring-purple-400/20 group-hover:ring-purple-400/40 transition-all"></span>
                </button>
                <button className="px-8 py-4 rounded-full border border-purple-500/30 text-white font-semibold transition-all hover:bg-purple-500/10 hover:border-purple-400/50">
                  Schedule Demo
                </button>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl glass-panel-purple"
              >
                <div className="text-6xl font-bold text-gradient-purple mb-4">{benefit.metric}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-4">{benefit.label}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <SplitText text="Platform Features" className="text-white" />
            </h2>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl glass-panel-purple hover:bg-purple-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <feature.icon className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform" />
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

      {/* How to Join */}
      <section className="py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How to Join the Network
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
              Join the Future of Education
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Be part of the decentralized academic verification network. Register your institution today.
            </p>
            <button className="px-10 py-4 rounded-full bg-linear-to-r from-purple-500 to-fuchsia-500 text-white font-semibold text-lg hover:from-purple-400 hover:to-fuchsia-400 transition-all glow-purple">
              Apply Now
            </button>
          </BlurFade>
        </div>
      </section>
    </div>
  );
}
