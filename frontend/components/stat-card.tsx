import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  accent?: "cyan" | "purple" | "emerald"
  className?: string
}

const accentBorder = {
  cyan: "border-l-primary",
  purple: "border-l-secondary",
  emerald: "border-l-accent",
}

export function StatCard({ label, value, icon, accent = "cyan", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "glass-effect p-6 rounded-lg border-l-2 transition-all hover:scale-105",
        accentBorder[accent],
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold font-mono text-foreground">{value}</p>
        </div>
        {icon && <div className="text-2xl opacity-50">{icon}</div>}
      </div>
    </div>
  )
}
