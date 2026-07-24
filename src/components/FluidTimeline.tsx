"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, ClipboardList, Rocket, HeartHandshake, CheckCircle, FileText, Target } from "lucide-react";

interface Step {
  id: number;
  title: string;
  desc: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: 1, title: "Understand Requirement", desc: "Listen to business needs.", icon: Search },
  { id: 2, title: "Financial Assessment", desc: "Deep-Dive into Your Financials and Credit Profile", icon: ClipboardList },
  { id: 3, title: "Pre-Underwriting", desc: "We analyse and strengthen your application.", icon: FileText },
  { id: 4, title: "Lender Mapping", desc: "Match profile.", icon: Target },
  { id: 5, title: "Proposal Structuring", desc: "Professional proposal.", icon: Rocket },
  { id: 6, title: "Sanction & Disbursal", desc: "Faster approval.", icon: CheckCircle },
  { id: 7, title: "Client Support", desc: "Ongoing support.", icon: HeartHandshake },
];

export default function FluidTimeline() {
  return (
    <div className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#1C1D62] mb-20">Our Process</h2>
        
        <div className="relative">
          {/* Animated SVG Wave Path */}
          <div className="absolute top-16 left-0 right-0 hidden lg:block h-32 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
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

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Node */}
                <div className="w-16 h-16 rounded-full bg-white border-4 border-[#304AC0] flex items-center justify-center text-[#304AC0] shadow-lg mb-4 hover:bg-[#304AC0] hover:text-white transition-colors duration-300">
                  <step.icon className="w-7 h-7" />
                </div>
                
                {/* Number */}
                <div className="text-xl font-black text-[#1C1D62] mb-2">0{step.id}</div>
                
                {/* Card */}
                <div className="p-5 rounded-2xl border border-[#E8ECF0] bg-white shadow-sm hover:shadow-xl transition-all duration-300 w-full min-h-[160px]">
                  <h4 className="font-bold text-[#1C1D62] text-sm mb-2">{step.title}</h4>
                  <p className="text-[11px] text-[#718096] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
