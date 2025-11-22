"use client"
import { motion } from "framer-motion"

interface ShinyTextProps {
  text: string
  className?: string
}

export function ShinyText({ text, className = "" }: ShinyTextProps) {
  return (
    <motion.span className={`relative inline-block ${className}`} whileHover={{ scale: 1.05 }}>
      <span className="relative inline-block">
        {text}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          style={{ filter: "blur(10px)" }}
        />
      </span>
    </motion.span>
  )
}
