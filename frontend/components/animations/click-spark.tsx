"use client"

import type React from "react"
import { type ReactNode, useState } from "react"
import { motion } from "framer-motion"

interface Spark {
  id: number
  x: number
  y: number
  color: string
}

interface ClickSparkProps {
  children: ReactNode
  colors?: string[]
}

export function ClickSpark({ children, colors = ["#06b6d4", "#c84bff"] }: ClickSparkProps) {
  const [sparks, setSparks] = useState<Spark[]>([])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newSparks = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: colors[i % colors.length],
    }))

    setSparks((prev) => [...prev, ...newSparks])

    setTimeout(() => {
      setSparks((prev) => prev.filter((spark) => !newSparks.map((s) => s.id).includes(spark.id)))
    }, 600)
  }

  return (
    <div className="relative inline-block" onClick={handleClick}>
      {children}
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{ backgroundColor: spark.color }}
          initial={{ x: spark.x, y: spark.y, opacity: 1, scale: 1 }}
          animate={{
            x: spark.x + (Math.random() - 0.5) * 100,
            y: spark.y + (Math.random() - 0.5) * 100,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}
