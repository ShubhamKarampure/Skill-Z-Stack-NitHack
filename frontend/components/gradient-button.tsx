import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "accent"
  size?: "sm" | "md" | "lg"
}

const variantStyles = {
  primary: "bg-primary hover:bg-primary/90 text-primary-foreground border-primary neon-glow-cyan",
  secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground border-secondary neon-glow-purple",
  accent: "bg-accent hover:bg-accent/90 text-accent-foreground border-accent neon-glow-emerald",
}

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
}

export function GradientButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: GradientButtonProps) {
  return (
    <button
      className={cn(
        "font-mono font-bold rounded border transition-all",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
