"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Phone, Mail, ChevronDown, ChevronRight, ArrowRight,
  Building2, Link2, Globe, HardHat, Puzzle,
  CreditCard, FileCheck, Banknote, HeadphonesIcon,
} from "lucide-react";
import { navLinks, products, services } from "@/lib/data";
import { Button } from "@/components/ui/button";

const productIconMap: Record<string, React.ElementType> = {
  Building2, Link2, Globe, HardHat, Puzzle,
};

const serviceIconMap: Record<string, React.ElementType> = {
  CreditCard, FileCheck, Banknote, HeadphonesIcon,
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
    setHoveredProduct(null);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setHoveredProduct(null);
    }, 250);
  };

  // Get hovered product data for the megamenu middle column
  const hoveredProductData = products.find((p) => p.slug === hoveredProduct) || products[0];

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-[#1C1D62] text-white text-sm py-2 relative z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+919344899971" className="flex items-center gap-2 hover:text-[#87B73C] transition-colors">
              <Phone className="w-3.5 h-3.5" /> +91 93448 99971
            </a>
            <a href="mailto:info@credorafin.com" className="flex items-center gap-2 hover:text-[#87B73C] transition-colors">
              <Mail className="w-3.5 h-3.5" /> info@credorafin.com
            </a>
          </div>
          <span className="text-white/70">Mon – Sat: 9:00 AM – 6:00 PM</span>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-[#E8ECF0]" : "bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.img src="/images/credora-logo.png" alt="Credora Fintech" className="h-10 w-auto object-contain" whileHover={{ scale: 1.02 }} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isProducts = link.label === "Products";
                const isServices = link.label === "Services";

                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => link.children && handleDropdownEnter(link.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(link.href) ? "text-[#304AC0]" : "text-[#2D3748] hover:text-[#304AC0]"
                      }`}
                    >
                      {link.label}
                      {link.children && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`} />
                      )}
                      {isActive(link.href) && (
                        <motion.div layoutId="activeNav" className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#304AC0] rounded-full" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                      )}
                    </Link>

                    {/* ── Products Megamenu ── */}
                    <AnimatePresence>
                      {isProducts && link.children && openDropdown === link.label && (
                        <motion.div
                          ref={megaMenuRef}
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.97 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[960px] bg-white rounded-2xl shadow-2xl border border-[#E8ECF0] overflow-hidden"
                          onMouseEnter={() => handleDropdownEnter(link.label)}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="grid grid-cols-[260px_1fr_320px]">
                            {/* ── Column 1: Product Categories ── */}
                            <div className="bg-[#F7F9FC] border-r border-[#E8ECF0]">
                              {/* Header accent bar */}
                              <div className="bg-[#87B73C] px-5 py-3">
                                <h3 className="text-white text-sm font-bold uppercase tracking-wider">Our Products</h3>
                              </div>
                              <div className="py-2">
                                {products.map((product) => {
                                  const PIcon = productIconMap[product.icon];
                                  const isHovered = hoveredProduct === product.slug;
                                  return (
                                    <Link
                                      key={product.slug}
                                      href={`/products/${product.slug}`}
                                      onClick={handleLinkClick}
                                      onMouseEnter={() => setHoveredProduct(product.slug)}
                                      className={`flex items-center gap-3 px-5 py-3.5 text-sm transition-all duration-150 group ${
                                        isHovered
                                          ? "bg-white text-[#304AC0] shadow-sm"
                                          : "text-[#2D3748] hover:bg-white hover:text-[#304AC0]"
                                      }`}
                                    >
                                      <div
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                          isHovered ? "shadow-sm" : ""
                                        }`}
                                        style={{
                                          backgroundColor: isHovered ? `${product.color}15` : `${product.color}08`,
                                        }}
                                      >
                                        {PIcon && <PIcon className="w-4.5 h-4.5" style={{ color: product.color }} />}
                                      </div>
                                      <span className="font-medium flex-1">{product.title}</span>
                                      <ChevronRight className={`w-3.5 h-3.5 transition-opacity ${isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
                                    </Link>
                                  );
                                })}
                              </div>
                              {/* Bottom CTA */}
                              <div className="px-5 py-4 border-t border-[#E8ECF0]">
                                <Link
                                  href="/products"
                                  onClick={handleLinkClick}
                                  className="flex items-center justify-center gap-2 w-full bg-[#87B73C] hover:bg-[#6d9a2e] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors"
                                >
                                  Explore All Products
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>

                            {/* ── Column 2: Content Section (dynamic based on hover) ── */}
                            <div className="p-6">
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={hoveredProductData.slug}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {/* Product Title */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div
                                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                                      style={{ backgroundColor: `${hoveredProductData.color}12` }}
                                    >
                                      {(() => {
                                        const Icon = productIconMap[hoveredProductData.icon];
                                        return Icon ? <Icon className="w-5 h-5" style={{ color: hoveredProductData.color }} /> : null;
                                      })()}
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-bold text-[#1C1D62]">{hoveredProductData.title}</h4>
                                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: hoveredProductData.color }}>
                                        {hoveredProductData.shortDesc}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <p className="text-sm text-[#718096] leading-relaxed mb-5 line-clamp-3">
                                    {hoveredProductData.fullDesc}
                                  </p>

                                  {/* Key highlights */}
                                  <div className="space-y-2.5 mb-5">
                                    {hoveredProductData.benefits.slice(0, 3).map((benefit, i) => (
                                      <div key={i} className="flex items-start gap-2.5">
                                        <div
                                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                          style={{ backgroundColor: `${hoveredProductData.color}10` }}
                                        >
                                          <svg className="w-3 h-3" style={{ color: hoveredProductData.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                        <span className="text-sm text-[#2D3748] leading-snug">{benefit}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Stats Row */}
                                  {hoveredProductData.stats && (
                                    <div className="flex gap-4 mb-5 p-3 bg-[#F7F9FC] rounded-lg border border-[#E8ECF0]">
                                      {hoveredProductData.stats.slice(0, 3).map((stat, i) => (
                                        <div key={i} className="text-center flex-1">
                                          <div className="text-base font-bold" style={{ color: hoveredProductData.color }}>
                                            {stat.value}{stat.suffix}
                                          </div>
                                          <div className="text-[10px] text-[#718096] font-medium uppercase tracking-wide leading-tight">
                                            {stat.label}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* CTA */}
                                  <Link
                                    href={`/products/${hoveredProductData.slug}`}
                                    onClick={handleLinkClick}
                                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg border-2 transition-colors"
                                    style={{
                                      borderColor: hoveredProductData.color,
                                      color: hoveredProductData.color,
                                    }}
                                  >
                                    Know More
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </motion.div>
                              </AnimatePresence>
                            </div>

                            {/* ── Column 3: Popular Products Grid ── */}
                            <div className="bg-[#F7F9FC] border-l border-[#E8ECF0] p-5">
                              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#718096] mb-4">Popular Products</h4>
                              <div className="grid grid-cols-2 gap-3">
                                {products.flatMap((p) =>
                                  p.products.slice(0, 2).map((subProduct) => ({
                                    name: subProduct.name,
                                    slug: p.slug,
                                    color: p.color,
                                    icon: p.icon,
                                  }))
                                ).slice(0, 8).map((item, i) => {
                                  const IIcon = productIconMap[item.icon];
                                  return (
                                    <Link
                                      key={i}
                                      href={`/products/${item.slug}`}
                                      onClick={handleLinkClick}
                                      className="group flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E8ECF0] hover:shadow-md hover:border-[#304AC0]/20 transition-all duration-200"
                                    >
                                      <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: `${item.color}12` }}
                                      >
                                        {IIcon ? <IIcon className="w-3.5 h-3.5" style={{ color: item.color }} /> : (
                                          <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.name.charAt(0)}</span>
                                        )}
                                      </div>
                                      <span className="text-[11px] font-medium text-[#2D3748] leading-snug line-clamp-2 group-hover:text-[#304AC0] transition-colors text-left">
                                        {item.name}
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Services Megamenu ── */}
                    <AnimatePresence>
                      {isServices && link.children && openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.97 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[750px] bg-white rounded-2xl shadow-2xl border border-[#E8ECF0] overflow-hidden"
                          onMouseEnter={() => handleDropdownEnter(link.label)}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="grid grid-cols-[280px_1fr]">
                            {/* ── Left: Service Categories ── */}
                            <div className="bg-[#F7F9FC] border-r border-[#E8ECF0]">
                              <div className="bg-[#304AC0] px-5 py-3">
                                <h3 className="text-white text-sm font-bold uppercase tracking-wider">Our Services</h3>
                              </div>
                              <div className="py-2">
                                {services.map((service) => {
                                  const SIcon = serviceIconMap[service.icon];
                                  return (
                                    <Link
                                      key={service.slug}
                                      href={`/services/${service.slug}`}
                                      onClick={handleLinkClick}
                                      className="flex items-center gap-3 px-5 py-4 text-sm text-[#2D3748] hover:bg-white hover:text-[#304AC0] transition-all duration-150 group"
                                    >
                                      <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${service.color}10` }}
                                      >
                                        {SIcon ? <SIcon className="w-5 h-5" style={{ color: service.color }} /> : null}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <span className="font-semibold block">{service.title}</span>
                                        <span className="text-xs text-[#718096] line-clamp-1">{service.headline}</span>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                    </Link>
                                  );
                                })}
                              </div>
                              <div className="px-5 py-4 border-t border-[#E8ECF0]">
                                <Link
                                  href="/services"
                                  onClick={handleLinkClick}
                                  className="flex items-center justify-center gap-2 w-full bg-[#304AC0] hover:bg-[#13277E] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors"
                                >
                                  Explore All Services
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>

                            {/* ── Right: Service Overview ── */}
                            <div className="p-6">
                              <h4 className="text-sm font-bold uppercase tracking-widest text-[#718096] mb-5">Comprehensive Support Beyond Funding</h4>
                              <p className="text-sm text-[#718096] leading-relaxed mb-6">
                                Getting funded is only part of the journey. Our services ensure your credit profile is strong, your application is structured right, and you have support through every stage of the loan lifecycle.
                              </p>

                              {/* Service Flow Steps */}
                              <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                  { num: "01", label: "Assessment", desc: "Deep-dive into your profile & needs" },
                                  { num: "02", label: "Preparation", desc: "Fix gaps, structure applications" },
                                  { num: "03", label: "Execution", desc: "Submit to lenders, compare offers" },
                                  { num: "04", label: "Support", desc: "Post-disbursal tracking & closure" },
                                ].map((step) => (
                                  <div key={step.num} className="flex items-start gap-3 p-3 bg-[#F7F9FC] rounded-lg border border-[#E8ECF0]">
                                    <span className="text-xs font-bold text-[#304AC0] mt-0.5">{step.num}</span>
                                    <div>
                                      <span className="text-sm font-semibold text-[#1C1D62] block">{step.label}</span>
                                      <span className="text-xs text-[#718096]">{step.desc}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Highlights */}
                              <div className="space-y-2 mb-5">
                                {[
                                  "Single CIBIL enquiry across 70+ lenders",
                                  "Pre-underwritten applications get ~85% approval",
                                  "End-to-end support from assessment to disbursal",
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-[#87B73C]/10 flex items-center justify-center flex-shrink-0">
                                      <svg className="w-3 h-3 text-[#87B73C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <span className="text-sm text-[#2D3748]">{item}</span>
                                  </div>
                                ))}
                              </div>

                              <Link
                                href="/contact"
                                onClick={handleLinkClick}
                                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg bg-[#87B73C] hover:bg-[#6d9a2e] text-white transition-colors"
                              >
                                Get Started
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Simple Dropdown (for any other nav items with children) ── */}
                    <AnimatePresence>
                      {!isProducts && !isServices && link.children && openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-[#E8ECF0] overflow-hidden py-2"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={handleLinkClick}
                              className={`block px-5 py-3 text-sm transition-colors hover:bg-[#F0F4FF] hover:text-[#304AC0] ${
                                pathname === child.href ? "text-[#304AC0] bg-[#F0F4FF] font-medium" : "text-[#2D3748]"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                          <div className="border-t border-[#E8ECF0] mt-1 pt-1">
                            <Link href={link.href} onClick={handleLinkClick} className="block px-5 py-3 text-sm font-medium text-[#304AC0] hover:bg-[#F0F4FF] transition-colors">
                              View All →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/contact">
                <Button className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-6 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200">
                  Get Funded Now
                </Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-[#2D3748] hover:text-[#304AC0] transition-colors">
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-[#E8ECF0] overflow-hidden">
              <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
                {navLinks.map((link, i) => {
                  const isProducts = link.label === "Products";
                  const isServices = link.label === "Services";
                  return (
                    <div key={link.href}>
                      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}>
                        <div className="flex items-center">
                          <Link
                            href={link.href}
                            onClick={handleLinkClick}
                            className={`flex-1 block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              isActive(link.href) ? "bg-[#F0F4FF] text-[#304AC0]" : "text-[#2D3748] hover:bg-[#F0F4FF]"
                            }`}
                          >
                            {link.label}
                          </Link>
                          {link.children && (
                            <button
                              onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                              className="p-3 text-[#718096]"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                      <AnimatePresence>
                        {link.children && openDropdown === link.label && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-2">
                            {/* Mobile: show icon + name for products */}
                            {isProducts && products.map((product) => {
                              const PIcon = productIconMap[product.icon];
                              return (
                                <Link
                                  key={product.slug}
                                  href={`/products/${product.slug}`}
                                  onClick={handleLinkClick}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#718096] hover:text-[#304AC0] hover:bg-[#F0F4FF] rounded-lg transition-colors"
                                >
                                  <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${product.color}10` }}>
                                    {PIcon && <PIcon className="w-3.5 h-3.5" style={{ color: product.color }} />}
                                  </div>
                                  {product.title}
                                </Link>
                              );
                            })}
                            {isServices && services.map((service) => {
                              const SIcon = serviceIconMap[service.icon];
                              return (
                                <Link
                                  key={service.slug}
                                  href={`/services/${service.slug}`}
                                  onClick={handleLinkClick}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#718096] hover:text-[#304AC0] hover:bg-[#F0F4FF] rounded-lg transition-colors"
                                >
                                  <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${service.color}10` }}>
                                    {SIcon && <SIcon className="w-3.5 h-3.5" style={{ color: service.color }} />}
                                  </div>
                                  {service.title}
                                </Link>
                              );
                            })}
                            {!isProducts && !isServices && link.children.map((child) => (
                              <Link key={child.href} href={child.href} onClick={handleLinkClick} className="block px-4 py-2.5 text-sm text-[#718096] hover:text-[#304AC0] hover:bg-[#F0F4FF] rounded-lg transition-colors">
                                {child.label}
                              </Link>
                            ))}
                            <Link
                              href={link.href}
                              onClick={handleLinkClick}
                              className="block px-4 py-2.5 text-sm font-semibold text-[#304AC0] hover:bg-[#F0F4FF] rounded-lg transition-colors mt-1"
                            >
                              View All {link.label} →
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-[#E8ECF0]">
                  <Link href="/contact">
                    <Button className="w-full bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider">Get Funded Now</Button>
                  </Link>
                </div>
                <div className="pt-3 space-y-2 text-sm text-[#718096]">
                  <a href="tel:+919344899971" className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 93448 99971</a>
                  <a href="mailto:info@credorafin.com" className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@credorafin.com</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
