"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

// Aurora Background Component
const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-1/2 -left-1/2 w-full h-full">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
        }}
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
        }}
        animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.3, 1] }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
    <div className="absolute top-1/4 right-1/4 w-full h-full">
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
        }}
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  </div>
);

// Grid Pattern
const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

// Magnetic Button
const MagneticButton = ({ children, className = "", href }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPos({ x, y });
  };

  return (
    <Link href={href}>
      <motion.div
        className={className}
        onMouseMove={handleMouse}
        onMouseLeave={() => setPos({ x: 0, y: 0 })}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 350, damping: 15 }}
      >
        {children}
      </motion.div>
    </Link>
  );
};

// Floating Orb
const FloatingOrb = () => {
  return (
    <motion.div
      className="absolute w-72 h-72 rounded-full opacity-20 pointer-events-none"
      style={{
        background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
      }}
      transition={{
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
};

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <Aurora />
      <GridPattern />

      <div className="absolute top-0 left-1/3 w-96 h-96">
        <FloatingOrb />
      </div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80">
        <FloatingOrb />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 inline-block">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-3xl blur-2xl opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)",
                }}
                animate={{
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
              <div className="relative px-8 py-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <h2 className="text-4xl font-bold mb-2">Page Not Found</h2>
          <p className="text-zinc-400 text-lg">
            The page you're looking for seems to have slipped into the digital
            void.
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <div className="flex items-center justify-center gap-3 text-zinc-300">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <p>We couldn't locate this route. Let's get you back on track.</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <MagneticButton
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition-all cursor-pointer"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </MagneticButton>

          <motion.a
            href="/"
            className="px-8 py-4 rounded-full font-semibold border border-white/20 hover:border-white/40 text-zinc-300 hover:text-white transition-all flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur"
            whileHover={{ x: 5 }}
          >
            Explore Features <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/5"
        >
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-zinc-500">
            <a href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </a>
            <span className="hidden sm:block">•</span>
            <a
              href="#features"
              className="hover:text-zinc-300 transition-colors"
            >
              Features
            </a>
            <span className="hidden sm:block">•</span>
            <a href="#about" className="hover:text-zinc-300 transition-colors">
              About
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 rounded-full border border-blue-500/20 pointer-events-none"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute top-1/4 left-10 w-24 h-24 rounded-full border border-purple-500/20 pointer-events-none"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
}
