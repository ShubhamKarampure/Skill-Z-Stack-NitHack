"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface StarBorderProps {
  children: ReactNode
  color?: string
  className?: string
}

export function StarBorder({ children, color = "#06b6d4", className = "" }: StarBorderProps) {
  return (
    <motion.div className={`relative ${className}`} whileHover={{ boxShadow: `0 0 30px ${color}66` }}>
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(45deg, ${color}20, transparent)`,
          boxShadow: `inset 0 0 20px ${color}10`,
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
