"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Linkedin, Facebook, Instagram, ArrowUp, ChevronRight } from "lucide-react";

const productLinks = [
  { label: "MSME Loans", href: "/products/msme-loans" },
  { label: "Supply Chain Finance", href: "/products/supply-chain-finance" },
  { label: "Cross Border Finance", href: "/products/cross-border-finance" },
  { label: "Project Finance", href: "/products/project-finance" },
  { label: "Specialized Finance", href: "/products/specialized-finance" },
];

const serviceLinks = [
  { label: "Credit Repair Services", href: "/services/credit-repair" },
  { label: "Pre-Underwriting & Loan Structuring", href: "/services/pre-underwriting-loan-structuring" },
  { label: "Fund Raising", href: "/services/fund-raising" },
  { label: "End-to-End Support", href: "/services/end-to-end-support" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "EMI Calculator", href: "/emi-calculator" },
  { label: "Blog", href: "/blog" },
  { label: "Referral Partner", href: "/referral-partner" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1C1D62] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block">
              <img src="/images/credora-logo-full.png" alt="Credora Fintech" className="h-10 w-auto mb-4 brightness-0 invert" />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Structured funding solutions for MSMEs, professionals, and growing businesses across India.
            </p>
            <div className="space-y-3">
              <a href="tel:+919344899971" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <Phone className="w-4 h-4" /> +91 93448 99971
              </a>
              <a href="mailto:info@credorafin.com" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <Mail className="w-4 h-4" /> info@credorafin.com
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>1157, 17th St, Anna Nagar West Extension, Padi, Chennai, Tamil Nadu 600050</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Products</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors group">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/products" className="inline-block mt-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#304AC0] hover:bg-[#13277E] rounded-full px-4 py-1.5 transition-colors duration-200">
                View All Products
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors group">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/emi-calculator" className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/blog" className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/referral-partner" className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Referral Partner
                </Link>
              </li>
            </ul>
            <Link href="/services" className="inline-block mt-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#304AC0] hover:bg-[#13277E] rounded-full px-4 py-1.5 transition-colors duration-200">
                View All Services
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors group">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {[
                  { icon: Linkedin, href: "#" },
                  { icon: Facebook, href: "#" },
                  { icon: Instagram, href: "#" },
                ].map((social, i) => (
                  <a key={i} href={social.href} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#304AC0] transition-colors">
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Credora Fintech Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#304AC0] transition-colors">
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
