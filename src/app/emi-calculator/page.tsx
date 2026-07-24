"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Calculator, ShieldCheck, Clock, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import EMICalculator from "@/components/EMICalculator";
import { SmoothReveal } from "@/lib/animations";

const trustBadges = [
  { icon: ShieldCheck, label: "Free Assessment", color: "text-[#304AC0]" },
  { icon: Clock, label: "1 Business Day Response", color: "text-[#87B73C]" },
  { icon: Ban, label: "No Obligation", color: "text-[#13277E]" },
];

export default function EMICalculatorPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1D62] via-[#13277E] to-[#304AC0] py-16 md:py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#87B73C]/[0.05] rounded-full translate-y-1/2 -translate-x-1/2" />
          <motion.div
            className="absolute top-20 right-[15%] w-3 h-3 rounded-full bg-[#87B73C]/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-[20%] w-2 h-2 rounded-full bg-white/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 text-[#87B73C] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 mb-6">
              <Calculator className="w-3.5 h-3.5" />
              EMI Calculator
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, type: "spring", stiffness: 80 }}
          >
            Calculate Your Loan EMI
          </motion.h1>

          <motion.p
            className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 80 }}
          >
            Plan your loan repayment with our free EMI calculator. Enter your loan
            amount, interest rate, and tenure to view a detailed amortization
            schedule with month-by-month principal and interest breakup.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                <badge.icon className={`w-4 h-4 ${badge.color}`} />
                {badge.label}
              </div>
            ))}
          </motion.div>

          {/* Breadcrumb */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-1 text-xs text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">EMI Calculator</span>
          </motion.div>
        </div>
      </section>

      {/* EMI Calculator Component */}
      <EMICalculator />

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#1C1D62] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-64 h-64 bg-[#304AC0]/10 rounded-full -translate-y-1/2" />
          <div className="absolute bottom-0 right-[15%] w-48 h-48 bg-[#87B73C]/10 rounded-full translate-y-1/2" />
        </div>
        <SmoothReveal className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
            Need Help Structuring Your Loan?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Our advisors can help you find the best loan terms, negotiate lower interest
            rates, and structure your application for maximum approval chances.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-8 py-3.5 rounded-md shadow-xl group transition-all duration-300">
                  Get Free Consultation
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/services/pre-underwriting-loan-structuring">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-medium text-sm uppercase tracking-wider px-8 py-3.5 rounded-md transition-all duration-300"
              >
                Learn About Pre-Underwriting
              </Button>
            </Link>
          </div>
        </SmoothReveal>
      </section>
    </>
  );
}
