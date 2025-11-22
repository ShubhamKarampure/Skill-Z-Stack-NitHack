"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Shield,
  Lock,
  Zap,
  Users,
  FileCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  ChevronDown,
  Menu,
  X,
  Github,
  Twitter,
  CheckCircle,
  Award,
  Star,
} from "lucide-react";

// --- TYPES ---

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

interface ButtonProps extends BaseProps {
  onClick?: () => void;
  disabled?: boolean;
}

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
}

// --- COMPONENTS ---

// Aurora Background Component
const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-1/2 -left-1/2 w-full h-full">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
        }}
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
        }}
        animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <div className="absolute top-1/4 right-1/4 w-full h-full">
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
        }}
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </div>
  </div>
);

// Split Text Animation
const SplitText = ({
  children,
  className = "",
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) => {
  const chars = children.split("");
  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

// Blur Text Reveal
const BlurText = ({ children, className = "", delay = 0 }: BaseProps) => (
  <motion.span
    className={className}
    initial={{ opacity: 0, filter: "blur(10px)" }}
    animate={{ opacity: 1, filter: "blur(0px)" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.span>
);

// Magnetic Button
const MagneticButton = ({
  children,
  className = "",
  onClick,
  disabled,
}: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.3;
    const y = (clientY - top - height / 2) * 0.3;
    setPos({ x, y });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
    >
      {children}
    </motion.button>
  );
};

// Scroll Reveal Component
const ScrollReveal = ({ children, className = "" }: BaseProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Floating Card
const FloatingCard = ({ children, className = "", delay = 0 }: BaseProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
  >
    {children}
  </motion.div>
);

// Counter Animation
const Counter = ({ end, suffix = "", prefix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// Grid Pattern Background
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

// 3D Credential Card
const CredentialCard3D = () => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * 10;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="flex justify-center items-center py-12"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={cardRef}
        className="relative w-80 h-48 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl p-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/20 backdrop-blur-xl"
          style={{
            transform: "translateZ(20px)",
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)",
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-zinc-400 mb-1">VERIFIED CREDENTIAL</p>
              <h3 className="text-xl font-bold">Computer Science</h3>
              <p className="text-sm text-zinc-400">Bachelor's Degree</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-8 flex justify-between items-end">
            <div>
              <p className="text-xs text-zinc-400 mb-1">ISSUED BY</p>
              <p className="text-sm font-semibold">MIT University</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">VERIFIED</span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 opacity-10">
            <Shield className="w-24 h-24" />
          </div>
        </div>

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
            transform: "translateZ(21px)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>
    </div>
  );
};

// Holographic Text
const HolographicText = ({ children, className = "" }: BaseProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const gradientAngle = (mousePosition.x / 10) % 360;

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(${gradientAngle}deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)`,
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
};

// Live Verification Demo
const LiveVerificationDemo = () => {
  const [step, setStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const steps = [
    { label: "Upload Credential", icon: FileCheck, color: "#3b82f6" },
    { label: "Blockchain Verification", icon: Shield, color: "#8b5cf6" },
    { label: "Instant Approval", icon: CheckCircle, color: "#10b981" },
  ];

  const startDemo = () => {
    setIsVerifying(true);
    setStep(0);

    setTimeout(() => setStep(1), 1000);
    setTimeout(() => setStep(2), 2500);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(0);
    }, 4000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-white/[0.02] border border-white/5">
      <h3 className="text-2xl font-bold mb-6 text-center">See It In Action</h3>

      <div className="relative h-48 mb-8">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                // FIX: Changed opacity from 0.3 to 0 to prevent text overlap
                opacity: step === i ? 1 : 0,
                scale: step === i ? 1 : 0.8,
                y: step === i ? 0 : 20,
              }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3 mx-auto"
                style={{
                  backgroundColor: `${s.color}20`,
                  border: `2px solid ${s.color}${step === i ? "ff" : "40"}`,
                }}
              >
                <StepIcon className="w-12 h-12" style={{ color: s.color }} />
              </div>
              <p className="text-center text-sm font-semibold">{s.label}</p>
            </motion.div>
          );
        })}

        {isVerifying && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div
              className="absolute inset-0 rounded-full border-2 border-blue-500/30"
              style={{
                animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
          </motion.div>
        )}
      </div>

      <div className="flex justify-center">
        <MagneticButton
          onClick={startDemo}
          disabled={isVerifying}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? "Verifying..." : "Try Demo →"}
        </MagneticButton>
      </div>

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
        >
          <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm text-emerald-400 font-semibold">
            Credential Verified Successfully!
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Hash: 0x7a8f...9c2d • Block: #1847392
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Animated Data Flow
const DataFlowAnimation = () => {
  return (
    <div className="relative h-32 my-12">
      <svg className="w-full h-full" viewBox="0 0 800 100">
        <motion.path
          d="M 100 50 Q 250 50 400 50 Q 550 50 700 50"
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[
          { x: 100, color: "#8b5cf6" },
          { x: 400, color: "#3b82f6" },
          { x: 700, color: "#10b981" },
        ].map((node, i) => (
          <g key={i}>
            <motion.circle
              cx={node.x}
              cy="50"
              r="20"
              fill={`${node.color}20`}
              stroke={node.color}
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: i * 0.3, duration: 0.5 }}
            />
            <motion.circle
              cx={node.x}
              cy="50"
              r="20"
              fill="none"
              stroke={node.color}
              strokeWidth="2"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ delay: i * 0.3, duration: 1.5, repeat: Infinity }}
            />
          </g>
        ))}
      </svg>

      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
        initial={{ left: "12.5%" }}
        animate={{ left: ["12.5%", "50%", "87.5%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// Testimonial Carousel
const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Graduate",
      institution: "Stanford University",
      text: "Finally, I own my credentials! No more waiting weeks for verification. Employers can verify my degree instantly.",
      avatar: "SC",
      color: "#3b82f6",
    },
    {
      name: "Dr. James Wilson",
      role: "Dean of Admissions",
      institution: "MIT",
      text: "Skill-Z has revolutionized how we issue credentials. Tamper-proof, instant, and students love the ownership model.",
      avatar: "JW",
      color: "#8b5cf6",
    },
    {
      name: "Maria Rodriguez",
      role: "HR Director",
      institution: "TechCorp",
      text: "Verification went from 2-4 weeks to 2 seconds. This is the future of credential verification.",
      avatar: "MR",
      color: "#10b981",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-center mb-12">
        What People Are Saying
      </h3>

      <div className="relative h-80">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 h-full flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                  "{testimonials[current].text}"
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{
                    backgroundColor: `${testimonials[current].color}20`,
                    color: testimonials[current].color,
                  }}
                >
                  {testimonials[current].avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonials[current].name}</p>
                  <p className="text-sm text-zinc-400">
                    {testimonials[current].role}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {testimonials[current].institution}
                  </p>
                </div>
                <div className="ml-auto">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-blue-500 w-8" : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 backdrop-blur-xl bg-black/20 border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-xl">Skill-Z</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm hover:text-white transition-colors text-zinc-400"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm hover:text-white transition-colors text-zinc-400"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="text-sm hover:text-white transition-colors text-zinc-400"
          >
            About
          </a>
          <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors">
            Launch App
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 bg-zinc-950/90 backdrop-blur-md"
          >
            <div className="flex flex-col gap-4 px-6">
              <a href="#features" className="text-sm text-zinc-400">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-zinc-400">
                How It Works
              </a>
              <a href="#about" className="text-sm text-zinc-400">
                About
              </a>
              <button className="px-6 py-2 bg-white/10 rounded-full text-sm font-semibold w-full">
                Launch App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Main Component
export default function SkillZLanding() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const stats = [
    {
      value: 34,
      label: "Resume Fraud Rate",
      suffix: "%",
      color: "text-red-400",
    },
    {
      value: 4,
      label: "Week Verification Time",
      prefix: "",
      suffix: "+",
      color: "text-amber-400",
    },
    { value: 0, label: "Data Ownership", suffix: "%", color: "text-red-500" },
    {
      value: 600,
      label: "Market Opportunity",
      prefix: "$",
      suffix: "B",
      color: "text-emerald-400",
    },
  ];

  const problems = [
    {
      icon: AlertCircle,
      title: "Resume Fraud",
      desc: "34% of resumes contain falsified credentials, costing employers billions annually",
      gradient: "from-red-500/20 to-transparent",
    },
    {
      icon: Clock,
      title: "Slow Verification",
      desc: "Educational credentials take 2-4 weeks to verify through traditional channels",
      gradient: "from-amber-500/20 to-transparent",
    },
    {
      icon: Lock,
      title: "No Data Ownership",
      desc: "Your achievements are locked in institutional silos you don't control",
      gradient: "from-purple-500/20 to-transparent",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Tamper-Proof",
      desc: "Immutable blockchain storage with cryptographic signatures",
      color: "#3b82f6",
      size: "large",
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Privacy",
      desc: "Prove credentials without exposing sensitive data",
      color: "#8b5cf6",
    },
    {
      icon: Zap,
      title: "Instant Verification",
      desc: "One-click verification in seconds, not weeks",
      color: "#06b6d4",
    },
    {
      icon: Users,
      title: "DAO Governance",
      desc: "Community-driven protocol evolution",
      color: "#10b981",
    },
    {
      icon: FileCheck,
      title: "Universal Standards",
      desc: "Accept credentials from any trusted issuer",
      color: "#f59e0b",
    },
    {
      icon: TrendingUp,
      title: "True Portability",
      desc: "Export anytime, share selectively, own forever",
      color: "#ec4899",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Institution Issues",
      desc: "Educational institution verifies achievement and mints credential NFT on blockchain",
      color: "#8b5cf6",
    },
    {
      num: "02",
      title: "You Receive",
      desc: "Credential stored in your wallet. You own it forever. No corporation can revoke it.",
      color: "#06b6d4",
    },
    {
      num: "03",
      title: "Instant Proof",
      desc: "Employer verifies on-chain in seconds. No delays. No fraud. No middlemen.",
      color: "#10b981",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#09090b] text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Aurora />
      <GridPattern />

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center justify-items-center lg:justify-items-start">
          {/* Left Column: Text Content */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="relative z-10 text-center lg:text-left w-full"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 mx-auto lg:mx-0"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-zinc-400">
                Web3 Credentials Protocol
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6 leading-[0.9]">
              <SplitText>Own Your</SplitText>
              <br />
              <HolographicText className="text-5xl sm:text-7xl md:text-8xl font-bold">
                <SplitText delay={0.4}>Credentials</SplitText>
              </HolographicText>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-lg sm:text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              <BlurText delay={0.8}>
                Blockchain-verified, tamper-proof credentials with complete
                privacy. The future of education verification starts here.
              </BlurText>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <MagneticButton className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow">
                <span className="flex items-center gap-2">
                  Get Started
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </MagneticButton>
              <MagneticButton className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-colors">
                Read Documentation
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="relative z-10  w-full lg:justify-end scale-200"
          >
            <CredentialCard3D />
          </motion.div>
        </div>

        {/* Scroll Indicator (Absolute Positioned at bottom) */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden lg:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="text-zinc-600" size={32} />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={i}>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors text-center">
                <p
                  className={`text-4xl sm:text-5xl font-bold mb-2 ${stat.color}`}
                >
                  <Counter
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4">
              The Problem <span className="text-zinc-500">We Solve</span>
            </h2>
            <p className="text-zinc-400 text-center mb-16 max-w-2xl mx-auto">
              Current credentialing systems are broken, fragmented, and
              controlled by institutions—not you.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p, i) => {
              const ProblemIcon = p.icon;
              return (
                <FloatingCard
                  key={i}
                  delay={i * 0.1}
                  className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${p.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                  <div className="relative z-10">
                    <ProblemIcon className="w-10 h-10 text-zinc-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </FloatingCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
              Powered by{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Web3
              </span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const FeatureIcon = f.icon;
              return (
                <FloatingCard
                  key={i}
                  delay={i * 0.1}
                  className={`group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all ${
                    f.size === "large" ? "md:row-span-2" : ""
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${f.color}20` }}
                  >
                    <FeatureIcon
                      style={{ color: f.color }}
                      className="w-6 h-6"
                    />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: f.color }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{f.desc}</p>
                  {f.size === "large" && (
                    <motion.div
                      className="mt-6 h-24 rounded-xl overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${f.color}10, ${f.color}05)`,
                      }}
                    >
                      <motion.div
                        className="h-full w-full flex items-center justify-center"
                        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <span
                          className="text-sm font-mono"
                          style={{ color: f.color }}
                        >
                          100% Verified ✓
                        </span>
                      </motion.div>
                    </motion.div>
                  )}
                </FloatingCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
              3 Steps to{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Ownership
              </span>
            </h2>
          </ScrollReveal>

          {/* Animated Data Flow */}
          <DataFlowAnimation />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <FloatingCard key={i} delay={i * 0.15} className="relative">
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div
                    className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center font-bold text-lg"
                    style={{
                      border: `2px solid ${step.color}40`,
                      color: step.color,
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-zinc-700 to-transparent" />
                )}
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Live Verification Demo */}
      <section className="py-24 px-6">
        <ScrollReveal>
          <LiveVerificationDemo />
        </ScrollReveal>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <ScrollReveal>
          <TestimonialCarousel />
        </ScrollReveal>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-6xl font-bold mb-6">
              Ready to Own Your <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Future?
              </span>
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of students and institutions building a more
              transparent credential ecosystem.
            </p>
            <MagneticButton className="px-10 py-5 bg-white text-black rounded-full font-semibold text-lg hover:bg-zinc-200 transition-colors">
              Launch App →
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="font-bold text-sm">S</span>
                </div>
                <span className="font-bold text-xl">Skill-Z</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-xs">
                Own your credentials forever. Tamper-proof blockchain
                verification for the future of education.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "API"] },
              {
                title: "Developers",
                links: ["Documentation", "GitHub", "SDK"],
              },
              { title: "Company", links: ["About", "Blog", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              © 2025 Skill-Z. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
