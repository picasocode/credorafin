"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  FileCheck,
  Banknote,
  HeadphonesIcon,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

interface Service {
  icon: React.ElementType;
  title: string;
  headline: string;
  desc: string;
  whatWeDo: string[];
  benefits: string[];
  color: string;
}

const services: Service[] = [
  {
    icon: CreditCard,
    title: "Credit Repair Services",
    headline: "Improve Your Credit Profile. Improve Your Chances.",
    desc: "A weak or inaccurate credit profile is often the single biggest barrier to getting funded. We analyze your credit report in detail, identify errors and negative entries, and coordinate corrections so your profile reflects your true financial standing.",
    whatWeDo: [
      "Analyze your CIBIL report and other credit reports in detail",
      "Identify incorrect entries, disputes, or outdated negative records",
      "Coordinate with bureaus and lenders for corrections and updates",
      "Track resolution and confirm updated scores",
    ],
    benefits: [
      "Improved credit score",
      "Higher loan eligibility",
      "Better interest rates and terms",
      "Stronger overall credit rating",
    ],
    color: "#304AC0",
  },
  {
    icon: FileCheck,
    title: "Pre-Underwriting & Loan Structuring",
    headline: "Get Application-Ready Before You Apply.",
    desc: "Most loan rejections happen because applications are submitted without adequate preparation. We evaluate your complete financial profile in advance — identifying the right lenders, fixing weak spots, and structuring your application for the strongest possible outcome.",
    whatWeDo: [
      "Review bank statements, financials, credit exposure, and fund utilization",
      "Assess eligibility across multiple lender criteria simultaneously",
      "Identify and resolve issues before the application is submitted",
      "Structure your loan proposal professionally and accurately",
      "Map to the most suitable banks or NBFCs for your profile",
    ],
    benefits: [
      "Faster loan processing",
      "Significantly higher approval chances",
      "Better interest rates and terms",
      "Fewer rejections and less credit enquiries",
    ],
    color: "#13277E",
  },
  {
    icon: Banknote,
    title: "Fund Raising",
    headline: "The Right Lender. The Right Terms. One Point of Contact.",
    desc: "We manage the entire fund-raising process from understanding your requirement to presenting your case to multiple lenders — so you get the best possible terms without the confusion of dealing with multiple institutions separately.",
    whatWeDo: [
      "Understand your specific funding requirement and business context",
      "Suggest the best loan product and structure for your needs",
      "Present your case to multiple lenders simultaneously",
      "We manage the process and follow up with lenders until sanction and disbursal are complete",
      "Manage all follow-ups until sanction and disbursal",
    ],
    benefits: [
      "Multi-lender access without multiple CIBIL inquiries",
      "Better commercial terms through structured presentation",
      "Single point of contact across all institutions",
      "Controlled and minimal credit enquiries",
    ],
    color: "#1C1D62",
  },
  {
    icon: HeadphonesIcon,
    title: "End-to-End Support Services",
    headline: "Our Support Doesn't End at Disbursal — It Continues Beyond.",
    desc: "Getting funded is just the beginning. We stay engaged through the entire loan lifecycle — from documentation and lender follow-ups to repayment tracking and closure, so your loan works for your business long after the money is in your account.",
    whatWeDo: [
      "Loan repayment calendar and schedule management",
      "Principal outstanding tracking and updates",
      "Account swap assistance",
      "CIBIL updation and credit record management",
      "Loan consolidation advisory and support",
      "NOC collection upon loan closure",
      "Regular follow-ups with lenders at every stage",
    ],
    benefits: [
      "Smooth and hassle-free experience",
      "Faster turnaround time",
      "Complete guidance at every step",
      "No dropped balls between sanction and disbursal",
    ],
    color: "#87B73C",
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedService, setExpandedService] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-[#F0F4FF]/50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            Comprehensive Support Beyond Funding
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            We prepare your business for successful funding and ensure smooth execution from assessment to disbursal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              className={`bg-white rounded-2xl border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                i === services.length - 1 && services.length % 2 !== 0 ? "md:col-span-2 md:max-w-2xl md:mx-auto" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <div className="p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${service.color}10` }}>
                    <service.icon className="w-7 h-7" style={{ color: service.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1C1D62]">{service.title}</h3>
                    <p className="text-sm font-medium mt-1" style={{ color: service.color }}>{service.headline}</p>
                  </div>
                </div>
                <p className="text-sm text-[#718096] leading-relaxed mb-4">{service.desc}</p>

                <button
                  onClick={() => setExpandedService(expandedService === i ? null : i)}
                  className="flex items-center gap-1 text-[#304AC0] text-sm font-medium hover:underline"
                >
                  {expandedService === i ? "Show Less" : "View Details"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedService === i ? "rotate-180" : ""}`} />
                </button>
              </div>

              <AnimatePresence>
                {expandedService === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 lg:px-8 pb-6 lg:pb-8 space-y-4">
                      <div className="border-t border-[#E8ECF0] pt-4">
                        <h4 className="text-sm font-semibold text-[#1C1D62] mb-3">What We Do</h4>
                        <div className="space-y-2">
                          {service.whatWeDo.map((item, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: service.color }} />
                              <span className="text-sm text-[#2D3748]">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-[#E8ECF0] pt-4">
                        <h4 className="text-sm font-semibold text-[#1C1D62] mb-3">Benefits</h4>
                        <div className="space-y-2">
                          {service.benefits.map((benefit, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#87B73C] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-[#2D3748]">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
