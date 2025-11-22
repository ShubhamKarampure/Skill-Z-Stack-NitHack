import type React from "react"
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  accent: "cyan" | "purple" | "emerald"
}

const accentStyles = {
  cyan: "text-primary border-primary/30 bg-primary/10 glow-box-cyan",
  purple: "text-secondary border-secondary/30 bg-secondary/10 glow-box-purple",
  emerald: "text-accent border-accent/30 bg-accent/10 glow-box-emerald",
}

export function FeatureCard({ icon, title, description, accent }: FeatureCardProps) {
  return (
    <div className={`p-6 rounded-lg border glass-effect ${accentStyles[accent]} transition-all hover:scale-105`}>
      <div className="mb-4">{icon}</div>
      <h3 className="font-mono font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
