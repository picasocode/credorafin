"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ClipboardList, Rocket, HeartHandshake, CheckCircle } from "lucide-react";

interface Step {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: "01", title: "Credit Report Analysis", desc: "Obtain and thoroughly analyse all types of Credit Bureau reports for errors and negative entries", icon: Search },
  { id: "02", title: "Issue Identification", desc: "Categorize all issues — incorrect info, duplicate accounts, outdated defaults, unauthorized enquiries", icon: ClipboardList },
  { id: "03", title: "Dispute Filing", desc: "File structured disputes with credit bureaus and coordinate corrections with lenders", icon: Rocket },
  { id: "04", title: "Follow-Up", desc: "Track dispute resolution with bureaus and lenders, ensuring timely corrections", icon: HeartHandshake },
  { id: "05", title: "Score Update", desc: "Confirm updated scores and provide a clean credit report for loan applications", icon: CheckCircle },
];

export default function ServicesProcess() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="py-24 bg-[#F7F9FC] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-[#1C1D62] mb-4">Our Process</h2>
          <p className="text-[#718096] max-w-xl mx-auto">A systematic, transparent approach to improving your credit profile — from initial analysis to confirmed score updates.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* List of Steps */}
          <div className="flex-1 space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`p-6 rounded-2xl cursor-pointer border-l-4 transition-all duration-300 ${activeStep === index ? "bg-white border-[#304AC0] shadow-md" : "bg-transparent border-transparent hover:bg-white hover:border-[#E8ECF0]"}`}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-black ${activeStep === index ? "text-[#304AC0]" : "text-[#CBD5E0]"}`}>
                    {step.id}
                  </div>
                  <h3 className="font-bold text-[#1C1D62] text-lg">{step.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Active Step Display */}
          <div className="flex-1 lg:pl-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                className="bg-white p-10 rounded-3xl shadow-xl border border-[#E8ECF0] h-full flex flex-col justify-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-[#F0F4FF] flex items-center justify-center mb-8 text-[#304AC0]">
                  {React.createElement(steps[activeStep].icon, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-2xl font-bold text-[#1C1D62] mb-4">{steps[activeStep].title}</h3>
                <p className="text-[#718096] leading-relaxed text-lg">{steps[activeStep].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
