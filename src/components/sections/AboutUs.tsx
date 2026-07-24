"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, ArrowRight, Target, Eye, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const apartItems = [
  "Structured, insight-driven approach focused on approval quality, not volume",
  "Strong network across 70+ banks and NBFCs",
  "Dedicated, personalized advisory with a long-term partnership mindset",
  "Emphasis on financial clarity and smarter decision-making",
];

const clientTypes = [
  "Growing MSMEs to established companies",
  "Manufacturers, traders and service providers",
  "Exporters and importers",
  "Professionals and practice owners",
];

const promises = [
  { icon: "✦", text: "Clarity over complexity" },
  { icon: "✦", text: "Structure over uncertainty" },
  { icon: "✦", text: "Partnership over transactions" },
];

export default function AboutUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F0F4FF] rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            We Prepare You for Funding. Not Just Arrange It.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-[#1C1D62] mb-3">Who We Are</h3>
              <p className="text-[#2D3748] leading-relaxed">
                Credora Fintech Pvt Ltd is a financial services and advisory firm providing structured funding solutions to businesses and professionals across India.
              </p>
              <p className="text-[#2D3748] leading-relaxed mt-3">
                We specialize in assessing financial positions, structuring funding requirements, and connecting clients with the lenders best aligned to their profile. By combining financial expertise with strong institutional partnerships, we enable efficient access to capital while minimizing delays and rejections.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-[#1C1D62] mb-3">What We Do</h3>
              <p className="text-[#2D3748] leading-relaxed">
                We don&apos;t just arrange funding. <strong className="text-[#304AC0]">We prepare you for it.</strong>
              </p>
              <p className="text-[#2D3748] leading-relaxed mt-3">
                We assess your financials, CIBIL profile, and overall eligibility in detail, aligning your profile with the specific requirements of financial institutions. This ensures your application is positioned correctly with clarity, accuracy, and intent. The outcome: faster access, stronger alignment, and reduced uncertainty in approvals.
              </p>
            </motion.div>

            {/* Our Promise */}
            <motion.div
              className="bg-[#F0F4FF] rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-[#1C1D62] mb-4">Our Promise</h3>
              <div className="space-y-3">
                {promises.map((promise, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[#87B73C] text-lg">{promise.icon}</span>
                    <span className="text-[#2D3748] font-medium">{promise.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Mission & Vision */}
            <div className="grid gap-6">
              <motion.div
                className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#304AC0] flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1C1D62]">Mission</h3>
                </div>
                <p className="text-[#2D3748] leading-relaxed text-sm">
                  To simplify the funding process through transparent advisory, structured financial evaluation, and customized loan solutions that support long-term business growth.
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#87B73C] flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1C1D62]">Vision</h3>
                </div>
                <p className="text-[#2D3748] leading-relaxed text-sm">
                  To build a trusted financial solutions platform that empowers businesses and professionals with reliable access to capital and smarter financial decision-making.
                </p>
              </motion.div>
            </div>

            {/* What Sets Us Apart */}
            <motion.div
              className="bg-[#1C1D62] rounded-2xl p-6 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4">What Sets Us Apart</h3>
              <div className="space-y-3">
                {apartItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#87B73C] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/90 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Who We Work With */}
            <motion.div
              className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-[#1C1D62] mb-4">Who We Work With</h3>
              <div className="grid grid-cols-2 gap-3">
                {clientTypes.map((client, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#304AC0] mt-2 flex-shrink-0" />
                    <span className="text-sm text-[#2D3748]">{client}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-8 py-3 rounded-md group"
              >
                Contact Us for a Free Consultation
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
