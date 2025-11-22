"use client"

import { Navbar } from "@/components/navbar"
import { CountUp } from "@/components/animations/count-up"
import { AnimatedContent } from "@/components/animations/animated-content"
import { FadeContent } from "@/components/animations/fade-content"
import { DecryptedText } from "@/components/animations/decrypted-text"
import { ClickSpark } from "@/components/animations/click-spark"
import { StarBorder } from "@/components/animations/star-border"
import { motion } from "framer-motion"
import { useState } from "react"
import { FileText, BarChart3, Plus, CheckCircle, Clock, ArrowRight } from "lucide-react"

interface IssuedCredential {
  id: string
  studentName: string
  skillName: string
  issuedDate: string
  verified: boolean
  transactionHash?: string
}

interface PendingEndorsement {
  id: string
  studentName: string
  skillName: string
  requestedDate: string
}

export default function IssuerPortal() {
  const [issued, setIssued] = useState<IssuedCredential[]>([
    {
      id: "1",
      studentName: "Alex Chen",
      skillName: "Advanced React Development",
      issuedDate: "2024-11-15",
      verified: true,
      transactionHash: "0x1a2b3c...4d5e6f",
    },
    {
      id: "2",
      studentName: "Jordan Smith",
      skillName: "Blockchain Fundamentals",
      issuedDate: "2024-11-10",
      verified: true,
      transactionHash: "0x9z8y7x...6w5v4u",
    },
    {
      id: "3",
      studentName: "Taylor Brown",
      skillName: "Web3 Security",
      issuedDate: "2024-11-05",
      verified: false,
    },
  ])

  const pending: PendingEndorsement[] = [
    {
      id: "1",
      studentName: "Morgan Davis",
      skillName: "UI/UX Design",
      requestedDate: "2024-11-18",
    },
    {
      id: "2",
      studentName: "Casey Lee",
      skillName: "Smart Contracts",
      requestedDate: "2024-11-17",
    },
  ]

  const [formData, setFormData] = useState({
    wallet: "",
    skillName: "",
    category: "Technical",
    expiryDate: "",
    description: "",
  })

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <FadeContent>
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-mono font-bold" style={{ letterSpacing: "-0.03em" }}>
                  <span className="text-secondary neon-glow-purple">Issue</span> Credentials
                </h1>
                <p className="text-muted-foreground">
                  <DecryptedText text="TechCertified Academy • Admin" className="text-sm" />
                </p>
              </div>
              <ClickSpark colors={["#c84bff", "#06b6d4"]}>
                <StarBorder color="#c84bff">
                  <motion.button
                    className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-mono font-bold rounded border border-secondary transition-all flex items-center gap-2 glow-box-purple"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    New Issue
                  </motion.button>
                </StarBorder>
              </ClickSpark>
            </div>

            {/* Stats */}
            <motion.div
              className="grid md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {[
                { label: "Total Students", value: 847, color: "text-secondary" },
                { label: "Credentials Issued", value: issued.length, color: "text-primary" },
                { label: "Verified on Chain", value: issued.filter((c) => c.verified).length, color: "text-accent" },
                { label: "Pending Endorsements", value: pending.length, color: "text-destructive" },
              ].map((stat, idx) => (
                <AnimatedContent key={stat.label} index={idx}>
                  <div
                    className="glass-effect p-6 rounded-lg border-l-2 border-transparent hover:border-secondary transition-all"
                    style={{ borderLeftColor: stat.color }}
                  >
                    <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                      <CountUp end={stat.value} />
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
          <div className="lg:col-span-2 space-y-8">
            {/* Minting Form */}
            <FadeContent delay={0.1}>
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold flex items-center gap-2">
                  <FileText className="w-6 h-6 text-secondary" />
                  Mint New Credential
                </h2>
                <div className="glass-effect rounded-xl p-8 border border-secondary/30 space-y-6">
                  <div>
                    <label className="block text-sm font-mono font-bold text-foreground mb-3">
                      Recipient Wallet Address
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={formData.wallet}
                      onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono font-bold text-foreground mb-3">Skill Name</label>
                      <input
                        type="text"
                        placeholder="e.g., React.js, Data Science"
                        value={formData.skillName}
                        onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-secondary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-mono font-bold text-foreground mb-3">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-secondary transition-all"
                      >
                        <option>Technical</option>
                        <option>Creative</option>
                        <option>Business</option>
                        <option>Academic</option>
                        <option>Certification</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-mono font-bold text-foreground mb-3">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono font-bold text-foreground mb-3">Description</label>
                    <textarea
                      placeholder="Additional details about this credential..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-secondary transition-all min-h-24 resize-none"
                    />
                  </div>

                  <ClickSpark colors={["#c84bff", "#ff69b4"]}>
                    <StarBorder color="#c84bff">
                      <motion.button
                        className="w-full py-4 bg-gradient-to-r from-secondary to-purple-600 hover:from-secondary/90 hover:to-purple-600/90 text-secondary-foreground font-mono font-bold rounded-lg border border-secondary/50 transition-all shadow-lg hover:shadow-2xl glow-box-purple"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Mint Credential
                      </motion.button>
                    </StarBorder>
                  </ClickSpark>
                </div>
              </section>
            </FadeContent>

            {/* Issued Credentials */}
            <FadeContent delay={0.2}>
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-mono font-bold flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    Recently Issued
                  </h2>
                  <button className="text-xs font-mono text-secondary hover:text-secondary/80 flex items-center gap-1">
                    View All <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {issued.map((cred, idx) => (
                    <AnimatedContent key={cred.id} index={idx}>
                      <div className="glass-effect p-6 rounded-lg border hover:border-secondary/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-mono font-bold text-foreground mb-1">{cred.studentName}</h3>
                            <p className="text-sm text-muted-foreground">{cred.skillName}</p>
                          </div>
                          {cred.verified ? (
                            <div className="flex items-center gap-1 px-3 py-1 bg-accent/10 rounded border border-accent text-xs text-accent font-mono font-bold">
                              <CheckCircle className="w-3 h-3" />
                              On Chain
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-3 py-1 bg-destructive/10 rounded border border-destructive text-xs text-destructive font-mono font-bold">
                              <Clock className="w-3 h-3" />
                              Pending
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground">{cred.issuedDate}</span>
                          {cred.transactionHash && (
                            <span className="text-xs font-mono text-primary cursor-pointer hover:text-primary/80">
                              {cred.transactionHash}
                            </span>
                          )}
                        </div>
                      </div>
                    </AnimatedContent>
                  ))}
                </div>
              </section>
            </FadeContent>

            {/* Analytics */}
            <FadeContent delay={0.3}>
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-accent" />
                  Issuance Analytics
                </h2>
                <div className="glass-effect rounded-xl p-8 glow-box-emerald min-h-64 flex flex-col items-center justify-center border border-accent/30">
                  <div className="text-center space-y-4">
                    <div className="text-5xl">📊</div>
                    <h3 className="text-lg font-mono font-bold text-accent">Monthly Trends</h3>
                    <p className="text-muted-foreground text-sm">Credential issuance and verification metrics</p>
                    <motion.button
                      className="mt-4 px-6 py-2 bg-accent/10 hover:bg-accent/20 text-accent font-mono font-bold rounded border border-accent transition-all text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      View Analytics
                    </motion.button>
                  </div>
                </div>
              </section>
            </FadeContent>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Preview Card */}
            <FadeContent delay={0.2}>
              <section className="space-y-4">
                <h2 className="text-xl font-mono font-bold">Live Preview</h2>
                <div className="glass-effect-secondary rounded-xl p-6 glow-box-purple border border-secondary/30 space-y-4">
                  {formData.skillName ? (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Skill Name</p>
                        <p className="text-2xl font-mono font-bold text-secondary">{formData.skillName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Category</p>
                        <p className="text-sm font-mono text-foreground">{formData.category}</p>
                      </div>
                      {formData.wallet && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Recipient</p>
                          <p className="text-xs font-mono text-foreground truncate">{formData.wallet}</p>
                        </div>
                      )}
                      {formData.expiryDate && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Expiry</p>
                          <p className="text-xs font-mono text-foreground">{formData.expiryDate}</p>
                        </div>
                      )}
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">Preview</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">Fill in form to see preview</p>
                    </div>
                  )}
                </div>
              </section>
            </FadeContent>

            {/* Pending Endorsements */}
            <FadeContent delay={0.3}>
              <section className="space-y-4">
                <h2 className="text-xl font-mono font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-destructive" />
                  Pending ({pending.length})
                </h2>
                <div className="space-y-3">
                  {pending.length > 0 ? (
                    pending.map((endorsement, idx) => (
                      <AnimatedContent key={endorsement.id} index={idx}>
                        <div className="glass-effect-secondary p-4 rounded-lg space-y-3 border border-secondary/30">
                          <div>
                            <p className="font-mono font-bold text-sm text-foreground">{endorsement.studentName}</p>
                            <p className="text-xs text-muted-foreground">{endorsement.skillName}</p>
                            <p className="text-xs text-muted-foreground mt-1">Requested: {endorsement.requestedDate}</p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              className="flex-1 px-3 py-2 bg-accent hover:bg-accent/90 text-accent-foreground font-mono font-bold rounded border border-accent transition-all text-xs"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Approve
                            </motion.button>
                            <motion.button
                              className="flex-1 px-3 py-2 border border-border hover:border-destructive hover:text-destructive font-mono font-bold rounded transition-all text-xs"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Decline
                            </motion.button>
                          </div>
                        </div>
                      </AnimatedContent>
                    ))
                  ) : (
                    <div className="p-4 text-center glass-effect rounded-lg">
                      <p className="text-sm text-muted-foreground">No pending endorsements</p>
                    </div>
                  )}
                </div>
              </section>
            </FadeContent>

            {/* Credential Templates */}
            <FadeContent delay={0.4}>
              <section className="space-y-4">
                <h2 className="text-xl font-mono font-bold">Templates</h2>
                <div className="space-y-2">
                  {["React Developer", "Web3 Engineer", "UI/UX Designer", "Data Scientist"].map((template) => (
                    <motion.button
                      key={template}
                      className="w-full p-3 glass-effect rounded-lg border hover:border-secondary hover:bg-secondary/5 text-left text-sm font-mono transition-all text-foreground"
                      whileHover={{ x: 4 }}
                    >
                      {template}
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
