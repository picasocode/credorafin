"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Building2,
  Link2,
  Globe,
  HardHat,
  Puzzle,
} from "lucide-react";

const expertiseAreas = [
  {
    icon: Building2,
    title: "MSME Loans",
    desc: "Collateral-free and secured funding for growth and operations.",
    color: "#304AC0",
  },
  {
    icon: Link2,
    title: "Supply Chain Finance",
    desc: "Unlock liquidity from invoices, payables, and inventory.",
    color: "#13277E",
  },
  {
    icon: Globe,
    title: "Cross Border Finance",
    desc: "Export and import solutions for international trade.",
    color: "#1C1D62",
  },
  {
    icon: HardHat,
    title: "Project Finance",
    desc: "Structured funding for real estate and large-scale projects.",
    color: "#304AC0",
  },
  {
    icon: Puzzle,
    title: "Specialized Finance",
    desc: "Niche solutions including stressed assets and complex requirements.",
    color: "#87B73C",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhatWeDo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="what-we-do" className="py-20 md:py-28 bg-[#F0F4FF] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-[5%] w-3 h-3 rounded-full bg-[#304AC0]/10" />
        <div className="absolute top-40 right-[12%] w-4 h-4 rounded-full bg-[#87B73C]/10" />
        <div className="absolute bottom-32 left-[20%] w-2 h-2 rounded-full bg-[#13277E]/10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            Tailored Solutions. Intentional Recommendations.
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            We assess your financials, repair credit where needed, structure proposals, and connect you with the right lender.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {expertiseAreas.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group relative bg-white rounded-2xl p-6 text-center border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => {
                const el = document.getElementById("products");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {/* Icon with animated ring */}
              <div className="relative w-16 h-16 mx-auto mb-5">
                <div
                  className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: item.color }}
                />
                <div className="relative w-full h-full rounded-2xl flex items-center justify-center bg-[#F0F4FF] group-hover:bg-white transition-colors border border-transparent group-hover:border-[#E8ECF0]">
                  <item.icon className="w-8 h-8 transition-colors" style={{ color: item.color }} />
                </div>
              </div>
              <h3 className="text-base font-semibold text-[#1C1D62] mb-2">{item.title}</h3>
              <p className="text-sm text-[#718096] leading-relaxed">{item.desc}</p>
              {/* Hover arrow */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[#304AC0] text-sm font-medium">Learn More →</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
