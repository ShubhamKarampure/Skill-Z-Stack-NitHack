import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlowingTextProps {
  children: ReactNode
  color?: "cyan" | "purple" | "emerald"
  className?: string
}

const glowStyles = {
  cyan: "text-primary neon-glow-cyan",
  purple: "text-secondary neon-glow-purple",
  emerald: "text-accent neon-glow-emerald",
}

export function GlowingText({ children, color = "cyan", className }: GlowingTextProps) {
  return <span className={cn(glowStyles[color], className)}>{children}</span>
}
