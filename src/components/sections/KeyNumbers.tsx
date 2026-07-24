"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  sublabel?: string;
}

function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2, label, sublabel }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-base sm:text-lg text-white/90 font-medium">{label}</div>
      {sublabel && <div className="text-sm text-white/60 mt-1">{sublabel}</div>}
    </motion.div>
  );
}

const stats = [
  { end: 20, suffix: "+", label: "Years of Combined Experience", sublabel: "Industry expertise" },
  { end: 70, suffix: "+", label: "Banks and NBFCs Associated", sublabel: "Pan-India network" },
  { end: 1200, suffix: "+", label: "Happy Clients", sublabel: "Across India" },
  { end: 20, suffix: "+", label: "Funding Products", sublabel: "Tailored solutions" },
];

export default function KeyNumbers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="key-numbers" className="py-20 md:py-28 bg-[#1C1D62] relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#304AC0]/10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#87B73C]/10"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#87B73C] text-xs font-semibold uppercase tracking-widest mb-4">
            Key Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Numbers That Speak
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <AnimatedCounter key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
