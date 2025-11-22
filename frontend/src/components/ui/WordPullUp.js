"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function WordPullUp({ text, className = "", delayMultiple = 0.05 }) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delayMultiple, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  if (shouldReduceMotion) {
    return <div className={className}>{text}</div>;
  }

  return (
    <motion.div className={className} variants={container} initial="hidden" animate="visible">
      {words.map((word, index) => (
        <motion.span key={index} variants={child} style={{ display: "inline-block", marginRight: "0.25em" }}>
          {word === "" ? <span>&nbsp;</span> : word}
        </motion.span>
      ))}
    </motion.div>
  );
}
