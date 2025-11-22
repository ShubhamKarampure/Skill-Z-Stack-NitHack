"use client"

interface GradientTextProps {
  text: string
  className?: string
  from?: string
  to?: string
}

export function GradientText({ text, className = "", from = "#06b6d4", to = "#10b981" }: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
      }}
    >
      {text}
    </span>
  )
}
