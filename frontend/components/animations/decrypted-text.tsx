"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

interface DecryptedTextProps {
  text: string
  className?: string
  speed?: number
}

export function DecryptedText({ text, className = "", speed = 0.05 }: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text.replace(/./g, "*"))
  const { ref, inView } = useInView({ threshold: 0.5 })

  useEffect(() => {
    if (!inView) return

    let charIndex = 0
    const interval = setInterval(() => {
      if (charIndex <= text.length) {
        setDisplayText(text.slice(0, charIndex) + text.slice(charIndex).replace(/./g, "*"))
        charIndex++
      } else {
        clearInterval(interval)
      }
    }, speed * 100)

    return () => clearInterval(interval)
  }, [inView, text, speed])

  return (
    <motion.span ref={ref} className={`font-mono ${className}`}>
      {displayText}
    </motion.span>
  )
}
