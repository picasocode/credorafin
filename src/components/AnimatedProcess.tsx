"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ClipboardList, Rocket, HeartHandshake, CheckCircle } from "lucide-react";

interface Step {
  id: number;
  title: string;
  desc: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: 1, title: "Credit Report Analysis", desc: "Obtain and thoroughly analyse all types of Credit Bureau reports for errors and negative entries", icon: Search },
  { id: 2, title: "Issue Identification", desc: "Categorize all issues — incorrect info, duplicate accounts, outdated defaults, unauthorized enquiries", icon: ClipboardList },
  { id: 3, title: "Dispute Filing", desc: "File structured disputes with credit bureaus and coordinate corrections with lenders", icon: Rocket },
  { id: 4, title: "Follow-Up", desc: "Track dispute resolution with bureaus and lenders, ensuring timely corrections", icon: HeartHandshake },
  { id: 5, title: "Score Update", desc: "Confirm updated scores and provide a clean credit report for loan application", icon: CheckCircle },
];

export default function AnimatedProcess() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="py-24 bg-white relative overflow-hidden">
      {/* Animated Background Curved Line */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
          <motion.path
            d="M 0 150 Q 250 50, 500 150 T 1000 150"
            fill="none"
            stroke="#304AC0"
            strokeWidth="4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold text-[#1C1D62] text-center mb-16">Our Credit Repair Process</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeStep === step.id ? "bg-[#F0F4FF] border-[#304AC0]" : "bg-white border-[#E8ECF0] hover:border-[#304AC0]/50"
              }`}
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.id * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-[#F0F4FF] flex items-center justify-center mb-4 text-[#304AC0]">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-[#1C1D62] mb-2">{step.title}</h3>
              <AnimatePresence>
                {activeStep === step.id && (
                  <motion.p
                    className="text-sm text-[#718096]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {step.desc}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="absolute top-2 right-2 text-4xl font-black text-[#E8ECF0] opacity-50">
                0{step.id}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
