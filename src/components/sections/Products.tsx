"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Building2,
  Link2,
  Globe,
  HardHat,
  Puzzle,
  ChevronDown,
  Download,
  X,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Product {
  icon: React.ElementType;
  title: string;
  shortDesc: string;
  fullDesc: string;
  color: string;
  products: { name: string; desc: string }[];
  benefits: string[];
  brochureFile: string;
}

const products: Product[] = [
  {
    icon: Building2,
    title: "MSME Loans",
    shortDesc: "Flexible Funding for Business Growth",
    fullDesc: "MSME loans provide essential capital for micro, small, and medium enterprises in manufacturing, trading, and services. Whether you need working capital, equipment purchase, or expansion funds, we structure collateral-free and secured options under schemes like CGTMSE.",
    color: "#304AC0",
    products: [
      { name: "Unsecured Business Loans — Term Loans / Flexi OD", desc: "Collateral-free funding for expansion, working capital, and day-to-day operations." },
      { name: "Loan Against Property and LRD", desc: "Raise funds against immovable property or rental income (Lease Rental Discounting)." },
      { name: "Working Capital — CGTMSE Secured and Unsecured", desc: "Working capital under CGTMSE, offering both collateral-free and secured funding for MSMEs." },
      { name: "Machinery Finance", desc: "Loans to purchase new or used machinery to enhance production capacity." },
      { name: "Solar Finance", desc: "Funding support for solar projects and renewable energy solutions." },
      { name: "Commercial Vehicle Finance", desc: "Funding solutions for acquiring commercial vehicles to support business operations." },
      { name: "Professional Loans", desc: "Customized funding for doctors, CAs, lawyers, and other professionals." },
    ],
    benefits: [
      "Faster processing and higher approval chances",
      "Competitive interest rates and flexible repayment terms",
      "Improved cash flow and business scalability",
      "Support for both new and existing businesses",
    ],
    brochureFile: "msme-loans-brochure.pdf",
  },
  {
    icon: Link2,
    title: "Supply Chain Finance",
    shortDesc: "Unlock Working Capital Trapped in Your Business",
    fullDesc: "A significant portion of working capital in businesses is tied up in receivables and inventory. Our supply chain finance solutions help convert invoices into immediate cash and optimize payment cycles — without impacting your CIBIL score and Balance sheet.",
    color: "#13277E",
    products: [
      { name: "Invoice Discounting — Sales and Purchase", desc: "Convert outstanding invoices into immediate working capital." },
      { name: "Payable Finance", desc: "Manage and optimize your supplier payment cycles while preserving cash flow." },
      { name: "Vendor Finance", desc: "Enable vendors to receive early payments against their invoices." },
      { name: "Channel Finance", desc: "Funding support for inventory and stocks for channel partners." },
      { name: "Inventory Finance", desc: "Funding against stock, purchase to maintain smooth operations." },
      { name: "Working Capital Demand Loan", desc: "Short-term loans to meet immediate working capital requirements." },
    ],
    benefits: [
      "Faster access to liquidity without a heavy CIBIL impact",
      "Stronger supplier and buyer relationships",
      "Better working capital management",
      "Reduced dependency on traditional term loans",
      "Off Balance Sheet Option",
    ],
    brochureFile: "supply-chain-finance-brochure.pdf",
  },
  {
    icon: Globe,
    title: "Cross Border Finance",
    shortDesc: "Finance for Exporters and Importers",
    fullDesc: "We provide specialized trade finance solutions for businesses involved in international trade — helping manage orders, production, receivables, and supplier payments efficiently across borders.",
    color: "#1C1D62",
    products: [
      { name: "Export Finance", desc: "Comprehensive support for managing export orders, production costs, and receivables." },
      { name: "Pre-Shipment Finance", desc: "Funding based on purchase orders to manage production and shipment costs." },
      { name: "Post-Shipment Finance", desc: "Liquidity support after goods are shipped, until export payments are received." },
      { name: "Import Finance", desc: "Financing to manage timely payments to overseas suppliers." },
    ],
    benefits: [
      "Improved liquidity throughout the trade cycle",
      "Risk mitigation in cross-border dealings",
      "Seamless management of orders and payments",
      "Support for both large and growing exporters and importers",
    ],
    brochureFile: "cross-border-finance-brochure.pdf",
  },
  {
    icon: HardHat,
    title: "Project Finance",
    shortDesc: "Structured Funding for Large-Scale Projects",
    fullDesc: "Structured funding for property development, builder projects, land purchase, and inventory funding. We help developers and businesses secure long-term capital aligned with project cash flows and milestones.",
    color: "#304AC0",
    products: [
      { name: "Real Estate Finance", desc: "Funding solutions for real estate investments, including land purchase and unsold plot funding." },
      { name: "Builder Finance", desc: "Funding solutions for property development, construction projects, and land acquisition." },
      { name: "Inventory Funding", desc: "Capital against unsold project inventory for builders and developers." },
    ],
    benefits: [
      "Customized terms with moratorium options where applicable",
      "Support from planning stage through to project completion",
      "Focus on project viability and strong approval outcomes",
      "Aligned repayment structures based on project cash flows",
    ],
    brochureFile: "project-finance-brochure.pdf",
  },
  {
    icon: Puzzle,
    title: "Specialized Finance",
    shortDesc: "Niche Solutions for Complex Funding Requirements",
    fullDesc: "For unique or challenging requirements where standard products fall short. We provide customized, structured finance for specific industries and complex financial situations.",
    color: "#87B73C",
    products: [
      { name: "Third Party Security Funding", desc: "Loans backed by collateral provided by a third party on behalf of the borrower." },
      { name: "Politically Exposed Customers (PEP)", desc: "Structured funding support for politically exposed persons." },
      { name: "Short-Term Project Finance / Bridge Finance", desc: "Bridge funding for ongoing or near-completion projects." },
      { name: "Inventory Funding — Sector Specific", desc: "Sector-specific funding against stock for niche industries." },
      { name: "Ship Purchase Finance", desc: "Financing for the acquisition of marine vessels." },
      { name: "Film and Media Finance", desc: "Funding support for film production and media projects." },
      { name: "ARC and Stressed Asset Solutions", desc: "Specialized support for resolving stressed or non-performing financial assets." },
      { name: "NCLT Purchase", desc: "Acquisition and resolution of assets under insolvency proceedings." },
      { name: "SMA and NPA Cases", desc: "Support for restructuring and resolving stressed and non-performing accounts." },
      { name: "Structured Finance", desc: "Customized solutions for complex financial situations." },
    ],
    benefits: [],
    brochureFile: "specialized-finance-brochure.pdf",
  },
];

function BrochureModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
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
      if (res.ok) {
        setSuccess(true);
        toast({ title: "Brochure downloading!", description: `We've also sent a copy to ${email}` });
      } else {
        toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#718096] hover:text-[#2D3748] transition-colors">
          <X className="w-5 h-5" />
        </button>

        {!success ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-5 h-5 text-[#304AC0]" />
              <h3 className="text-xl font-semibold text-[#1C1D62]">{product.title} Brochure</h3>
            </div>
            <p className="text-sm text-[#718096] mb-6">Enter your email to download the brochure. We&apos;ll also send a copy to your inbox.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-lg border-[#E8ECF0] focus:border-[#304AC0]"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider h-12 rounded-lg"
              >
                {loading ? "Sending..." : "Download Brochure"}
              </Button>
              <p className="text-xs text-[#718096] text-center">
                We&apos;ll also send this brochure to your inbox. No spam, ever.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#87B73C]/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#87B73C]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1C1D62] mb-2">Your brochure is downloading!</h3>
            <p className="text-sm text-[#718096]">We&apos;ve also sent a copy to <strong>{email}</strong></p>
            <Button onClick={onClose} variant="outline" className="mt-6 border-[#304AC0] text-[#304AC0]">
              Close
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Products() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [brochureProduct, setBrochureProduct] = useState<Product | null>(null);

  return (
    <section id="products" className="py-20 md:py-28 bg-[#F0F4FF] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            Our Products
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            Comprehensive Funding Solutions
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            From everyday working capital to complex cross-border and specialized finance. Every product is matched to your business profile and delivered through the right lender.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              className={`bg-white rounded-2xl border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                expandedProduct === i ? "lg:col-span-2" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              {/* Card header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${product.color}10` }}>
                    <product.icon className="w-6 h-6" style={{ color: product.color }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: `${product.color}10`, color: product.color }}>
                    {product.products.length} Products
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#1C1D62] mb-2">{product.title}</h3>
                <p className="text-sm font-medium mb-2" style={{ color: product.color }}>{product.shortDesc}</p>
                <p className="text-sm text-[#718096] leading-relaxed">{product.fullDesc}</p>
              </div>

              {/* Expandable sub-products */}
              <div className="px-6 pb-2">
                <button
                  onClick={() => setExpandedProduct(expandedProduct === i ? null : i)}
                  className="flex items-center gap-1 text-[#304AC0] text-sm font-medium hover:underline"
                >
                  {expandedProduct === i ? "Show Less" : `View ${product.products.length} Products`}
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedProduct === i ? "rotate-180" : ""}`} />
                </button>
              </div>

              <AnimatePresence>
                {expandedProduct === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-3">
                      <div className="border-t border-[#E8ECF0] pt-4">
                        <h4 className="text-sm font-semibold text-[#1C1D62] mb-3">Products Under {product.title}</h4>
                        <div className="space-y-3">
                          {product.products.map((sub, j) => (
                            <div key={j} className="bg-[#F0F4FF] rounded-lg p-3">
                              <div className="text-sm font-medium text-[#1C1D62]">{sub.name}</div>
                              <div className="text-xs text-[#718096] mt-0.5">{sub.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      {product.benefits.length > 0 && (
                        <div className="border-t border-[#E8ECF0] pt-4">
                          <h4 className="text-sm font-semibold text-[#1C1D62] mb-3">Key Benefits</h4>
                          <div className="space-y-2">
                            {product.benefits.map((benefit, j) => (
                              <div key={j} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#87B73C] mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-[#2D3748]">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card footer - Brochure download */}
              <div className="px-6 py-4 border-t border-[#E8ECF0] bg-[#FAFBFC]">
                <Button
                  onClick={() => setBrochureProduct(product)}
                  variant="outline"
                  className="w-full border-[#304AC0] text-[#304AC0] hover:bg-[#F0F4FF] text-sm font-medium uppercase tracking-wider"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Get the Brochure — Free Download
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Brochure Modal */}
      <AnimatePresence>
        {brochureProduct && (
          <BrochureModal product={brochureProduct} onClose={() => setBrochureProduct(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
