"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, UserPlus, Handshake, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { num: "01", title: "Refer", desc: "You refer a business or individual who needs a funding solution." },
  { num: "02", title: "Assess", desc: "Our team reaches out, assesses their requirement, and takes it forward." },
  { num: "03", title: "Earn", desc: "Once the loan is disbursed, you earn a referral reward." },
];

const whoCanPartner = [
  "Chartered accountants and financial advisors",
  "Business consultants and relationship managers",
  "Real estate agents and builders",
  "Anyone with a strong network of business owners or professionals",
];

const whyPartner = [
  "Simple and transparent referral process",
  "Competitive rewards on successful disbursal",
  "Full support — we handle everything after the introduction",
  "Trusted by 1,200+ clients across India",
];

export default function ReferralPartner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="referral" className="py-20 md:py-28 bg-[#F0F4FF] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#304AC0]/3 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            Referral Partner
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            Refer. Earn. Grow Together.
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            If you work with businesses that need funding or simply know someone who does — you can earn rewards by connecting them with Credora Fintech.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - How it works */}
          <div>
            <h3 className="text-xl font-semibold text-[#1C1D62] mb-8">How It Works</h3>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-5"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-[#304AC0] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#304AC0]/20" />
                    )}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-lg font-semibold text-[#1C1D62]">{step.title}</h4>
                    <p className="text-sm text-[#718096] mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-8 py-3.5 rounded-md group shadow-lg"
              >
                Contact Us to Partner
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* Right - Who can partner & Why */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#F0F4FF] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#304AC0]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1C1D62]">Who Can Be a Referral Partner?</h3>
              </div>
              <div className="space-y-3">
                {whoCanPartner.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#87B73C] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#2D3748]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-[#1C1D62] rounded-2xl p-6 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-[#87B73C]" />
                </div>
                <h3 className="text-lg font-semibold">Why Partner With Us?</h3>
              </div>
              <div className="space-y-3">
                {whyPartner.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#87B73C] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
