"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingStates = [
  "Initializing Secure Environment...",
  "Verifying Blockchain Nodes...",
  "Syncing Smart Contracts...",
  "Loading Assets...",
];

export const Loader = ({ onComplete }: { onComplete?: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  // 1. Handle Progress Counter and Text Cycling
  useEffect(() => {
    const duration = 1000; // Total load time in ms
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Cycle through text states
    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingStates.length);
    }, duration / loadingStates.length);

    // Cleanup
    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, []);

  // 2. Trigger onComplete when finished
  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500); // Small delay before unmounting
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white">
      {/* Optional Background Grid Effect */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* LOGO ANIMATION CONTAINER */}
      <div className="relative w-24 h-24 mb-8">
        {/* Pulsing Glow Behind */}
        <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse" />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <defs>
            <linearGradient id="loaderGradient" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Shield Outline - Draws itself */}
          <motion.path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke="url(#loaderGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Inner Checkmark - Draws after shield */}
          <motion.path
            d="M9 12l2 2 4-4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
          />

          {/* Tech Nodes - Pop in */}
          <motion.circle
            cx="12"
            cy="8"
            r="1.5"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
          />
          <motion.circle
            cx="12"
            cy="17"
            r="1.5"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3, type: "spring" }}
          />
        </svg>
      </div>

      {/* TEXT & PROGRESS */}
      <div className="flex flex-col items-center gap-2 h-16">
        {/* Main Brand Name Reveal */}
        <motion.h1
          className="text-2xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Skill-Z
        </motion.h1>

        {/* Changing Status Text */}
        <div className="h-6 overflow-hidden flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-mono text-zinc-500 uppercase tracking-widest"
            >
              {loadingStates[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* PROGRESS BAR (Bottom Line) */}
      <div className="absolute bottom-0 left-0 h-1 bg-zinc-900 w-full">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Digital Percentage Counter */}
      <div className="absolute bottom-8 right-8 font-mono text-4xl font-bold text-zinc-800 select-none">
        {Math.floor(progress).toString().padStart(2, "0")}
        <span className="text-lg align-top">%</span>
      </div>
    </div>
  );
};
