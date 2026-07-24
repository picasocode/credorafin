"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Wallet,
  Handshake,
  Target,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  CircleDollarSign,
  FileCheck2,
  HeadphonesIcon,
  Sparkles,
  Rocket,
  BadgeCheck,
  Landmark,
} from "lucide-react";

/**
 * AnimatedIllustration — replaces broken Lottie animations with
 * beautiful SVG / icon-based animated illustrations.
 *
 * Usage:
 *   <AnimatedIllustration theme="business" size={100} />
 *   <AnimatedIllustration theme="shield" size={280} />
 *   <AnimatedIllustration theme="success" size={120} />
 */

type Theme =
  | "business"      // growth / upward trend
  | "shield"        // security / protection
  | "success"       // celebration / checkmark
  | "document"      // paperwork / analysis
  | "support"       // headset / help
  | "chart"         // analytics / bar chart
  | "money"         // finance / dollar
  | "rocket";       // launch / speed

interface AnimatedIllustrationProps {
  theme: Theme;
  size?: number;
  color?: string;
  className?: string;
}

/* ── Shared decorative ring ── */
function DecorativeRing({ size, color, delay = 0 }: { size: number; color: string; delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border-2"
      style={{ borderColor: color }}
      initial={{ scale: 1, opacity: 0.25 }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.08, 0.25] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ── Orbiting dot ── */
function OrbitDot({ radius, color, duration, delay, size: dotSize = 6 }: { radius: number; color: string; duration: number; delay: number; size?: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: dotSize, height: dotSize, backgroundColor: color, top: "50%", left: "50%" }}
      animate={{
        x: [0, radius, 0, -radius, 0],
        y: [-radius, 0, radius, 0, -radius],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Floating badge ── */
function FloatingBadge({ icon: Icon, color, x, y, delay = 0 }: { icon: React.ElementType; color: string; x: string; y: string; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-xl shadow-lg flex items-center justify-center bg-white border border-[#E8ECF0]"
      style={{ width: 44, height: 44, left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      transition={{ opacity: { duration: 0.4, delay }, scale: { duration: 0.4, delay }, y: { duration: 3, delay, repeat: Infinity, ease: "easeInOut" } }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
    </motion.div>
  );
}

/* ── Main component ── */
export default function AnimatedIllustration({ theme, size = 200, color = "#304AC0", className = "" }: AnimatedIllustrationProps) {
  const half = size / 2;

  const themeMap: Record<Theme, () => React.ReactNode> = {
    business: () => (
      <div className="relative" style={{ width: size, height: size }}>
        <DecorativeRing size={size} color={`${color}30`} />
        <DecorativeRing size={size} color={`${color}15`} delay={1} />
        {/* Central icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
            <TrendingUp className="w-10 h-10" style={{ color }} />
          </div>
        </motion.div>
        {/* Floating badges */}
        <FloatingBadge icon={BarChart3} color="#13277E" x="5%" y="10%" delay={0.3} />
        <FloatingBadge icon={Wallet} color="#87B73C" x="70%" y="15%" delay={0.5} />
        <FloatingBadge icon={ArrowUpRight} color={color} x="10%" y="70%" delay={0.7} />
        <FloatingBadge icon={CircleDollarSign} color="#1C1D62" x="72%" y="68%" delay={0.9} />
        {/* Orbit dots */}
        <OrbitDot radius={half * 0.65} color={`${color}40`} duration={8} delay={0} size={5} />
        <OrbitDot radius={half * 0.45} color="#87B73C40" duration={6} delay={2} size={4} />
      </div>
    ),

    shield: () => (
      <div className="relative" style={{ width: size, height: size }}>
        <DecorativeRing size={size} color={`${color}25`} />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
            <ShieldCheck className="w-10 h-10" style={{ color }} />
          </div>
        </motion.div>
        <FloatingBadge icon={BadgeCheck} color="#87B73C" x="5%" y="12%" delay={0.3} />
        <FloatingBadge icon={FileCheck2} color={color} x="72%" y="10%" delay={0.5} />
        <FloatingBadge icon={Landmark} color="#1C1D62" x="8%" y="68%" delay={0.7} />
        <FloatingBadge icon={Target} color="#13277E" x="70%" y="70%" delay={0.9} />
        <OrbitDot radius={half * 0.6} color={`${color}35`} duration={7} delay={0} size={5} />
      </div>
    ),

    success: () => (
      <div className="relative" style={{ width: size, height: size }}>
        <DecorativeRing size={size} color="#87B73C25" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center bg-[#87B73C]/10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <CheckCircle2 className="w-10 h-10 text-[#87B73C]" />
          </motion.div>
        </motion.div>
        {/* Sparkles around */}
        <motion.div className="absolute" style={{ left: "15%", top: "20%" }} animate={{ opacity: [0.3, 1, 0.3], rotate: [0, 180, 360] }} transition={{ duration: 4, repeat: Infinity }}>
          <Sparkles className="w-5 h-5" style={{ color: "#87B73C" }} />
        </motion.div>
        <motion.div className="absolute" style={{ right: "15%", top: "25%" }} animate={{ opacity: [0.3, 1, 0.3], rotate: [360, 180, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Sparkles className="w-4 h-4" style={{ color }} />
        </motion.div>
        <motion.div className="absolute" style={{ left: "20%", bottom: "20%" }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>
          <BadgeCheck className="w-5 h-5 text-[#87B73C]" />
        </motion.div>
      </div>
    ),

    document: () => (
      <div className="relative" style={{ width: size, height: size }}>
        <DecorativeRing size={size} color={`${color}20`} />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
            <FileCheck2 className="w-10 h-10" style={{ color }} />
          </div>
        </motion.div>
        <FloatingBadge icon={BarChart3} color="#13277E" x="5%" y="10%" delay={0.3} />
        <FloatingBadge icon={Target} color="#87B73C" x="72%" y="15%" delay={0.5} />
        <FloatingBadge icon={CheckCircle2} color={color} x="8%" y="68%" delay={0.7} />
        <OrbitDot radius={half * 0.55} color={`${color}30`} duration={7} delay={0} size={4} />
      </div>
    ),

    support: () => (
      <div className="relative" style={{ width: size, height: size }}>
        <DecorativeRing size={size} color={`${color}25`} />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
            <HeadphonesIcon className="w-10 h-10" style={{ color }} />
          </div>
        </motion.div>
        <FloatingBadge icon={Zap} color="#87B73C" x="5%" y="12%" delay={0.3} />
        <FloatingBadge icon={Handshake} color="#13277E" x="72%" y="10%" delay={0.5} />
        <FloatingBadge icon={BadgeCheck} color={color} x="8%" y="68%" delay={0.7} />
        <OrbitDot radius={half * 0.6} color={`${color}30`} duration={8} delay={0} size={5} />
      </div>
    ),

    chart: () => (
      <div className="relative" style={{ width: size, height: size }}>
        <DecorativeRing size={size} color={`${color}20`} />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
            <BarChart3 className="w-10 h-10" style={{ color }} />
          </div>
        </motion.div>
        {/* Mini bar chart animation */}
        <div className="absolute bottom-[22%] left-[22%] flex items-end gap-1.5">
          {[0.4, 0.65, 0.85, 0.55, 1].map((h, i) => (
            <motion.div
              key={i}
              className="w-2.5 rounded-t"
              style={{ backgroundColor: i % 2 === 0 ? color : "#87B73C" }}
              initial={{ height: 0 }}
              animate={{ height: h * 28 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
            />
          ))}
        </div>
        <FloatingBadge icon={TrendingUp} color="#87B73C" x="68%" y="12%" delay={0.5} />
        <OrbitDot radius={half * 0.5} color={`${color}30`} duration={9} delay={1} size={4} />
      </div>
    ),

    money: () => (
      <div className="relative" style={{ width: size, height: size }}>
        <DecorativeRing size={size} color={`${color}25`} />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
            <CircleDollarSign className="w-10 h-10" style={{ color }} />
          </div>
        </motion.div>
        <FloatingBadge icon={Wallet} color="#87B73C" x="5%" y="12%" delay={0.3} />
        <FloatingBadge icon={Landmark} color="#13277E" x="72%" y="10%" delay={0.5} />
        <FloatingBadge icon={ArrowUpRight} color={color} x="8%" y="68%" delay={0.7} />
        <OrbitDot radius={half * 0.55} color={`${color}30`} duration={7} delay={0} size={5} />
      </div>
    ),

    rocket: () => (
      <div className="relative" style={{ width: size, height: size }}>
        <DecorativeRing size={size} color={`${color}25`} />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${color}12` }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rocket className="w-10 h-10" style={{ color }} />
          </motion.div>
        </motion.div>
        <FloatingBadge icon={Zap} color="#87B73C" x="5%" y="12%" delay={0.3} />
        <FloatingBadge icon={Sparkles} color={color} x="72%" y="10%" delay={0.5} />
        <FloatingBadge icon={Target} color="#13277E" x="8%" y="68%" delay={0.7} />
        <OrbitDot radius={half * 0.6} color={`${color}30`} duration={6} delay={0} size={4} />
      </div>
    ),
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {themeMap[theme]()}
    </div>
  );
}
