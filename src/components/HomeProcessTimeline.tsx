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
  { id: 1, title: "Understand Requirement", desc: "We listen to your business needs and funding goals.", icon: Search },
  { id: 2, title: "Financial Assessment", desc: "Deep-Dive into Your Financials and Capitalisation and Credit Profile", icon: ClipboardList },
  { id: 3, title: "Pre-Underwriting", desc: "We prepare and strengthen your application.", icon: FileText },
  { id: 4, title: "Lender Mapping", desc: "Match your profile to the best-fit lenders.", icon: Target },
  { id: 5, title: "Proposal Structuring", desc: "Professional proposal positioned for approval.", icon: Rocket },
  { id: 6, title: "Sanction & Disbursal", desc: "Faster approval with managed follow-ups.", icon: CheckCircle },
  { id: 7, title: "Client Support Service", desc: "Ongoing support beyond disbursal.", icon: HeartHandshake },
];

export default function HomeProcessTimeline() {
  return (
    <div className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#1C1D62] text-center mb-4">Our Process</h2>
        <p className="text-[#718096] text-center mb-16 max-w-2xl mx-auto">From Assessment to Disbursal — a structured, disciplined approach.</p>
        
        <div className="flex flex-wrap justify-center gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(14.28%-20px)] p-6 rounded-3xl border border-[#E8ECF0] bg-white shadow-sm hover:shadow-2xl transition-all duration-300 hover:border-[#304AC0] group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F0F4FF] flex items-center justify-center mb-6 text-[#304AC0] group-hover:bg-[#304AC0] group-hover:text-white transition-colors duration-300">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="text-sm font-black text-[#E8ECF0] mb-2 group-hover:text-[#304AC0]/20 transition-colors">
                0{step.id}
              </div>
              <h3 className="font-bold text-[#1C1D62] mb-3 text-lg">{step.title}</h3>
              <p className="text-sm text-[#718096] leading-relaxed">{step.desc}</p>
              
              {/* Subtle hover accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#304AC0] rounded-b-3xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
