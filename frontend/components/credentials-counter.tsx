"use client"

import { useEffect, useState } from "react"

interface CredentialsCounterProps {
  end: number
  duration?: number
  suffix?: string
}

export function CredentialsCounter({ end, duration = 2000, suffix = "" }: CredentialsCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / duration
      const value = Math.floor(end * progress)

      if (progress < 1) {
        setCount(value)
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration])

  return (
    <span className="font-mono font-bold">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
