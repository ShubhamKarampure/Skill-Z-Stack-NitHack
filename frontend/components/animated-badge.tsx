import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedBadgeProps {
  children: ReactNode
  variant?: "cyan" | "purple" | "emerald"
  className?: string
  animated?: boolean
}

const badgeStyles = {
  cyan: "text-primary border-primary/50 bg-primary/10 neon-glow-cyan",
  purple: "text-secondary border-secondary/50 bg-secondary/10 neon-glow-purple",
  emerald: "text-accent border-accent/50 bg-accent/10 neon-glow-emerald",
}

export function AnimatedBadge({ children, variant = "cyan", className, animated = true }: AnimatedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 rounded border font-mono text-xs font-bold transition-all",
        badgeStyles[variant],
        animated && "hover:scale-110 hover:shadow-lg",
        className,
      )}
    >
      {children}
    </span>
  )
}
