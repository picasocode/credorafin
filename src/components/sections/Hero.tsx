"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Building2,
  Landmark,
  Zap,
  CheckCircle2,
  CircleDollarSign,
  Users,
  Star,
  BadgeCheck,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   STATS DATA
   ──────────────────────────────────────────── */
const stats = [
  { value: "20+", label: "Years Experience", icon: Building2 },
  { value: "70+", label: "Bank Partners", icon: Landmark },
  { value: "1,200+", label: "Happy Clients", icon: Users },
  { value: "₹50Cr", label: "Max Funding", icon: CircleDollarSign },
];

/* ────────────────────────────────────────────
   MAIN HERO — Clean, Pleasant, Human
   ──────────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ═══ SOFT WARM BACKGROUND ═══ */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFF] via-white to-[#F5F0FF]">
        {/* Subtle accent glow */}
        <div
          className="absolute top-0 right-0 w-[50vw] h-[50vh] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(48,74,192,0.05) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[35vw] h-[35vh] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(135,183,60,0.05) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Warm peach comfort glow */}
        <div
          className="absolute top-1/3 left-1/4 w-[25vw] h-[25vh] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(255,183,130,0.05) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ─── LEFT: Text Content ─── */}
          <div className="max-w-xl space-y-7">
            {/* Badge */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] border text-[#304AC0] bg-[#304AC08] border-[#304AC018]">
                <HeartHandshake className="w-3.5 h-3.5 text-[#304AC0]" />
                Structured Finance
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2.6rem] sm:text-[3.1rem] lg:text-[3.4rem] xl:text-[3.8rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#0F172A]">
              Enrich Your
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#304AC0] to-[#5B7FEF]">
                Cashflow
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-[17px] text-slate-500 leading-[1.7] max-w-md">
              Funding solutions for MSMEs and growing businesses — 70+ banks, one streamlined process.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 pt-1">
              <Button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="h-[52px] px-8 rounded-2xl text-[14px] font-semibold text-white transition-all duration-300 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #304AC0, #5B7FEF)",
                  boxShadow: "0 4px 20px rgba(48,74,192,0.25)",
                }}
              >
                <span className="flex items-center gap-2">
                  Get Funded Now
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="h-[52px] px-8 rounded-2xl text-[14px] font-semibold border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Speak to an Advisor
                </span>
              </Button>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-5 pt-3">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[12px] text-slate-500 ml-1 font-medium">4.9/5</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["RK", "SP", "AM"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[7px] font-bold text-white border-2 border-white shadow-sm"
                      style={{
                        backgroundColor: ["#304AC0", "#13277E", "#87B73C"][i],
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <span className="text-[12px] text-slate-400">
                  <span className="text-slate-600 font-semibold">1,200+</span> businesses trust us
                </span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Image + Floating Cards ─── */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main image container */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.10)] border border-white/60">
                {/* Image */}
                <Image
                  src="/images/pages/hero-indian-team.png"
                  alt="Credora Finance Team"
                  width={640}
                  height={480}
                  className="w-full h-[480px] object-cover"
                  priority
                />

                {/* Soft gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />

                {/* Content overlaid on image bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  {/* Mini stat cards */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Approval Rate", value: "92%", icon: Shield, color: "#304AC0" },
                      { label: "Disbursal", value: "7 Days", icon: Zap, color: "#87B73C" },
                      { label: "Lenders", value: "70+", icon: Landmark, color: "#304AC0" },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/50 bg-white/75 backdrop-blur-xl p-3.5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${c.color}12` }}
                          >
                            <c.icon className="w-3 h-3" style={{ color: c.color }} />
                          </div>
                          <span className="text-[8px] text-slate-400 uppercase tracking-wider font-medium">{c.label}</span>
                        </div>
                        <p className="text-[18px] font-bold text-slate-900 leading-none">{c.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Trust line */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-[#87B73C]" />
                      <span className="text-[11px] text-slate-500 font-medium">Your growth, our commitment</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-white/40">
                      <BadgeCheck className="w-3 h-3 text-green-600" />
                      <span className="text-[10px] font-semibold text-green-700">Verified Partner</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── FLOATING ACCENT CARDS ── */}

              {/* Top-left: Quick Disbursal */}
              <div
                className="absolute -top-4 -left-4 rounded-2xl px-4 py-3 shadow-xl border z-20"
                style={{
                  background: "linear-gradient(135deg, #304AC0, #5B7FEF)",
                  borderColor: "rgba(48,74,192,0.3)",
                  boxShadow: "0 12px 32px rgba(48,74,192,0.2)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-white/80" />
                  <div>
                    <p className="text-[8px] font-medium text-white/60 uppercase tracking-[0.12em]">Quick Disbursal</p>
                    <p className="text-[14px] font-bold text-white leading-tight">7–10 Days</p>
                  </div>
                </div>
              </div>

              {/* Bottom-right: Funding Range */}
              <div
                className="absolute -bottom-4 -right-4 rounded-2xl px-4 py-3 shadow-xl border border-green-200/40 bg-gradient-to-br from-[#87B73C] to-[#5BBF4A] z-20"
                style={{ boxShadow: "0 12px 32px rgba(135,183,60,0.2)" }}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white/80" />
                  <div>
                    <p className="text-[8px] font-medium text-white/60 uppercase tracking-[0.12em]">Funding Range</p>
                    <p className="text-[14px] font-bold text-white leading-tight">₹5L – ₹50Cr</p>
                  </div>
                </div>
              </div>

              {/* Right-middle: Approval */}
              <div className="absolute top-1/2 -right-5 -translate-y-1/2 rounded-2xl px-4 py-3 shadow-xl border border-slate-100 bg-white z-20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#304AC00A]">
                    <Shield className="w-4 h-4 text-[#304AC0]" />
                  </div>
                  <div>
                    <p className="text-[8px] font-medium text-slate-400 uppercase tracking-[0.1em]">Approval Rate</p>
                    <p className="text-[15px] font-bold text-slate-900 leading-tight">92%</p>
                  </div>
                </div>
              </div>

              {/* Top-right: Verified badge */}
              <div className="absolute top-5 right-5 z-30">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-sm">
                  <BadgeCheck className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-[10px] font-semibold text-green-700">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM STATS BAR ─── */}
        <div className="mt-16 lg:mt-24">
          {/* Divider */}
          <div className="relative mb-8">
            <div className="h-px bg-slate-100" />
            <div
              className="absolute top-0 h-px w-1/4"
              style={{ background: "linear-gradient(90deg, #304AC0, transparent)" }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
            {stats.map((s, i) => (
              <div key={i} className="group text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:border-slate-200 group-hover:shadow-sm transition-all duration-300">
                    <s.icon className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600 transition-colors duration-300" />
                  </div>
                </div>
                <p className="text-[1.6rem] sm:text-[1.75rem] font-bold text-slate-900 tracking-tight group-hover:text-slate-800 transition-colors duration-300">
                  {s.value}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.16em] mt-1 group-hover:text-slate-500 transition-colors duration-300">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
