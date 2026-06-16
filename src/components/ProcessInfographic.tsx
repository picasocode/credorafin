"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Search,
  FileSearch,
  Send,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";

/* ── Types ── */
export interface InfographicStep {
  /** Lucide icon component — falls back to index-based icon if omitted */
  icon?: LucideIcon;
  /** Step title — supports both "label" and "title" for flexibility */
  label?: string;
  /** Alias for label (backward compat) */
  title?: string;
  /** Step description */
  desc: string;
}

export interface InfographicProps {
  steps: InfographicStep[];
  /** Primary brand color (hex) — defaults to #304AC0 */
  color?: string;
  /** Alias for color (backward compat) */
  accentColor?: string;
  /** Optional section heading */
  heading?: string;
  /** Alias for heading (backward compat) */
  title?: string;
  /** Optional section sub-text */
  subtext?: string;
  /** Alias for subtext (backward compat) */
  subtitle?: string;
  /** Background class for the section wrapper */
  bgClass?: string;
  /** Compact mode — shorter cards (for detail pages) */
  compact?: boolean;
}

/* ── Fallback icons when no icon is provided ── */
const fallbackIcons: LucideIcon[] = [Search, FileSearch, Send, CheckCircle, Search, FileSearch, Send];

/* ── Brand palette ── */
const BRAND = {
  primary: "#304AC0",
  deep: "#13277E",
  accent: "#87B73C",
  dark: "#1C1D62",
  textMuted: "#718096",
  textDark: "#1C1D62",
  border: "#E8ECF0",
};

/** Step number colors cycle */
const stepColors: string[] = [BRAND.primary, BRAND.deep, BRAND.accent, BRAND.dark];

function getStepColor(idx: number): string {
  return stepColors[idx % stepColors.length];
}

/** Resolve step label from either label or title field */
function stepLabel(step: InfographicStep): string {
  return step.label || step.title || "";
}

/** Resolve step icon, falling back to index-based icon */
function stepIcon(step: InfographicStep, idx: number): LucideIcon {
  return step.icon || fallbackIcons[idx % fallbackIcons.length];
}

/** Resolve the primary color prop */
function resolveColor(color?: string, accentColor?: string): string {
  return color || accentColor || BRAND.primary;
}

/* ── Desktop Connector Arrow ── */
function ConnectorArrow({ color }: { color: string }) {
  return (
    <div className="hidden lg:flex items-center flex-shrink-0 w-10 xl:w-14">
      <svg
        className="w-full"
        height="12"
        viewBox="0 0 56 12"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Thin line */}
        <line x1="0" y1="6" x2="46" y2="6" stroke={BRAND.border} strokeWidth="1.5" />
        {/* Arrow head */}
        <path
          d="M42 2 L50 6 L42 10"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

/* ── Desktop Step Card ── */
function DesktopStepCard({
  step,
  idx,
  total,
  color,
  compact,
  isInView,
}: {
  step: InfographicStep;
  idx: number;
  total: number;
  color: string;
  compact: boolean;
  isInView: boolean;
}) {
  const stepColor = getStepColor(idx);
  const iconType = stepIcon(step, idx);
  const label = stepLabel(step);

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ width: `calc((100% - ${(total - 1) * 56}px) / ${total})` }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + idx * 0.1, ease: "easeOut" }}
    >
      <div className="relative bg-white rounded-lg border border-[#E8ECF0] shadow-sm overflow-hidden h-full group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#D0D8E8]">
        {/* Top accent border */}
        <div
          className="h-[3px] w-full"
          style={{ backgroundColor: stepColor }}
        />

        <div className={compact ? "p-4" : "p-5"}>
          {/* Step number + icon row */}
          <div className="flex items-center gap-3 mb-3">
            {/* Clean circular step number */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: stepColor }}
            >
              <span className="text-white text-sm font-semibold">{idx + 1}</span>
            </div>
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stepColor}10` }}
            >
              {React.createElement(iconType, { className: "w-4 h-4", style: { color: stepColor } })}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold mb-1" style={{ color: BRAND.textDark }}>
            {label}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#718096] leading-relaxed">{step.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Mobile Step Card (vertical timeline) ── */
function MobileStepCard({
  step,
  idx,
  total,
  isInView,
}: {
  step: InfographicStep;
  idx: number;
  total: number;
  color: string;
  isInView: boolean;
}) {
  const stepColor = getStepColor(idx);
  const label = stepLabel(step);

  return (
    <motion.div
      className="flex items-start gap-4 relative"
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.08 + idx * 0.08, ease: "easeOut" }}
    >
      {/* Timeline node */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Number circle */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: stepColor }}
        >
          <span className="text-white text-xs font-semibold">{idx + 1}</span>
        </div>
        {/* Connecting line */}
        {idx < total - 1 && (
          <div className="w-px flex-1 min-h-[28px] bg-[#E8ECF0]" />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 bg-white rounded-lg border border-[#E8ECF0] p-4 mb-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
        style={{ borderLeftWidth: "3px", borderLeftColor: stepColor }}
      >
        <h3 className="text-sm font-semibold text-[#1C1D62] mb-1">{label}</h3>
        <p className="text-xs text-[#718096] leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

/* ── Main Component ── */
export default function ProcessInfographic({
  steps,
  color,
  accentColor,
  heading,
  title,
  subtext,
  subtitle,
  bgClass = "bg-[#F7F9FC]",
  compact = false,
}: InfographicProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const resolvedColor = resolveColor(color, accentColor);
  const resolvedHeading = heading || title;
  const resolvedSubtext = subtext || subtitle;

  if (!steps || steps.length === 0) return null;

  return (
    <section className={`py-16 md:py-20 ${bgClass} relative`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {resolvedHeading && (
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-3">
              {resolvedHeading}
            </h2>
          )}
          {resolvedSubtext && (
            <p className="text-[#718096] max-w-xl mx-auto">{resolvedSubtext}</p>
          )}
        </motion.div>

        {/* ── Desktop: Horizontal stepper with clean connectors ── */}
        <div className="hidden lg:flex items-stretch justify-center">
          {steps.map((step, idx) => (
            <React.Fragment key={`step-${idx}`}>
              <DesktopStepCard
                step={step}
                idx={idx}
                total={steps.length}
                color={resolvedColor}
                compact={compact}
                isInView={isInView}
              />
              {idx < steps.length - 1 && (
                <ConnectorArrow color={getStepColor(idx + 1)} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Tablet: 2-column grid ── */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
          {steps.map((step, idx) => {
            const stepColor = getStepColor(idx);
            const iconType = stepIcon(step, idx);
            const label = stepLabel(step);
            return (
              <motion.div
                key={`step-tab-${idx}`}
                className="bg-white rounded-lg border border-[#E8ECF0] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-[#D0D8E8]"
                style={{ borderLeftWidth: "3px", borderLeftColor: stepColor }}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.08 + idx * 0.08, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: stepColor }}
                  >
                    {idx + 1}
                  </div>
                  {React.createElement(iconType, { className: "w-4 h-4 flex-shrink-0", style: { color: resolvedColor } })}
                </div>
                <h3 className="text-sm font-semibold text-[#1C1D62] mb-1">{label}</h3>
                <p className="text-xs text-[#718096] leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Mobile: Clean vertical timeline ── */}
        <div className="md:hidden space-y-0">
          {steps.map((step, idx) => (
            <MobileStepCard
              key={`step-mob-${idx}`}
              step={step}
              idx={idx}
              total={steps.length}
              color={resolvedColor}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
