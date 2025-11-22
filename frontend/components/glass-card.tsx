import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  variant?: "cyan" | "purple" | "emerald"
  className?: string
  interactive?: boolean
}

const variantStyles = {
  cyan: "glass-effect glow-box-cyan",
  purple: "glass-effect-secondary glow-box-purple",
  emerald: "glass-effect-accent glow-box-emerald",
}

export function GlassCard({ children, variant = "cyan", className, interactive = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-lg border transition-all",
        variantStyles[variant],
        interactive && "hover:scale-105 cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  )
}
