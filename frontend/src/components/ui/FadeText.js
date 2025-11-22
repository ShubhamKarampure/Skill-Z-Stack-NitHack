"use client";

import { motion } from "framer-motion";

export default function FadeText({ text, className = "", direction = "up", framerProps = {} }) {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", ...framerProps }}
      className={className}
    >
      {text}
    </motion.div>
  );
}
