"use client";

import { motion } from "framer-motion";
import { Vote, Users, Scale, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import DecryptedText from "@/components/ui/DecryptedText";
import WordPullUp from "@/components/ui/WordPullUp";
import BlurFade from "@/components/ui/BlurFade";

export default function GovernancePage() {
  const daoFeatures = [
    {
      icon: Vote,
      title: "Democratic Governance",
      description: "All verified institutes have voting rights. Major decisions require community consensus.",
      status: "Active"
    },
    {
      icon: Scale,
      title: "Fair & Transparent",
      description: "Every proposal and vote is recorded on-chain for complete transparency.",
      status: "Active"
    },
    {
      icon: Users,
      title: "Member Verification",
      description: "New institutes are verified through a decentralized voting process.",
      status: "Active"
    },
    {
      icon: TrendingUp,
      title: "Protocol Upgrades",
      description: "The community votes on network improvements and new features.",
      status: "Coming Soon"
    }
  ];

  const activeProposals = [
    {
      id: "PROP-001",
      title: "Add University of Cambridge to Network",
      description: "Proposal to verify and add University of Cambridge as a credential issuer.",
      votesFor: 142,
      votesAgainst: 8,
      status: "Active",
      timeLeft: "2 days",
      icon: CheckCircle
    },
    {
      id: "PROP-002",
      title: "Implement Multi-Signature Verification",
      description: "Require multiple institute signatures for high-stakes credentials.",
      votesFor: 89,
      votesAgainst: 45,
      status: "Active",
      timeLeft: "5 days",
      icon: Clock
    },
    {
      id: "PROP-003",
      title: "Update ZK-Proof Circuit for Age Verification",
      description: "Enhance privacy-preserving age verification mechanism.",
      votesFor: 203,
      votesAgainst: 12,
      status: "Passing",
      timeLeft: "1 day",
      icon: TrendingUp
    }
  ];

  const stats = [
    {
      value: "247",
      label: "Verified Institutes",
      change: "+12 this month"
    },
    {
      value: "89%",
      label: "Average Participation",
      change: "Active governance"
    },
    {
      value: "156",
      label: "Proposals Passed",
      change: "Since inception"
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
                <Vote className="w-4 h-4 mr-2" />
                <DecryptedText text="DAO Governance" speed={50} />
              </div>
            </BlurFade>

            <WordPullUp
              text="Decentralized Decision Making"
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
              delayMultiple={0.08}
            />

            <BlurFade delay={0.3}>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Shape the future of academic verification. Vote on proposals, verify new institutes, 
                and help govern the world's most trusted credential network.
              </p>
            </BlurFade>

            <BlurFade delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative px-8 py-4 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold transition-all hover:from-emerald-400 hover:to-teal-400 glow-emerald">
                  Connect to Vote
                  <span className="absolute inset-0 rounded-full ring-2 ring-emerald-400/20 group-hover:ring-emerald-400/40 transition-all"></span>
                </button>
                <button className="px-8 py-4 rounded-full border border-emerald-500/30 text-white font-semibold transition-all hover:bg-emerald-500/10 hover:border-emerald-400/50">
                  Submit Proposal
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
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl glass-panel-emerald"
              >
                <div className="text-6xl font-bold text-gradient-emerald mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-2">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.change}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Proposals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <SplitText text="Active Proposals" className="text-white" />
            </h2>
            <p className="text-center text-gray-400 mb-12">Vote on proposals shaping the network</p>
          </BlurFade>

          <div className="space-y-6">
            {activeProposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl glass-panel-emerald hover:bg-emerald-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <proposal.icon className="w-8 h-8 text-emerald-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-400 font-mono">
                          {proposal.id}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-400">
                          {proposal.timeLeft} remaining
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">{proposal.title}</h3>
                      <p className="text-gray-400">{proposal.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Voting Progress</span>
                    <span className="text-white font-semibold">
                      {Math.round((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100)}% Support
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all"
                      style={{
                        width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-400">For: {proposal.votesFor}</span>
                    <span className="text-gray-400">Against: {proposal.votesAgainst}</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-400 hover:to-teal-400 transition-all">
                    Vote For
                  </button>
                  <button className="flex-1 px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-emerald-400/50 transition-all">
                    Vote Against
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DAO Features */}
      <section className="py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <SplitText text="Governance Features" className="text-white" />
            </h2>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {daoFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl glass-panel-emerald hover:bg-emerald-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <feature.icon className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    feature.status === "Active" ? "bg-white/20 text-white" : "bg-white/10 text-gray-400"
                  }`}>
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

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BlurFade delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Shape the Future Together
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join verified institutes in governing the world's most trusted academic credential network.
            </p>
            <button className="px-10 py-4 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg hover:from-emerald-400 hover:to-teal-400 transition-all glow-emerald">
              Participate in Governance
            </button>
          </BlurFade>
        </div>
      </section>
    </div>
  );
}
