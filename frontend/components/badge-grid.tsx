import type { ReactNode } from "react"

interface Badge {
  label: string
  icon?: ReactNode
}

interface BadgeGridProps {
  badges: Badge[]
  columns?: number
}

export function BadgeGrid({ badges, columns = 3 }: BadgeGridProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {badges.map((badge, i) => (
        <div
          key={i}
          className="glass-effect p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-center"
        >
          {badge.icon && <div className="mb-2 text-2xl">{badge.icon}</div>}
          <p className="font-mono font-bold text-sm text-foreground">{badge.label}</p>
        </div>
      ))}
    </div>
  )
}
