"use client"

import { Navbar } from "@/components/navbar"
import { useState } from "react"
import { Users, FileText, BarChart3, Plus, CheckCircle, Clock } from "lucide-react"

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

export default function InstitutePortal() {
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

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold font-mono">
                <span className="text-secondary neon-glow-purple">Institute</span> Dashboard
              </h1>
              <p className="text-muted-foreground">TechCertified Academy • Admin</p>
            </div>
            <button className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-mono font-bold rounded border border-secondary transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Issue Credential
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="glass-effect p-6 rounded-lg border-l-2 border-secondary">
              <div className="text-3xl font-bold text-secondary mb-2">847</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
            <div className="glass-effect p-6 rounded-lg border-l-2 border-primary">
              <div className="text-3xl font-bold text-primary mb-2">{issued.length}</div>
              <p className="text-sm text-muted-foreground">Credentials Issued</p>
            </div>
            <div className="glass-effect p-6 rounded-lg border-l-2 border-accent">
              <div className="text-3xl font-bold text-accent mb-2">{issued.filter((c) => c.verified).length}</div>
              <p className="text-sm text-muted-foreground">Verified on Chain</p>
            </div>
            <div className="glass-effect p-6 rounded-lg border-l-2 border-destructive">
              <div className="text-3xl font-bold text-destructive mb-2">{pending.length}</div>
              <p className="text-sm text-muted-foreground">Pending Endorsements</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Issued Credentials */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Issued Credentials
                </h2>
                <button className="text-xs font-mono text-primary hover:text-primary/80">View All →</button>
              </div>
              <div className="space-y-3">
                {issued.map((cred) => (
                  <div
                    key={cred.id}
                    className="glass-effect p-6 rounded-lg border hover:border-secondary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-mono font-bold text-foreground mb-1">{cred.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{cred.skillName}</p>
                      </div>
                      {cred.verified ? (
                        <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 rounded border border-accent text-xs text-accent font-mono">
                          <CheckCircle className="w-3 h-3" />
                          On Chain
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 rounded border border-destructive text-xs text-destructive font-mono">
                          <Clock className="w-3 h-3" />
                          Pending
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">{cred.issuedDate}</span>
                      {cred.transactionHash && (
                        <span className="text-xs font-mono text-primary">{cred.transactionHash}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Analytics */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-accent" />
                Credential Analytics
              </h2>
              <div className="glass-effect rounded-xl p-8 glow-box-emerald min-h-64 flex flex-col items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-5xl">📊</div>
                  <h3 className="text-lg font-mono font-bold text-accent">Issuance Trends</h3>
                  <p className="text-muted-foreground text-sm">Monthly credential issuance and verification metrics</p>
                  <button className="mt-4 px-6 py-2 bg-accent/10 hover:bg-accent/20 text-accent font-mono font-bold rounded border border-accent transition-all">
                    View Analytics
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Endorsements */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold font-mono flex items-center gap-2">
                <Clock className="w-5 h-5 text-destructive" />
                Pending Endorsements
              </h2>
              <div className="space-y-3">
                {pending.length > 0 ? (
                  pending.map((endorsement) => (
                    <div key={endorsement.id} className="glass-effect-secondary p-4 rounded-lg space-y-3">
                      <div>
                        <p className="font-mono font-bold text-sm text-foreground">{endorsement.studentName}</p>
                        <p className="text-xs text-muted-foreground">{endorsement.skillName}</p>
                        <p className="text-xs text-muted-foreground mt-1">Requested: {endorsement.requestedDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-accent hover:bg-accent/90 text-accent-foreground font-mono font-bold rounded border border-accent transition-all text-xs">
                          Approve
                        </button>
                        <button className="flex-1 px-3 py-2 border border-border hover:border-destructive hover:text-destructive font-mono font-bold rounded transition-all text-xs">
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No pending endorsements</p>
                  </div>
                )}
              </div>
            </section>

            {/* Student Management */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold font-mono flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Student Management
              </h2>
              <div className="glass-effect-secondary p-6 rounded-lg glow-box-purple space-y-3">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-secondary"
                />
                <button className="w-full px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-mono font-bold rounded border border-secondary transition-all text-sm">
                  Search
                </button>
              </div>
            </section>

            {/* Certification Templates */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold font-mono">Templates</h2>
              <div className="space-y-2">
                <button className="w-full p-3 glass-effect rounded-lg border hover:border-secondary hover:bg-secondary/5 text-left text-sm font-mono transition-all text-foreground">
                  React Developer
                </button>
                <button className="w-full p-3 glass-effect rounded-lg border hover:border-secondary hover:bg-secondary/5 text-left text-sm font-mono transition-all text-foreground">
                  Web3 Engineer
                </button>
                <button className="w-full p-3 glass-effect rounded-lg border hover:border-secondary hover:bg-secondary/5 text-left text-sm font-mono transition-all text-foreground">
                  UI/UX Designer
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
