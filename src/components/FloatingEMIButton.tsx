"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, X, ArrowRight } from "lucide-react";

export default function FloatingEMIButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Hide the floating button when the EMI Calculator section (or the dedicated
  // /emi-calculator page hero) is in the viewport — prevents it overlapping
  // the calculator inputs/results on mobile.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const targets: Element[] = [];
    // Home page section
    const section = document.getElementById("emi-calculator");
    if (section) targets.push(section);
    // Dedicated /emi-calculator page section
    const pageSection = document.getElementById("emi-calculator-page");
    if (pageSection) targets.push(pageSection);
    // Any element with the data attribute
    document
      .querySelectorAll("[data-emi-calculator-section]")
      .forEach((el) => targets.push(el));

    if (targets.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // If ANY of the targets is intersecting, hide the floating button.
        const anyVisible = entries.some(
          (e) => e.isIntersecting && e.intersectionRatio > 0.05
        );
        setHidden(anyVisible);
        // Collapse the panel too when hiding, so it doesn't reopen stale.
        if (anyVisible) setIsExpanded(false);
      },
      { threshold: [0, 0.05, 0.25, 0.5] }
    );

    targets.forEach((t) => observerRef.current?.observe(t));

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed top-1/2 right-4 sm:right-6 -translate-y-1/2 z-50 flex items-center"
        >
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-1/2 -translate-y-1/2 right-14 sm:right-16 bg-white rounded-2xl shadow-2xl border border-[#E8ECF0] p-4 sm:p-5 w-60 sm:w-72 max-w-[calc(100vw-5rem)]"
              >
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#F0F4FF] flex items-center justify-center hover:bg-[#E8ECF0] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-3 h-3 text-[#718096]" />
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#304AC0]/10 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-[#304AC0]" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#1C1D62]">
                    EMI Calculator
                  </h4>
                </div>
                <p className="text-xs text-[#718096] leading-relaxed mb-4">
                  Calculate your monthly EMI and view a detailed amortization
                  schedule for your business loan.
                </p>
                <Link href="/emi-calculator" onClick={() => setIsExpanded(false)}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#304AC0] hover:bg-[#13277E] text-white text-xs font-medium uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Calculate Now
                    <ArrowRight className="w-3 h-3" />
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main floating button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative group"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open EMI Calculator"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#304AC0] animate-ping opacity-20" />

            {/* Button */}
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#304AC0] to-[#13277E] shadow-xl flex items-center justify-center cursor-pointer border-2 border-white/20 hover:border-[#87B73C]/50 transition-all duration-300">
              <Calculator className="w-5 h-5 text-white" />
            </div>

            {/* Label (visible on larger screens) */}
            <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 hidden lg:block">
              <div className="bg-white text-[#1C1D62] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-md border border-[#E8ECF0] whitespace-nowrap">
                EMI Calc
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
