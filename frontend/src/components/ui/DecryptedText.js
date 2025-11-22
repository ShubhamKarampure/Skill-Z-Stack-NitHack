"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export default function DecryptedText({ text, className = "", speed = 50 }) {
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const intervalRef = useRef(null);

  const scramble = () => {
    let iteration = 0;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, speed);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !shouldReduceMotion) {
      scramble();
    } else if (shouldReduceMotion) {
      setDisplayText(text); // ensure stable text with no scrambling
    }
    return () => clearInterval(intervalRef.current);
  }, [text, isMounted, shouldReduceMotion]);

  return (
    <motion.span className={className} onMouseEnter={() => isMounted && !shouldReduceMotion && scramble()} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {displayText}
    </motion.span>
  );
}
