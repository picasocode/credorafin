"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Search,
  FileText,
  ShieldCheck,
  MapPin,
  FileCheck,
  Banknote,
  HeadphonesIcon,
} from "lucide-react";

const steps = [
  { icon: Search, title: "Understand Requirement", num: "01", color: "#304AC0", desc: "We listen to your business needs and funding goals." },
  { icon: FileText, title: "Financial Assessment", num: "02", color: "#13277E", desc: "Deep-dive into your financials and credit profile." },
  { icon: ShieldCheck, title: "Pre-Underwriting", num: "03", color: "#1C1D62", desc: "We prepare and strengthen your application." },
  { icon: MapPin, title: "Lender Mapping", num: "04", color: "#304AC0", desc: "Match your profile to the best-fit lenders." },
  { icon: FileCheck, title: "Proposal Structuring", num: "05", color: "#13277E", desc: "Professional proposal positioned for approval." },
  { icon: Banknote, title: "Sanction & Disbursal", num: "06", color: "#1C1D62", desc: "Faster approval with managed follow-ups." },
  { icon: HeadphonesIcon, title: "Client Support Service", num: "07", color: "#87B73C", desc: "Ongoing support beyond disbursal." },
];

export default function ProcessFlow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" className="py-20 md:py-28 bg-[#F7F9FC] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#304AC0]/[0.02]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#87B73C]/[0.03]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            Our Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            From Assessment to Disbursal
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            A structured, disciplined approach that ensures your funding journey is smooth and successful.
          </p>
        </motion.div>

        {/* ── Desktop: Two-row flow with cards ── */}
        <div className="hidden lg:block">
          {/* Top row — Steps 1–4 */}
          <div className="relative">
            <div className="grid grid-cols-4 gap-6">
              {steps.slice(0, 4).map((step, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                >
                  <div className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#304AC0]/20 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${step.color}10` }}
                      >
                        <step.icon className="w-6 h-6" style={{ color: step.color }} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: step.color }}>
                        Step {step.num}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#1C1D62] mb-2">{step.title}</h4>
                    <p className="text-sm text-[#718096] leading-relaxed">{step.desc}</p>
                  </div>
                  {i < 3 && (
                    <div className="absolute top-1/2 -right-3 translate-x-1/2 -translate-y-1/2 z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.8 + i * 0.15 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-[#E8ECF0] flex items-center justify-center shadow-sm">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 4h5M5 1.5L7.5 4 5 6.5" stroke="#304AC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Connector from row 1 to row 2 */}
            <div className="flex justify-end pr-[12.5%] my-4">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
              >
                <div className="w-px h-8 bg-[#304AC0]/20" />
                <div className="w-6 h-6 rounded-full bg-[#13277E]/10 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="#13277E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom row — Steps 5–7 */}
          <div className="relative">
            <div className="grid grid-cols-4 gap-6">
              <div />
              {steps.slice(4).map((step, i) => (
                <motion.div
                  key={i + 4}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 1.5 + i * 0.15 }}
                >
                  <div className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#304AC0]/20 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${step.color}10` }}
                      >
                        <step.icon className="w-6 h-6" style={{ color: step.color }} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: step.color }}>
                        Step {step.num}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#1C1D62] mb-2">{step.title}</h4>
                    <p className="text-sm text-[#718096] leading-relaxed">{step.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="absolute top-1/2 -right-3 translate-x-1/2 -translate-y-1/2 z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 2 + i * 0.15 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-[#E8ECF0] flex items-center justify-center shadow-sm">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 4h5M5 1.5L7.5 4 5 6.5" stroke="#304AC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tablet: 2-column grid ── */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-5 border border-[#E8ECF0] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${step.color}10` }}
                >
                  <step.icon className="w-5 h-5" style={{ color: step.color }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>
                  Step {step.num}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#1C1D62] mb-1">{step.title}</h4>
              <p className="text-xs text-[#718096] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Mobile: Vertical timeline ── */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-xl bg-white border-2 shadow-sm flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: step.color }}
                >
                  <step.icon className="w-5 h-5" style={{ color: step.color }} />
                </div>
                {i < steps.length - 1 && (
                  <motion.div
                    className="w-0.5 flex-1 min-h-[32px]"
                    style={{ backgroundColor: `${step.color}20` }}
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  />
                )}
              </div>
              <div className="pb-8 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>Step {step.num}</span>
                <h4 className="text-base font-semibold text-[#1C1D62] mt-0.5">{step.title}</h4>
                <p className="text-sm text-[#718096] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
