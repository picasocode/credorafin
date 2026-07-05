"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle, Loader2, Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (searchParams.get("expired")) setError("Your session expired. Please sign in again.");
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials."); setLoading(false); return; }
      if (data.success) {
        router.refresh();
        router.push(searchParams.get("redirect") || "/admin/dashboard");
      }
      else { setError("Login failed. Please try again."); setLoading(false); }
    } catch { setError("Network error. Check your connection."); setLoading(false); }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", background: "#F9FAFB" }}
    >
      {/* ── Left: Form ── */}
      <div className={`flex-1 flex flex-col items-center justify-center px-6 py-12 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <div className="w-full max-w-[380px]">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <Image src="/images/credora-logo.png" alt="Credora" width={36} height={36} className="object-contain" />
            <div>
              <p className="text-[15px] font-bold text-gray-900" style={{ letterSpacing: "-0.02em" }}>Credora Fintech</p>
              <p className="text-[11px] text-gray-400 font-medium">Admin Console</p>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-[26px] font-bold text-gray-900 mb-1.5" style={{ letterSpacing: "-0.03em" }}>
            Sign in
          </h1>
          <p className="text-[13px] text-gray-400 mb-8">
            Enter your credentials to access the dashboard.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="admin@credora.in"
                  className="w-full border border-gray-200 bg-white rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-300 outline-none transition-all"
                  style={{ fontFamily: "inherit" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#304AC0"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  required placeholder="Enter your password"
                  className="w-full border border-gray-200 bg-white rounded-lg pl-10 pr-10 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-300 outline-none transition-all"
                  style={{ fontFamily: "inherit" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#304AC0"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-100 text-[12px] text-red-600">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all disabled:opacity-60 mt-2 group"
              style={{ background: "#1C1D62" }}
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" />Signing in…</>
                : <>Sign in<ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></>
              }
            </button>
          </form>

          {/* Security note */}
          <div className="flex items-center gap-2 mt-8 pt-8 border-t border-gray-100">
            <ShieldCheck size={13} className="text-gray-300 shrink-0" />
            <p className="text-[11px] text-gray-400">
              Restricted area. All sessions expire in 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: "#1C1D62" }}
      >
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>
        </div>
        {/* Glow */}
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #87B73C 0%, transparent 70%)" }} />

        {/* Top logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/images/credora-logo-full.png" alt="Credora" width={130} height={40} className="object-contain brightness-0 invert" />
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Admin Console</p>
          <h2 className="text-3xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
            Manage everything<br />from one place.
          </h2>
          <p className="text-[13px] text-white/50 leading-relaxed mb-8 max-w-xs">
            Contacts, referral partners, job applications, product brochures, and multi-user access — all in one secure dashboard.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              "Multi-user access with role permissions",
              "Full CRUD on all inquiry types",
              "Product & brochure management",
              "CSV export and bulk operations",
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(135,183,60,0.2)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#87B73C" }} />
                </div>
                <p className="text-[12px] text-white/60">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-[11px] text-white/20">© {new Date().getFullYear()} Credora Fintech Private Limited</p>
        </div>
      </div>
    </div>
  );
}
