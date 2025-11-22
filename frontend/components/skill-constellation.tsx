"use client"

import { useEffect, useRef, useState } from "react"

interface SkillNode {
  id: string
  name: string
  status: "verified" | "pending" | "expired"
  endorsements: number
}

interface SkillConstellationProps {
  skills: SkillNode[]
  onNodeClick?: (skill: SkillNode) => void
}

export function SkillConstellation({ skills, onNodeClick }: SkillConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) / 3

    let animationTime = 0

    const animate = () => {
      animationTime += 0.01

      // Clear canvas
      ctx.fillStyle = "rgba(10, 14, 39, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw center node (You)
      const youX = centerX
      const youY = centerY
      const youSize = 15

      ctx.fillStyle = "#e0e8ff"
      ctx.beginPath()
      ctx.arc(youX, youY, youSize, 0, Math.PI * 2)
      ctx.fill()

      // Glow around center
      const glowGradient = ctx.createRadialGradient(youX, youY, youSize, youX, youY, youSize * 2)
      glowGradient.addColorStop(0, "rgba(0, 212, 255, 0.3)")
      glowGradient.addColorStop(1, "rgba(0, 212, 255, 0)")
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(youX, youY, youSize * 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw skill nodes and connections
      skills.forEach((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2 + animationTime * 0.5
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        // Draw connection line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(youX, youY)
        ctx.lineTo(x, y)
        ctx.stroke()

        // Determine node color based on status
        let nodeColor = "#06b6d4" // cyan for verified
        if (skill.status === "expired") nodeColor = "#92400e" // rust
        if (skill.status === "pending") nodeColor = "#fbbf24" // gold

        // Draw node
        const nodeSize = 8
        ctx.fillStyle = nodeColor
        ctx.beginPath()
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        const glowGradient = ctx.createRadialGradient(x, y, nodeSize, x, y, nodeSize * 3)
        glowGradient.addColorStop(0, `${nodeColor}66`)
        glowGradient.addColorStop(1, `${nodeColor}00`)
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(x, y, nodeSize * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [skills])

  return (
    <div className="relative w-full h-80 rounded-xl overflow-hidden glass-effect border border-primary/30 glow-box-cyan">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={(e) => {
          const canvas = canvasRef.current
          if (!canvas) return
          const rect = canvas.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          const centerX = canvas.width / 2
          const centerY = canvas.height / 2

          // Check distance to nodes
          const radius = Math.min(canvas.width, canvas.height) / 3
          for (let i = 0; i < skills.length; i++) {
            const angle = (i / skills.length) * Math.PI * 2
            const nodeX = centerX + Math.cos(angle) * radius
            const nodeY = centerY + Math.sin(angle) * radius
            const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2)
            if (distance < 20) {
              setSelectedSkill(skills[i])
              onNodeClick?.(skills[i])
              break
            }
          }
        }}
      />

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-xs text-muted-foreground text-center bg-background/80 backdrop-blur px-3 py-2 rounded">
        Click on a skill node to view details
      </div>
    </div>
  )
}
