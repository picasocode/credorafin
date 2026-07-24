"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, Globe, MapPin, Linkedin, Facebook, Instagram, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+91 93448 99971", href: "tel:+919344899971" },
  { icon: Mail, label: "Email", value: "info@credorafin.com", href: "mailto:info@credorafin.com" },
  { icon: Globe, label: "Website", value: "www.credorafin.com", href: "https://credorafin.com" },
  { icon: MapPin, label: "Address", value: "1157, 17th St, Anna Nagar West Extension, Padi, Chennai, Tamil Nadu 600050", href: "#" },
];

const whyContact = [
  "Free financial assessment — no obligation",
  "Speak directly with an experienced advisor",
  "Get clarity on the right funding option for your business",
  "We respond within 1 business day",
];

export default function ContactUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.fullName as HTMLInputElement).value,
      businessName: (form.businessName as HTMLInputElement).value,
      businessType: (form.businessType as HTMLInputElement).value,
      fundingRequirement: (form.fundingRequirement as HTMLInputElement).value,
      phone: (form.phone as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      message: (form.message as HTMLTextAreaElement).value,
    };

    if (!data.name || !data.phone || !data.email) {
      toast({ title: "Required fields missing", description: "Please fill in name, phone, and email.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
        toast({ title: "Inquiry sent!", description: "Our advisor will contact you within 1 business day." });
      } else {
        toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#F0F4FF]/50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            Let&apos;s Talk About Your Funding Requirement.
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            Whether you&apos;re exploring your options or ready to apply, our team is here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left - Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-[#1C1D62] rounded-2xl p-6 text-white"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-5">
                {contactInfo.map((item, i) => (
                  <a key={i} href={item.href} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#304AC0] transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-white/60 uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="text-sm text-white/90 group-hover:text-white transition-colors">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social links */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-xs text-white/60 uppercase tracking-wider mb-3">Follow Us</div>
                <div className="flex gap-3">
                  {[
                    { icon: Linkedin, href: "#" },
                    { icon: Facebook, href: "#" },
                    { icon: Instagram, href: "#" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#304AC0] transition-colors"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#F0F4FF] rounded-2xl p-6"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-[#1C1D62] mb-4">Why Contact Us?</h3>
              <div className="space-y-3">
                {whyContact.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#87B73C] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#2D3748]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E8ECF0] shadow-lg">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2D3748] mb-1.5">Full Name *</label>
                      <Input name="fullName" placeholder="Your full name" className="h-11 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2D3748] mb-1.5">Business Name</label>
                      <Input name="businessName" placeholder="Your business name" className="h-11 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2D3748] mb-1.5">Business Type / Industry</label>
                      <Input name="businessType" placeholder="e.g. Manufacturing, Trading" className="h-11 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2D3748] mb-1.5">Funding Requirement (in ₹)</label>
                      <Input name="fundingRequirement" placeholder="e.g. ₹50,00,000" className="h-11 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2D3748] mb-1.5">Phone Number *</label>
                      <Input name="phone" type="tel" placeholder="+91 XXXXX XXXXX" className="h-11 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2D3748] mb-1.5">Email Address *</label>
                      <Input name="email" type="email" placeholder="your@email.com" className="h-11 rounded-lg" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2D3748] mb-1.5">Message / Describe your requirement</label>
                    <Textarea name="message" placeholder="Tell us about your funding needs..." className="rounded-lg min-h-[100px]" />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-10 py-3.5 rounded-md shadow-lg group"
                  >
                    {loading ? "Sending..." : "Send Inquiry"}
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#87B73C]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-[#87B73C]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1C1D62] mb-3">Thank You!</h3>
                  <p className="text-[#718096] max-w-sm mx-auto">
                    Thank you for reaching out. Our advisor will contact you within 1 business day.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="mt-6 border-[#304AC0] text-[#304AC0]"
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
