"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Share2 } from "lucide-react"

interface Skill {
  id: string
  name: string
  status: "verified" | "pending" | "expired"
  endorsements: number
  issuer?: string
  issueDate?: string
  expiryDate?: string
  nftAddress?: string
}

interface SkillDetailSidebarProps {
  skill: Skill | null
  onClose: () => void
}

export function SkillDetailSidebar({ skill, onClose }: SkillDetailSidebarProps) {
  if (!skill) return null

  const statusColor = {
    verified: "#06b6d4",
    pending: "#fbbf24",
    expired: "#92400e",
  }

  const statusLabel = {
    verified: "VERIFIED",
    pending: "PENDING",
    expired: "EXPIRED",
  }

  return (
    <AnimatePresence>
      {skill && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-card border-l border-border z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-border bg-background/95 backdrop-blur">
              <h2 className="font-mono font-bold text-lg">Skill Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary/10 rounded border border-transparent hover:border-primary transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Skill Name */}
              <div>
                <h3 className="text-2xl font-mono font-bold text-foreground mb-3">{skill.name}</h3>
                <div
                  className="inline-block px-3 py-1 rounded border text-xs font-mono font-bold"
                  style={{
                    color: statusColor[skill.status],
                    borderColor: `${statusColor[skill.status]}66`,
                    backgroundColor: `${statusColor[skill.status]}11`,
                  }}
                >
                  {statusLabel[skill.status]}
                </div>
              </div>

              {/* Endorsements */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Endorsements</p>
                <p className="text-3xl font-mono font-bold text-primary">{skill.endorsements}</p>
              </div>

              {/* Details */}
              {skill.issuer && (
                <div className="pt-4 border-t border-border space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Issued By</p>
                    <p className="font-mono text-sm text-foreground">{skill.issuer}</p>
                  </div>

                  {skill.issueDate && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Issue Date</p>
                      <p className="font-mono text-sm text-foreground">{skill.issueDate}</p>
                    </div>
                  )}

                  {skill.expiryDate && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                      <p className="font-mono text-sm text-foreground">{skill.expiryDate}</p>
                    </div>
                  )}
                </div>
              )}

              {/* NFT Address */}
              {skill.nftAddress && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground">Token ID</p>
                    <a
                      href={`https://etherscan.io/token/${skill.nftAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-xs font-mono"
                    >
                      View on Chain
                      <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>
                  </div>
                  <p className="font-mono text-sm text-foreground break-all">{skill.nftAddress}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t border-border space-y-2 flex flex-col gap-2">
                <button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold rounded border border-primary transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="w-full px-4 py-2 border border-border hover:border-primary hover:bg-primary/5 text-foreground font-mono font-bold rounded transition-all">
                  Request Endorsement
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
