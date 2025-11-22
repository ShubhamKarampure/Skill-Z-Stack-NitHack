"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Aurora({ children, className }) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="aurora-container">
          <motion.div
            className="aurora-gradient aurora-1"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="aurora-gradient aurora-2"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="aurora-gradient aurora-3"
            animate={{
              x: [0, 100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
