"use client";

import React, { useRef, useCallback, useState } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function SectionReveal({ children, className = "", delay = 0, direction = "up" }: SectionRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className = "", staggerDelay = 0.1 }: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`h-full ${className}`}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`h-full ${className}`}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// Parallax scroll effect
export function ParallaxSection({ children, className = "", speed = 0.3 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100]);

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

// Scale on scroll reveal
export function ScaleReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// Slide in from side with fade
export function SlideReveal({ children, className = "", direction = "left", delay = 0 }: { children: React.ReactNode; className?: string; direction?: "left" | "right"; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: direction === "left" ? -80 : 80 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// Counter animation with trigger
export function CountUp({ target, suffix = "", prefix = "", className = "" }: { target: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}{count}{suffix}
    </span>
  );
}

// Floating animation for decorative elements
export function FloatingElement({ children, className = "", amplitude = 10, duration = 3 }: { children: React.ReactNode; className?: string; amplitude?: number; duration?: number }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// Pulse glow effect
export function PulseGlow({ children, className = "", color = "#304AC0" }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 0px ${color}00`,
          `0 0 20px ${color}30`,
          `0 0 0px ${color}00`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// Typewriter text effect
export function TypewriterText({ text, className = "", speed = 50 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayedText, setDisplayedText] = React.useState("");

  React.useEffect(() => {
    if (!isInView) return;
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [isInView, text, speed]);

  return <span ref={ref} className={className}>{displayedText}</span>;
}

// Animated border/drawing effect
export function DrawBorder({ children, className = "", color = "#304AC0" }: { children: React.ReactNode; className?: string; color?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// Stagger list items with connecting lines
export function ConnectedList({ items, className = "" }: { items: { title: string; desc: string }[]; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={className}>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className="flex items-start gap-4 relative"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#304AC0] flex items-center justify-center text-white text-xs font-bold">
              {idx + 1}
            </div>
            {idx < items.length - 1 && (
              <div className="w-0.5 h-8 bg-[#304AC0] opacity-20" />
            )}
          </div>
          <div className="pb-6">
            <h4 className="font-semibold text-[#1C1D62] mb-1">{item.title}</h4>
            <p className="text-sm text-[#718096] leading-relaxed">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================
   NEW PREMIUM ANIMATION COMPONENTS
   ============================================ */

// SmoothReveal — A gentler version of SectionReveal with longer duration and cubic-bezier easing
interface SmoothRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function SmoothReveal({ children, className = "", delay = 0, direction = "up" }: SmoothRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const directionMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1], // custom cubic-bezier for a smooth, luxurious feel
      }}
    >
      {children}
    </motion.div>
  );
}

// ImageReveal — For images: fades in with slight scale from 0.95 to 1
interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ImageReveal({ children, className = "", delay = 0 }: ImageRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// TextReveal — Text slides up with a clip-path mask effect
interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        clipPath: "inset(100% 0% 0% 0%)",
        opacity: 0,
      }}
      animate={
        isInView
          ? {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
            }
          : {}
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Card3D — 3D perspective tilt on hover (subtle 2deg)
interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  tiltX?: number;
  tiltY?: number;
  glareOpacity?: number;
}

export function Card3D({
  children,
  className = "",
  tiltX = 2,
  tiltY = 2,
}: Card3DProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltX, -tiltX]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltY, tiltY]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(px);
      y.set(py);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 800,
        rotateX,
        rotateY,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// MagneticHover — Slight magnetic pull toward cursor on hover
interface MagneticHoverProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticHover({ children, className = "", strength = 0.3 }: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * strength;
      const dy = (e.clientY - centerY) * strength;
      setPosition({ x: dx, y: dy });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 15, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

// StaggerList — Stagger animation for list items with connecting lines
interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  lineColor?: string;
  lineWidth?: string;
}

export function StaggerList({
  children,
  className = "",
  staggerDelay = 0.12,
  lineColor = "#304AC0",
  lineWidth = "2px",
}: StaggerListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
    >
      {React.Children.map(children, (child, idx) => (
        <div className="flex items-stretch gap-4">
          {/* Connecting line + dot */}
          <div className="flex flex-col items-center flex-shrink-0">
            <motion.div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: lineColor }}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            />
            {idx < React.Children.count(children) - 1 && (
              <motion.div
                className="flex-1 min-h-[24px]"
                style={{
                  width: lineWidth,
                  backgroundColor: lineColor,
                  opacity: 0.2,
                }}
                variants={{
                  hidden: { scaleY: 0 },
                  visible: {
                    scaleY: 1,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                style-origin="top"
              />
            )}
          </div>
          {/* Content */}
          <motion.div
            className="flex-1 pb-6"
            variants={{
              hidden: { opacity: 0, x: -16 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {child}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

// WaveReveal — Elements appear in a wave pattern (left to right, with sine delay)
interface WaveRevealProps {
  children: React.ReactNode;
  className?: string;
  baseDelay?: number;
  waveSpeed?: number;
  amplitude?: number;
}

export function WaveReveal({
  children,
  className = "",
  baseDelay = 0,
  waveSpeed = 0.15,
  amplitude = 0.5,
}: WaveRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const childCount = React.Children.count(children);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: waveSpeed,
            delayChildren: baseDelay,
          },
        },
      }}
    >
      {React.Children.map(children, (child, idx) => {
        // Sine-based delay for wave effect
        const sineDelay = Math.sin((idx / Math.max(childCount - 1, 1)) * Math.PI * amplitude) * 0.2;

        return (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24, scale: 0.96 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.7,
                  delay: sineDelay,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
