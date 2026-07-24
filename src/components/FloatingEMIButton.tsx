"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, X, ArrowRight } from "lucide-react";

export default function FloatingEMIButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex items-center">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-16 bg-white rounded-2xl shadow-2xl border border-[#E8ECF0] p-5 w-72"
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
              <h4 className="text-sm font-semibold text-[#1C1D62]">EMI Calculator</h4>
            </div>
            <p className="text-xs text-[#718096] leading-relaxed mb-4">
              Calculate your monthly EMI and view a detailed amortization schedule for your business loan.
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
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#304AC0] to-[#13277E] shadow-xl flex items-center justify-center cursor-pointer border-2 border-white/20 hover:border-[#87B73C]/50 transition-all duration-300">
          <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        {/* Label (visible on larger screens) */}
        <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 hidden lg:block">
          <div className="bg-white text-[#1C1D62] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-md border border-[#E8ECF0] whitespace-nowrap">
            EMI Calc
          </div>
        </div>
      </motion.button>
    </div>
  );
}
