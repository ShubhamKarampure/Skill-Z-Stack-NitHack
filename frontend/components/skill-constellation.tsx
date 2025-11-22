"use client";

import { useEffect, useRef } from "react";

export interface SkillNode {
  id: string;
  name: string;
  status: "verified" | "pending" | "expired";
  endorsements: number;
}

interface SkillConstellationProps {
  skills: SkillNode[];
  onNodeClick?: (skill: SkillNode) => void;
}

export function SkillConstellation({
  skills,
  onNodeClick,
}: SkillConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const nodePositionsRef = useRef<
    { id: string; x: number; y: number; radius: number }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let animationTime = 0;

    const animate = () => {
      animationTime += 0.003; // Slightly slower rotation for elegance

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerX = width / 2;
      const centerY = height / 2;
      const orbitRadius = Math.min(width, height) / 3;

      ctx.clearRect(0, 0, width, height);

      // Draw "You" (Center Node)
      const youSize = 15;

      // Halo
      const youGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        youSize * 2
      );
      youGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      youGradient.addColorStop(0.5, "rgba(59, 130, 246, 0.4)"); // Blue glow
      youGradient.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = youGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, youSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      nodePositionsRef.current = [];

      skills.forEach((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2 + animationTime;
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * orbitRadius;

        nodePositionsRef.current.push({ id: skill.id, x, y, radius: 20 });

        let mainColor = "#3b82f6"; // Blue (Verified default)
        let glowColor = "rgba(59, 130, 246, 0.4)";
        let isExpired = false;

        if (skill.status === "expired") {
          mainColor = "#7f1d1d"; // Dark Red/Rust
          glowColor = "rgba(127, 29, 29, 0.2)";
          isExpired = true;
        } else if (skill.status === "pending") {
          mainColor = "#f59e0b"; // Amber
          glowColor = "rgba(245, 158, 11, 0.4)";
        } else if (skill.status === "verified") {
          mainColor = "#06b6d4"; // Cyan
          glowColor = "rgba(6, 182, 212, 0.4)";
        }

        // Connection Line
        const gradient = ctx.createLinearGradient(centerX, centerY, x, y);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(
          1,
          isExpired ? "rgba(127, 29, 29, 0.3)" : "rgba(6, 182, 212, 0.3)"
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Node Glow
        if (!isExpired) {
          const glowGrad = ctx.createRadialGradient(x, y, 5, x, y, 30);
          glowGrad.addColorStop(0, glowColor);
          glowGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node Body
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.arc(x, y, isExpired ? 6 : 8, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = isExpired ? "#71717a" : "#e4e4e7";
        ctx.font = "500 12px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(skill.name, x, y + 24);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [skills]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width / (window.devicePixelRatio || 1);
    const scaleY = canvas.height / rect.height / (window.devicePixelRatio || 1);
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    for (const node of nodePositionsRef.current) {
      const distance = Math.sqrt(
        (clickX - node.x) ** 2 + (clickY - node.y) ** 2
      );
      if (distance < node.radius + 10) {
        const clickedSkill = skills.find((s) => s.id === node.id);
        if (clickedSkill && onNodeClick) onNodeClick(clickedSkill);
        break;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] overflow-hidden cursor-pointer"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        onClick={handleClick}
      />
    </div>
  );
}
