"use client"

import { motion } from "framer-motion"

interface BlurTextProps {
  text: string
  className?: string
  duration?: number
  delay?: number
}

export function BlurText({ text, className = "", duration = 0.8, delay = 0 }: BlurTextProps) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration, delay }}
    >
      {text}
    </motion.p>
  )
}
