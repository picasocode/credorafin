"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Landmark, Settings, TrendingUp } from "lucide-react";

const points = [
  {
    icon: ShieldCheck,
    title: "Disciplined Pre-Underwriting",
    desc: "We prepare your profile before submission, ensuring higher approval rates and fewer rejections.",
  },
  {
    icon: Landmark,
    title: "Access to 70+ Banks & NBFCs",
    desc: "A wide network of financial institutions means better terms and the right fit for your business.",
  },
  {
    icon: Settings,
    title: "Tailored Solutions",
    desc: "Every solution is customized. Every recommendation is intentional, with end-to-end support.",
  },
  {
    icon: TrendingUp,
    title: "Cash Flow & Long-Term Growth",
    desc: "We focus on improving your cash flow and positioning your business for sustainable growth.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-us" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F0F4FF] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F0F4FF] rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            We go beyond arranging funds
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            We prepare your profile, structure your application, and connect you with lenders who are the right fit for your business.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {points.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group relative bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#304AC0]/20 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[#F0F4FF] flex items-center justify-center mb-5 group-hover:bg-[#304AC0] transition-colors duration-300">
                <item.icon className="w-7 h-7 text-[#304AC0] group-hover:text-white transition-colors duration-300" />
              </div>
              {/* Content */}
              <h3 className="text-lg font-semibold text-[#1C1D62] mb-2 group-hover:text-[#304AC0] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#718096] leading-relaxed">{item.desc}</p>
              {/* Accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-[#304AC0] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
