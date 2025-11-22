"use client"

import { Navbar } from "@/components/navbar"
import { CountUp } from "@/components/animations/count-up"
import { FadeContent } from "@/components/animations/fade-content"
import { motion } from "framer-motion"
import { Award, Download, Share2, Search, Filter } from "lucide-react"

interface Credential {
  id: string
  title: string
  issuer: string
  date: string
  verified: boolean
  nftAddress?: string
  category: string
}

export default function InventoryPage() {
  const credentials: Credential[] = [
    {
      id: "1",
      title: "Advanced React Development",
      issuer: "TechCertified Academy",
      date: "2024-11-15",
      verified: true,
      nftAddress: "0x1234...5678",
      category: "Development",
    },
    {
      id: "2",
      title: "Blockchain Fundamentals",
      issuer: "Web3 University",
      date: "2024-10-20",
      verified: true,
      nftAddress: "0x8765...4321",
      category: "Blockchain",
    },
    {
      id: "3",
      title: "UI/UX Design Masterclass",
      issuer: "Design Institute",
      date: "2024-09-10",
      verified: false,
      category: "Design",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <FadeContent>
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-mono font-bold">Credential Inventory</h1>
                <p className="text-muted-foreground">
                  <CountUp end={credentials.length} /> credentials •{" "}
                  <CountUp end={credentials.filter((c) => c.verified).length} /> verified
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="glass-effect px-4 py-2 rounded-lg border border-border flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search credentials..."
                  className="bg-transparent outline-none text-sm"
                />
              </div>
              <button className="glass-effect px-4 py-2 rounded-lg border border-border hover:border-primary transition-all flex items-center gap-2 text-sm">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </FadeContent>

        {/* Credentials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((cred, idx) => (
            <FadeContent key={cred.id} delay={idx * 0.1}>
              <motion.div
                className="glass-effect p-6 rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer group"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{cred.date}</span>
                </div>

                <h3 className="font-mono font-bold text-foreground mb-1 text-lg group-hover:text-primary transition-colors">
                  {cred.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{cred.issuer}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs font-mono px-2 py-1 rounded border ${
                      cred.verified
                        ? "bg-accent/10 border-accent text-accent"
                        : "bg-orange-400/10 border-orange-400 text-orange-400"
                    }`}
                  >
                    {cred.verified ? "✓ Verified" : "⏳ Pending"}
                  </span>
                  <span className="text-xs font-mono px-2 py-1 rounded border border-border bg-card">
                    {cred.category}
                  </span>
                </div>

                {cred.nftAddress && (
                  <p className="text-xs text-primary font-mono mb-4 break-all">NFT: {cred.nftAddress}</p>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                  <motion.button
                    className="flex-1 p-2 hover:bg-primary/10 rounded text-sm transition-all text-muted-foreground hover:text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Share2 className="w-4 h-4 inline mr-1" />
                    Share
                  </motion.button>
                  <motion.button
                    className="flex-1 p-2 hover:bg-primary/10 rounded text-sm transition-all text-muted-foreground hover:text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Download className="w-4 h-4 inline mr-1" />
                    Export
                  </motion.button>
                </div>
              </motion.div>
            </FadeContent>
          ))}
        </div>
      </div>
    </main>
  )
}
