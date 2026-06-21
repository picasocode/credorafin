"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedIllustration from "@/components/AnimatedIllustration";
import {
  Building2,
  Link2,
  Globe,
  HardHat,
  Puzzle,
  CheckCircle2,
  Download,
  ArrowRight,
  ChevronRight,
  Shield,
  Users,
  TrendingUp,
  FileCheck,
  Clock,
  Percent,
  Banknote,
  ChevronDown,
  Search,
} from "lucide-react";
import { products } from "@/lib/data";
import ProcessInfographic from "@/components/ProcessInfographic";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  ScaleReveal,
  SlideReveal,
  CountUp,
  FloatingElement,
  PulseGlow,
} from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Link2,
  Globe,
  HardHat,
  Puzzle,
};

const product = products.find((p) => p.slug === "specialized-finance")!;
const otherProducts = products.filter((p) => p.slug !== "specialized-finance");
const accent = product.color;
// Fallback to msme-hero.png since specialized-hero.png doesn't exist
const heroImage = "/images/products/msme-hero.png";

const eligibilityIcons = [Search, Banknote, FileCheck, TrendingUp];
const statIcons = [Puzzle, Percent, Users, Clock];

export default function SpecializedFinancePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const { toast } = useToast();
  const IconComponent = iconMap[product.icon];

  // Parallax ref
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product: product.title, brochureFile: product.brochureFile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSuccess(true);
      toast({ title: "Brochure download started!", description: data.message || "Check your email." });
    } catch (err) {
      toast({ title: "Download failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ─── 1. Hero Section ─── */}
      <section className="relative overflow-hidden" ref={heroRef}>
        <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
        <div className="relative bg-[#F7F9FC] py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[420px] py-12 md:py-16">
              <SlideReveal direction="left">
                <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-6">
                  <Link href="/" className="hover:text-[#304AC0] transition-colors">Home</Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <Link href="/products" className="hover:text-[#304AC0] transition-colors">Products</Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="font-medium" style={{ color: accent }}>{product.title}</span>
                </nav>
                <div className="flex items-start gap-4 mb-5">
                  <motion.div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accent}12` }}
                    whileHover={{ scale: 1.08, rotate: -3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <IconComponent className="w-7 h-7" style={{ color: accent }} />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1D62] leading-tight">{product.title}</h1>
                    <p className="mt-1.5 text-lg sm:text-xl font-semibold" style={{ color: accent }}>{product.shortDesc}</p>
                  </div>
                </div>
                <p className="text-[#2D3748] leading-relaxed text-base sm:text-lg mb-6">{product.fullDesc}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button size="lg" className="text-white font-semibold text-sm uppercase tracking-wider px-7 rounded-md group" style={{ backgroundColor: "#87B73C" }}>
                        Apply Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </Link>
                  <a href="#products-section">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button variant="outline" size="lg" className="font-semibold text-sm uppercase tracking-wider px-7 rounded-md" style={{ borderColor: accent, color: accent }}>
                        Explore Products
                      </Button>
                    </motion.div>
                  </a>
                </div>
              </SlideReveal>
              <SlideReveal direction="right" delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <motion.div style={{ y: parallaxY }}>
                    <Image
                      src={heroImage}
                      alt="Specialized finance and complex business solutions"
                      width={600}
                      height={400}
                      className="w-full h-[280px] sm:h-[340px] lg:h-[380px] object-cover"
                      priority
                    />
                  </motion.div>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accent}40, transparent 60%)` }} />
                </div>
                <FloatingElement className="absolute -top-6 -right-4 hidden lg:block" amplitude={8} duration={4}>
                  <div className="w-24 h-24 opacity-80">
                    <AnimatedIllustration theme="document" size={96} color={accent} />
                  </div>
                </FloatingElement>
              </SlideReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Stats Row ─── */}
      {product.stats && product.stats.length > 0 && (
        <section className="py-10 md:py-14 bg-white border-b border-[#E8ECF0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.12}>
              {product.stats.map((stat, idx) => {
                const SIcon = statIcons[idx % statIcons.length];
                return (
                  <StaggerItem key={idx}>
                    <motion.div
                      className="h-full flex flex-col min-h-[120px] text-center bg-white rounded-xl border border-[#E8ECF0] p-6 shadow-sm"
                      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)", scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${accent}10` }}>
                        <SIcon className="w-6 h-6" style={{ color: accent }} />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold" style={{ color: accent }}>
                        {/\d/.test(stat.value) ? (<CountUp target={parseInt(stat.value.replace(/[^0-9]/g, "")) || 0} suffix={stat.suffix || ""} prefix={stat.value.match(/^[^0-9]*/)?.[0] || ""} />) : (<span>{stat.value}{stat.suffix || ""}</span>)}
                      </div>
                      <div className="text-sm text-[#718096] mt-1 font-medium">{stat.label}</div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ─── 3. Eligibility Section ─── */}
      {product.eligibility && product.eligibility.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionReveal>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}12` }}>
                  <Shield className="w-5 h-5" style={{ color: accent }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62]">Eligibility Criteria</h2>
              </div>
              <p className="text-[#718096] mb-10 ml-12 max-w-2xl">What we look for when evaluating specialized finance cases.</p>
            </SectionReveal>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
              {product.eligibility.map((item, idx) => {
                const EIcon = eligibilityIcons[idx % eligibilityIcons.length];
                return (
                  <StaggerItem key={idx}>
                    <motion.div
                      className="h-full flex flex-col min-h-[160px] bg-white rounded-xl p-6 shadow-sm border-l-4 transition-all duration-300"
                      style={{ borderLeftColor: accent, borderRightColor: "#E8ECF0", borderTopColor: "#E8ECF0", borderBottomColor: "#E8ECF0" }}
                      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}10` }}>
                          <EIcon className="w-5 h-5" style={{ color: accent }} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full" style={{ backgroundColor: `${accent}08`, color: accent }}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[#1C1D62] mb-2">{item.label}</h3>
                      <p className="text-sm text-[#718096] leading-relaxed flex-1">{item.desc}</p>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ─── 4. Sub-Products with Accordion ─── */}
      <section id="products-section" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}12` }}>
                <Puzzle className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62]">Product Offerings</h2>
            </div>
            <p className="text-[#718096] mb-10 ml-12 max-w-2xl">A diverse range of specialized finance solutions for unique and complex requirements that standard products cannot address.</p>
          </SectionReveal>
          <div className="space-y-4">
            {product.products.map((item, idx) => {
              const isExpanded = expandedProduct === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
                  className="bg-white rounded-xl border border-[#E8ECF0] shadow-sm overflow-hidden transition-all duration-300"
                  style={{ borderColor: isExpanded ? accent : undefined }}
                >
                  <button
                    onClick={() => setExpandedProduct(isExpanded ? null : idx)}
                    className="w-full flex items-center gap-4 p-5 sm:p-6 text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}08` }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-[#1C1D62] group-hover:text-[#304AC0] transition-colors truncate">{item.name}</h3>
                      {!isExpanded && (
                        <p className="text-sm text-[#718096] leading-relaxed mt-1 line-clamp-1">{item.desc}</p>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" style={{ color: accent }} />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 ml-14">
                      <p className="text-sm text-[#718096] leading-relaxed mb-4">{item.desc}</p>
                      {item.features && item.features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.features.map((feat, fi) => (
                            <span
                              key={fi}
                              className="text-xs font-medium px-3 py-1.5 rounded-full border"
                              style={{ borderColor: `${accent}25`, color: accent, backgroundColor: `${accent}06` }}
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. Process Infographic ─── */}
      {product.processSteps && product.processSteps.length > 0 && (
        <ProcessInfographic
          steps={product.processSteps}
          accentColor={accent}
          subtitle="Every case is unique — our process is designed to deeply understand and structure solutions for complex situations."
        />
      )}

      {/* ─── 6. Benefits Section ─── */}
      {product.benefits.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <SlideReveal direction="left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}12` }}>
                    <CheckCircle2 className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62]">Key Benefits</h2>
                </div>
                <p className="text-[#718096] mb-8 max-w-lg">Why clients with complex requirements trust Credora&apos;s specialized finance expertise.</p>
                <div className="space-y-3">
                  {product.benefits.map((benefit, idx) => (
                    <ScaleReveal key={idx} delay={idx * 0.06}>
                      <motion.div
                        className="flex items-start gap-3 bg-[#F7F9FC] rounded-xl p-4 border border-[#E8ECF0]"
                        whileHover={{ x: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#87B73C]/10">
                          <CheckCircle2 className="w-4 h-4 text-[#87B73C]" />
                        </div>
                        <span className="text-[#2D3748] text-sm sm:text-base leading-relaxed">{benefit}</span>
                      </motion.div>
                    </ScaleReveal>
                  ))}
                </div>
              </SlideReveal>
              <SlideReveal direction="right" delay={0.2}>
                <div className="relative flex items-center justify-center">
                  <div className="w-72 h-72 sm:w-80 sm:h-80">
                    <AnimatedIllustration theme="shield" size={280} color={accent} />
                  </div>
                </div>
              </SlideReveal>
            </div>
          </div>
        </section>
      )}

      {/* ─── 7. FAQ Section ─── */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionReveal>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}12` }}>
                  <Shield className="w-5 h-5" style={{ color: accent }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62]">Frequently Asked Questions</h2>
              </div>
              <p className="text-[#718096] mb-10 ml-12 max-w-2xl">Common questions about specialized finance, confidentiality, and case handling.</p>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="space-y-3">
                  {product.faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`} className="bg-white rounded-xl border border-[#E8ECF0] shadow-sm px-6 overflow-hidden data-[state=open]:shadow-md transition-shadow">
                      <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-[#1C1D62] hover:no-underline hover:text-[#304AC0] py-5 transition-colors [&>svg]:hidden">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}10` }}>
                            <span className="text-xs font-bold" style={{ color: accent }}>Q</span>
                          </div>
                          {faq.q}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm sm:text-base text-[#718096] leading-relaxed pb-5 ml-10">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* ─── 8. Brochure Download ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="rounded-2xl border-2 p-8 sm:p-10 md:p-14 text-center relative overflow-hidden" style={{ borderColor: `${accent}30` }}>
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ backgroundColor: accent, borderRadius: "0 0 0 100%" }} />
              <FloatingElement className="mx-auto mb-5" amplitude={6} duration={3}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto" style={{ backgroundColor: `${accent}10` }}>
                  <Download className="w-8 h-8" style={{ color: accent }} />
                </div>
              </FloatingElement>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Download {product.title} Brochure</h2>
              <p className="text-[#718096] mb-8 max-w-lg mx-auto">Get our detailed brochure covering all specialized finance products, case types, and resolution frameworks.</p>
              {success ? (
                <div className="flex items-center justify-center gap-3 text-[#87B73C]">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-lg font-semibold">Brochure sent! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleBrochureSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                  <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 h-12 bg-white border-[#E8ECF0]" disabled={loading} required />
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button type="submit" disabled={loading} className="h-12 px-7 text-white font-semibold text-sm uppercase tracking-wider rounded-md whitespace-nowrap" style={{ backgroundColor: accent }}>
                      {loading ? (
                        <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending…</span>
                      ) : (
                        <span className="flex items-center gap-2"><Download className="w-4 h-4" />Download</span>
                      )}
                    </Button>
                  </motion.div>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── 9. Related Products ─── */}
      <section className="py-16 md:py-20 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}12` }}>
                <Puzzle className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62]">Explore Other Products</h2>
            </div>
          </SectionReveal>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
            {otherProducts.map((op) => {
              const OpIcon = iconMap[op.icon];
              return (
                <StaggerItem key={op.slug}>
                  <motion.div
                    className="h-full"
                    whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link href={`/products/${op.slug}`} className="group flex flex-col h-full min-h-[180px] bg-white rounded-xl border border-[#E8ECF0] p-5 shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        {OpIcon && <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${op.color}10` }}><OpIcon className="w-5 h-5" style={{ color: op.color }} /></div>}
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: op.color }}>{op.products.length} Product{op.products.length !== 1 ? "s" : ""}</span>
                      </div>
                      <h3 className="text-base font-semibold text-[#1C1D62] mb-1 group-hover:text-[#304AC0] transition-colors">{op.title}</h3>
                      <p className="text-sm text-[#718096] leading-relaxed line-clamp-2 flex-1">{op.shortDesc}</p>
                      <div className="flex items-center gap-1 mt-3 text-sm font-semibold" style={{ color: op.color }}>
                        <span className="uppercase tracking-wider text-xs">Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 10. CTA Section ─── */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ backgroundColor: "#1C1D62" }}>
        <FloatingElement className="absolute top-8 left-8 opacity-10" amplitude={12} duration={5}>
          <div className="w-20 h-20 rounded-full border-2 border-white" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-8 right-12 opacity-10" amplitude={8} duration={4}>
          <div className="w-16 h-16 rounded-full border-2 border-white" />
        </FloatingElement>
        <FloatingElement className="absolute top-1/2 right-1/4 opacity-5" amplitude={10} duration={6}>
          <div className="w-32 h-32 rounded-full bg-white" />
        </FloatingElement>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <SectionReveal>
              <div className="flex items-center gap-3 mb-4">
                <AnimatedIllustration theme="success" size={48} color="#87B73C" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Have a Complex Funding Requirement?</h2>
              <p className="text-white/70 mb-0 text-base sm:text-lg">If standard products don&apos;t fit your situation, our specialized finance team can structure a solution. Get in touch for a confidential consultation.</p>
            </SectionReveal>
            <SectionReveal delay={0.15} className="flex lg:justify-end">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <PulseGlow color="#87B73C">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                      <Button size="lg" className="bg-[#87B73C] hover:bg-[#6d9a2e] text-white font-semibold text-sm uppercase tracking-wider px-8 h-12 rounded-md group">
                        Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </PulseGlow>
                </Link>
                <a href="#products-section">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-semibold text-sm uppercase tracking-wider px-8 h-12 rounded-md">
                      View Products
                    </Button>
                  </motion.div>
                </a>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
