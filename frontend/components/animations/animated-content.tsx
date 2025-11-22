"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface AnimatedContentProps {
  children: ReactNode
  className?: string
  delay?: number
  index?: number
}

export function AnimatedContent({ children, className = "", delay = 0, index = 0 }: AnimatedContentProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: delay + index * 0.1, duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
