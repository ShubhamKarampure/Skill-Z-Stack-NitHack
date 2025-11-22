"use client"

import { Navbar } from "@/components/navbar"
import { CountUp } from "@/components/animations/count-up"
import { AnimatedContent } from "@/components/animations/animated-content"
import { FadeContent } from "@/components/animations/fade-content"
import { motion } from "framer-motion"
import { useState } from "react"
import { TrendingUp, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle2, Clock, Coins, ArrowRight } from "lucide-react"

interface Proposal {
  id: string
  title: string
  description: string
  category: "policy" | "standard" | "treasury" | "feature"
  status: "active" | "passed" | "rejected" | "pending"
  votesFor: number
  votesAgainst: number
  endDate: string
  votePercentage: number
}

const categoryStyles = {
  policy: "text-primary border-primary/30 bg-primary/10",
  standard: "text-secondary border-secondary/30 bg-secondary/10",
  treasury: "text-accent border-accent/30 bg-accent/10",
  feature: "text-orange-400 border-orange-400/30 bg-orange-400/10",
}

const statusStyles = {
  active: "text-primary",
  passed: "text-accent",
  rejected: "text-destructive",
  pending: "text-orange-400",
}

export default function GovernancePage() {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Implement Zero-Knowledge Proof Standard",
      description: "Establish a new standard for ZK proofs across all credential verification processes.",
      category: "standard",
      status: "active",
      votesFor: 2843,
      votesAgainst: 341,
      endDate: "2024-12-01",
      votePercentage: 89,
    },
    {
      id: "2",
      title: "Increase Community Treasury Fund",
      description: "Allocate additional 50,000 SKP tokens to community development grants.",
      category: "treasury",
      status: "active",
      votesFor: 1562,
      votesAgainst: 298,
      endDate: "2024-11-30",
      votePercentage: 84,
    },
    {
      id: "3",
      title: "Add Multi-Chain Support",
      description: "Enable credential issuance on Ethereum, Polygon, and Solana networks.",
      category: "feature",
      status: "pending",
      votesFor: 0,
      votesAgainst: 0,
      endDate: "2024-12-10",
      votePercentage: 0,
    },
    {
      id: "4",
      title: "Institute Verification Process Update",
      description: "Strengthen the verification process for educational institutions joining the network.",
      category: "policy",
      status: "passed",
      votesFor: 3421,
      votesAgainst: 189,
      endDate: "2024-11-15",
      votePercentage: 95,
    },
  ])

  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set())

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <TrendingUp className="w-4 h-4" />
      case "passed":
        return <CheckCircle2 className="w-4 h-4" />
      case "rejected":
        return <AlertCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleVote = (proposalId: string) => {
    setVotedProposals((prev) => new Set([...prev, proposalId]))
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <FadeContent>
          <div className="mb-12">
            <div className="space-y-2 mb-8">
              <h1 className="text-4xl md:text-5xl font-mono font-bold" style={{ letterSpacing: "-0.03em" }}>
                <span className="text-accent neon-glow-emerald">Governance</span> DAO
              </h1>
              <p className="text-muted-foreground">
                Participate in protocol evolution. Your vote shapes SkillsPassport.
              </p>
            </div>

            {/* Stats */}
            <motion.div
              className="grid md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {[
                { label: "Total Voters", value: 12847, color: "text-accent" },
                { label: "Active Proposals", value: 4, color: "text-primary" },
                { label: "Total Proposals", value: 127, color: "text-secondary" },
                {
                  label: "Voting Power",
                  value: 1200000,
                  color: "text-orange-400",
                  format: (v: number) => `${(v / 1000000).toFixed(1)}M`,
                },
              ].map((stat, idx) => (
                <AnimatedContent key={stat.label} index={idx}>
                  <div
                    className="glass-effect p-6 rounded-lg border-l-2 hover:border-accent transition-all"
                    style={{ borderLeftColor: stat.color }}
                  >
                    <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                      <CountUp end={stat.value} format={stat.format} />
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </AnimatedContent>
              ))}
            </motion.div>
          </div>
        </FadeContent>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Proposals */}
            <FadeContent delay={0.1}>
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold">Active Proposals</h2>
                <div className="space-y-3">
                  {proposals
                    .filter((p) => p.status === "active" || p.status === "pending")
                    .map((proposal, idx) => (
                      <AnimatedContent key={proposal.id} index={idx}>
                        <div className="glass-effect p-6 rounded-lg border hover:border-primary/50 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <span
                                  className={`px-2 py-1 rounded border text-xs font-mono font-bold ${
                                    categoryStyles[proposal.category as keyof typeof categoryStyles]
                                  }`}
                                >
                                  {proposal.category.charAt(0).toUpperCase() + proposal.category.slice(1)}
                                </span>
                                <div
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-bold ${
                                    statusStyles[proposal.status as keyof typeof statusStyles]
                                  }`}
                                >
                                  {getStatusIcon(proposal.status)}
                                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                </div>
                                {proposal.status === "active" && proposal.endDate === "2024-11-30" && (
                                  <span className="text-xs font-mono font-bold text-destructive animate-pulse">
                                    URGENT
                                  </span>
                                )}
                              </div>
                              <h3 className="font-mono font-bold text-lg text-foreground mb-2">{proposal.title}</h3>
                              <p className="text-sm text-muted-foreground">{proposal.description}</p>
                            </div>
                          </div>

                          {proposal.status === "active" ? (
                            <>
                              {/* Voting Progress */}
                              <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                  <span className="text-xs text-muted-foreground">Voting Progress</span>
                                  <span className="text-xs font-mono font-bold text-primary">
                                    {proposal.votePercentage.toFixed(1)}% For
                                  </span>
                                </div>
                                <div className="h-2 bg-card rounded-full overflow-hidden border border-border/50">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-accent"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${proposal.votePercentage}%` }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                  />
                                </div>
                              </div>

                              {/* Vote Counts */}
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded border border-primary/20">
                                  <ThumbsUp className="w-4 h-4 text-accent" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">For</p>
                                    <p className="font-mono font-bold text-foreground">
                                      <CountUp end={proposal.votesFor} />
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-destructive/5 rounded border border-destructive/20">
                                  <ThumbsDown className="w-4 h-4 text-destructive" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Against</p>
                                    <p className="font-mono font-bold text-foreground">
                                      <CountUp end={proposal.votesAgainst} />
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              {!votedProposals.has(proposal.id) ? (
                                <div className="flex gap-3">
                                  <motion.button
                                    onClick={() => handleVote(proposal.id)}
                                    className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground font-mono font-bold rounded border border-accent transition-all text-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Vote For
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleVote(proposal.id)}
                                    className="flex-1 px-4 py-2 border border-destructive text-destructive hover:bg-destructive/10 font-mono font-bold rounded transition-all text-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Vote Against
                                  </motion.button>
                                </div>
                              ) : (
                                <div className="py-2 text-center text-xs font-mono text-accent">Voted ✓</div>
                              )}

                              <p className="text-xs text-muted-foreground text-center mt-3">
                                Voting ends: {proposal.endDate}
                              </p>
                            </>
                          ) : (
                            <div className="flex items-center justify-between pt-3 border-t border-border">
                              <span className="text-xs text-muted-foreground">Voting starts: {proposal.endDate}</span>
                              <motion.button
                                className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary font-mono font-bold rounded border border-primary text-xs transition-all"
                                whileHover={{ scale: 1.05 }}
                              >
                                Set Reminder
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </AnimatedContent>
                    ))}
                </div>
              </section>
            </FadeContent>

            {/* Passed Proposals */}
            <FadeContent delay={0.2}>
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-mono font-bold">Recent Passes</h2>
                  <button className="text-xs font-mono text-accent hover:text-accent/80 flex items-center gap-1">
                    View All <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {proposals
                    .filter((p) => p.status === "passed")
                    .map((proposal, idx) => (
                      <AnimatedContent key={proposal.id} index={idx}>
                        <div className="glass-effect p-4 rounded-lg border border-accent/50 hover:border-accent transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-mono font-bold text-foreground">{proposal.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {proposal.votePercentage.toFixed(1)}% approval • <CountUp end={proposal.votesFor} />{" "}
                                votes
                              </p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          </div>
                        </div>
                      </AnimatedContent>
                    ))}
                </div>
              </section>
            </FadeContent>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting Power */}
            <FadeContent delay={0.2}>
              <section className="space-y-4">
                <h2 className="text-xl font-mono font-bold flex items-center gap-2">
                  <Coins className="w-5 h-5 text-secondary" />
                  Voting Power
                </h2>
                <div className="glass-effect-secondary p-6 rounded-lg glow-box-purple space-y-4 border border-secondary/30">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">SKP Tokens</p>
                    <p className="text-3xl font-mono font-bold text-secondary">
                      <CountUp end={125847} format={(v) => v.toLocaleString()} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Voting Weight</p>
                    <p className="text-2xl font-mono font-bold text-primary">0.98%</p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3">Delegate voting power to another address</p>
                    <motion.button
                      className="w-full px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary font-mono font-bold rounded border border-secondary transition-all text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delegate Power
                    </motion.button>
                  </div>
                </div>
              </section>
            </FadeContent>

            {/* Governance Info */}
            <FadeContent delay={0.3}>
              <section className="space-y-4">
                <h2 className="text-xl font-mono font-bold">How It Works</h2>
                <div className="glass-effect p-6 rounded-lg space-y-3">
                  {[
                    { step: "1", title: "Hold SKP Tokens", desc: "Get voting rights" },
                    { step: "2", title: "Vote on Proposals", desc: "Shape the protocol" },
                    { step: "3", title: "Earn Rewards", desc: "Participate in governance" },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <motion.div
                        className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold text-accent"
                        whileHover={{ scale: 1.2 }}
                      >
                        {item.step}
                      </motion.div>
                      <div>
                        <p className="text-sm font-mono font-bold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </FadeContent>

            {/* Resources */}
            <FadeContent delay={0.4}>
              <section className="space-y-4">
                <h2 className="text-xl font-mono font-bold">Resources</h2>
                <div className="space-y-2">
                  {["Governance Docs", "Vote Delegation", "Treasury Report"].map((resource) => (
                    <motion.button
                      key={resource}
                      className="w-full p-3 glass-effect rounded-lg border hover:border-accent hover:bg-accent/5 text-left text-sm font-mono transition-all text-foreground"
                      whileHover={{ x: 4 }}
                    >
                      {resource}
                    </motion.button>
                  ))}
                </div>
              </section>
            </FadeContent>
          </div>
        </div>
      </div>
    </main>
  )
}
