"use client"

import { motion } from "framer-motion"

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export function SplitText({ text, className = "", delay = 0, duration = 0.05 }: SplitTextProps) {
  const words = text.split(" ")

  return (
    <div className={className}>
      {words.map((word, wordIdx) => (
        <div key={wordIdx} className="inline-block mr-2">
          {word.split("").map((char, charIdx) => (
            <motion.span
              key={charIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: delay + (wordIdx * word.length + charIdx) * duration,
                duration: 0.3,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  )
}
