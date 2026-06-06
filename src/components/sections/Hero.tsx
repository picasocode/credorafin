"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, Building2, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingElements = [
  { icon: Shield, delay: 0, x: "10%", y: "20%", size: "w-10 h-10" },
  { icon: Building2, delay: 0.5, x: "85%", y: "15%", size: "w-12 h-12" },
  { icon: TrendingUp, delay: 1, x: "75%", y: "70%", size: "w-10 h-10" },
  { icon: Users, delay: 1.5, x: "15%", y: "75%", size: "w-11 h-11" },
];

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#F0F4FF]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circle decoration */}
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#304AC0]/5"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#87B73C]/5"
          animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        {/* Dot pattern */}
        <div className="absolute top-20 left-[10%] grid grid-cols-5 gap-4 opacity-10">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#304AC0]" />
          ))}
        </div>
        <div className="absolute bottom-20 right-[8%] grid grid-cols-5 gap-4 opacity-10">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#13277E]" />
          ))}
        </div>
      </div>

      {/* Floating icons */}
      {floatingElements.map((item, index) => (
        <motion.div
          key={index}
          className="absolute hidden md:flex items-center justify-center bg-white rounded-2xl shadow-lg border border-[#E8ECF0]"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.7,
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { delay: item.delay, duration: 0.5 },
            scale: { delay: item.delay, duration: 0.5 },
            y: { delay: item.delay + 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className={`${item.size} flex items-center justify-center text-[#304AC0]`}>
            <item.icon className="w-5 h-5" />
          </div>
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-white text-[#304AC0] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-[#304AC0]/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#87B73C] animate-pulse" />
                Trusted by 1,200+ Clients
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1C1D62] leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Enrich Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#304AC0]">Cashflow</span>
                <motion.span
                  className="absolute bottom-1 left-0 right-0 h-3 bg-[#87B73C]/20 -skew-x-3 rounded"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-[#718096] leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Structured funding solutions for MSMEs, professionals, and growing businesses across India. We simplify access to capital by bridging the gap between your funding needs and the right financial institutions.
            </motion.p>

            <motion.p
              className="text-base text-[#2D3748] leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              With disciplined pre-underwriting, end-to-end advisory, and access to <strong className="text-[#304AC0]">70+ banks and NBFCs</strong>, we prepare your profile for success.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-8 py-3.5 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                Get Funded Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="border-[#13277E] text-[#13277E] hover:bg-[#F8F9FA] font-medium text-sm uppercase tracking-wider px-8 py-3.5 rounded-md transition-all duration-200"
              >
                Speak to an Advisor
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[#304AC0]/10 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-[#304AC0]">
                      {["M", "S", "R", "K"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-[#718096]">1,200+ Happy Clients</span>
              </div>
            </motion.div>
          </div>

          {/* Right side - Visual element */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#E8ECF0]">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#718096]">Funding Overview</span>
                    <span className="text-xs bg-[#87B73C]/10 text-[#2E7D32] px-3 py-1 rounded-full font-medium">Active</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#2D3748]">Loan Approval Rate</span>
                        <span className="font-semibold text-[#304AC0]">92%</span>
                      </div>
                      <div className="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#304AC0] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#2D3748]">Client Satisfaction</span>
                        <span className="font-semibold text-[#87B73C]">98%</span>
                      </div>
                      <div className="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#87B73C] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "98%" }}
                          transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#2D3748]">Lender Network</span>
                        <span className="font-semibold text-[#13277E]">70+</span>
                      </div>
                      <div className="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#13277E] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E8ECF0]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1C1D62]">20+</div>
                      <div className="text-xs text-[#718096]">Years Exp.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#304AC0]">70+</div>
                      <div className="text-xs text-[#718096]">Banks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#87B73C]">20+</div>
                      <div className="text-xs text-[#718096]">Products</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent cards */}
              <motion.div
                className="absolute -top-4 -left-4 bg-[#304AC0] text-white rounded-xl px-4 py-3 shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-xs font-medium opacity-80">Quick Disbursal</div>
                <div className="text-sm font-bold">7-10 Days</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-[#87B73C] text-white rounded-xl px-4 py-3 shadow-lg"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-xs font-medium opacity-80">Funding Range</div>
                <div className="text-sm font-bold">₹5L - ₹50Cr</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
