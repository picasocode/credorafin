"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  ClipboardList,
  Rocket,
  HeartHandshake,
  CheckCircle,
  FileText,
  Target,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  desc: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: 1, title: "Understand Requirement", desc: "We listen to your business needs and funding goals", icon: Search },
  { id: 2, title: "Financial Assessment", desc: "Deep-dive into your financials and credit profile.", icon: ClipboardList },
  { id: 3, title: "Pre-Underwriting", desc: "We analyse and strengthen your application.", icon: FileText },
  { id: 4, title: "Lender Mapping", desc: "Match your profile to the best-fit lenders.", icon: Target },
  { id: 5, title: "Proposal Structuring", desc: "Professional approach tailored to lender criteria.", icon: Rocket },
  { id: 6, title: "Sanction & Disbursal", desc: "Faster approval with managed follow-ups.", icon: CheckCircle },
  { id: 7, title: "Client Support", desc: "Ongoing support beyond disbursal.", icon: HeartHandshake },
];

export default function FluidTimeline() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1D62] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Process
          </motion.h2>
          <motion.p
            className="mt-3 sm:mt-4 text-sm sm:text-base text-[#718096] max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            A streamlined 7-step journey from understanding your needs to ongoing client support.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop wave path (lg+ only) */}
          <div className="absolute top-14 left-0 right-0 hidden xl:block h-32 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 0 50 Q 125 0, 250 50 T 500 50 T 750 50 T 1000 50"
                fill="none"
                stroke="#E8ECF0"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </svg>
          </div>

          {/*
            Flex-wrap with justify-center guarantees that any partial last row
            (e.g. 3 items left over on a 4-col layout, or a single orphan on a
            2-col layout) is horizontally centered instead of left-aligned.
            Widths are calculated to exactly fill each row given the gap-6 (1.5rem)
            gutter, so full rows are also perfectly aligned.
          */}
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="group flex flex-col items-center text-center w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] xl:w-[calc((100%-9rem)/7)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                {/* Node */}
                <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-4 border-[#304AC0] flex items-center justify-center text-[#304AC0] shadow-lg group-hover:bg-[#304AC0] group-hover:text-white transition-colors duration-300">
                  <step.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                {/* Number */}
                <div className="text-base sm:text-lg lg:text-xl font-black text-[#1C1D62] mt-3 mb-2">
                  0{step.id}
                </div>

                {/* Card */}
                <div className="p-4 sm:p-5 rounded-2xl border border-[#E8ECF0] bg-white shadow-sm group-hover:shadow-xl group-hover:border-[#304AC0]/30 transition-all duration-300 w-full min-h-[130px] sm:min-h-[150px] flex flex-col">
                  <h4 className="font-bold text-[#1C1D62] text-sm sm:text-base mb-1.5 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#718096] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
