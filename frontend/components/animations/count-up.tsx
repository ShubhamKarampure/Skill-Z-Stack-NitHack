"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

interface CountUpProps {
  end: number
  duration?: number
  format?: (value: number) => string
  className?: string
}

export function CountUp({ end, duration = 2, format, className = "" }: CountUpProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.5 })

  useEffect(() => {
    if (!inView) return

    let startTime: number
    let animationId: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      setCount(Math.floor(end * progress))

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [inView, end, duration])

  return (
    <span ref={ref} className={className}>
      {format ? format(count) : count.toLocaleString()}
    </span>
  )
}
