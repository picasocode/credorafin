"use client";

/**
 * HeroSlidesPanel — admin CRUD panel for the homepage hero slides.
 *
 * Self-contained: only depends on react, lucide-react, @/lib/admin-client,
 * @/lib/icon-registry, and @/components/ui/* primitives. Styled to match
 * the existing dashboard aesthetic (PositionsPanel reference).
 */

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  Check,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { apiFetch, type AdminUser, canEdit } from "@/lib/admin-client";
import { getIcon, ICON_OPTIONS } from "@/lib/icon-registry";

/* ─── Types ─── */
interface AdminHeroSlide {
  id: string;
  badge: string;
  headingWords: string[];
  subtitle: string;
  cta1: string;
  cta2: string;
  image: string;
  fallbackImage: string;
  hudLeftMetric: string;
  hudLeftLabel: string;
  hudLeftStatus: string;
  hudRightMetric: string;
  hudRightLabel: string;
  hudRightTrend: string;
  hudGraphValue: string;
  hudGraphLabel: string;
  tabLabel: string;
  tabIcon: string;
  accent: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

type SlideFormState = Omit<AdminHeroSlide, "id" | "createdAt" | "updatedAt">;

/* ─── Shared palette (mirrors dashboard B) ─── */
const B = { navy: "#1C1D62", blue: "#304AC0", green: "#87B73C" };

const EMPTY_FORM: SlideFormState = {
  badge: "",
  headingWords: [],
  subtitle: "",
  cta1: "Build Finance",
  cta2: "Contact us",
  image: "",
  fallbackImage: "",
  hudLeftMetric: "",
  hudLeftLabel: "",
  hudLeftStatus: "",
  hudRightMetric: "",
  hudRightLabel: "",
  hudRightTrend: "",
  hudGraphValue: "",
  hudGraphLabel: "",
  tabLabel: "",
  tabIcon: "Building2",
  accent: "#1A2255",
  isActive: true,
  sortOrder: 0,
};

/* ─── Main panel ─── */
export default function HeroSlidesPanel({ user }: { user: AdminUser }) {
  const editable = canEdit(user);
  const [slides, setSlides] = useState<AdminHeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<{ mode: "new" | "edit"; data: AdminHeroSlide | null } | null>(null);
  const [confirmDel, setConfirmDel] = useState<AdminHeroSlide | null>(null);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const d = await apiFetch<{ data: AdminHeroSlide[] }>("/api/admin/hero-slides");
      setSlides(Array.isArray(d?.data) ? d.data : []);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to load hero slides");
      setSlides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function showToast(m: string) {
    setToast(m);
    window.setTimeout(() => setToast(""), 3000);
  }

  async function handleSave(data: SlideFormState, id?: string) {
    if (id) {
      await apiFetch("/api/admin/hero-slides", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      showToast("Slide updated");
    } else {
      await apiFetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      showToast("Slide created");
    }
    await load();
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch("/api/admin/hero-slides", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      setConfirmDel(null);
      showToast("Slide deleted");
      await load();
    } catch (e: unknown) {
      setConfirmDel(null);
      showToast((e as Error).message || "Failed to delete");
    }
  }

  async function toggleActive(s: AdminHeroSlide) {
    try {
      await apiFetch("/api/admin/hero-slides", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, isActive: !s.isActive }),
      });
      await load();
    } catch (e: unknown) {
      showToast((e as Error).message || "Failed to toggle");
    }
  }

  async function moveSort(s: AdminHeroSlide, dir: -1 | 1) {
    const sorted = [...slides].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((x) => x.id === s.id);
    const neighbor = sorted[idx + dir];
    if (!neighbor) return;
    try {
      await Promise.all([
        apiFetch("/api/admin/hero-slides", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: s.id, sortOrder: neighbor.sortOrder }),
        }),
        apiFetch("/api/admin/hero-slides", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: neighbor.id, sortOrder: s.sortOrder }),
        }),
      ]);
      await load();
    } catch (e: unknown) {
      showToast((e as Error).message || "Failed to reorder");
    }
  }

  const sortedSlides = [...slides].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      {/* toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
          style={{ background: B.navy, boxShadow: "0 8px 32px rgba(28,29,98,0.25)" }}
        >
          <Check size={15} className="shrink-0" />
          {toast}
        </div>
      )}

      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Hero Slides</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Manage the rotating slides on the homepage hero
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
          {editable ? (
            <button
              onClick={() => setForm({ mode: "new", data: null })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90"
              style={{ background: B.navy }}
            >
              <Plus size={14} />
              Add slide
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 text-[11px] font-medium text-gray-400 border border-gray-100">
              <Eye size={12} />
              Read-only — viewer role
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-[12px] bg-red-50 px-3 py-2.5 rounded-lg border border-red-100">
          <AlertTriangle size={13} />
          {error}
        </div>
      )}

      {/* body */}
      {loading ? (
        <div className="p-6 space-y-3 animate-pulse">
          {[88, 72, 80, 64, 76].map((w, i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-gray-100"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <Sparkles size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-700">No hero slides yet</p>
          <p className="text-[12px] text-gray-400 mt-1">
            {editable
              ? "Create your first slide to display it in the homepage hero."
              : "No slides have been configured yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSlides.map((s, idx) => {
            const TabIcon = getIcon(s.tabIcon);
            return (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all flex items-stretch overflow-hidden"
              >
                {/* accent left border */}
                <div
                  className="w-1.5 shrink-0"
                  style={{ background: s.accent || B.navy }}
                />

                <div className="flex-1 p-4 flex items-center gap-4 flex-wrap">
                  {/* sort order badge */}
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ background: B.navy }}
                    title={`Sort order ${s.sortOrder}`}
                  >
                    {s.sortOrder + 1}
                  </div>

                  {/* thumbnail */}
                  <div className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                    {s.image ? (
                      <Image
                        src={s.image}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={16} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* main info */}
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center gap-2 mb-1">
                      <TabIcon
                        size={13}
                        className="shrink-0"
                        style={{ color: s.accent || B.navy }}
                      />
                      <span className="text-[13px] font-bold text-gray-900 truncate">
                        {s.tabLabel || "Untitled slide"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate uppercase tracking-wide">
                      {s.badge}
                    </p>
                    <p className="text-[12px] text-gray-600 truncate mt-0.5">
                      {Array.isArray(s.headingWords) ? s.headingWords.join(" ") : ""}
                    </p>
                  </div>

                  {/* active toggle */}
                  {editable ? (
                    <button
                      onClick={() => toggleActive(s)}
                      className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                      style={{
                        background: s.isActive ? "#F0FDF4" : "#FFF1F2",
                        color: s.isActive ? "#15803D" : "#BE123C",
                      }}
                      title={s.isActive ? "Active — click to hide" : "Hidden — click to show"}
                    >
                      {s.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                      {s.isActive ? "Active" : "Hidden"}
                    </button>
                  ) : (
                    <span
                      className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: s.isActive ? "#F0FDF4" : "#FFF1F2",
                        color: s.isActive ? "#15803D" : "#BE123C",
                      }}
                    >
                      {s.isActive ? "Active" : "Hidden"}
                    </span>
                  )}

                  {/* actions */}
                  {editable && (
                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        onClick={() => moveSort(s, -1)}
                        disabled={idx === 0}
                        title="Move up"
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => moveSort(s, 1)}
                        disabled={idx === sortedSlides.length - 1}
                        title="Move down"
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        onClick={() => setForm({ mode: "edit", data: s })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                      >
                        <Edit3 size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDel(s)}
                        title="Delete slide"
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* form modal */}
      {form && (
        <SlideFormModal
          mode={form.mode}
          slide={form.data}
          onClose={() => setForm(null)}
          onSave={handleSave}
        />
      )}

      {/* confirm delete */}
      {confirmDel && (
        <ConfirmDelete
          label={confirmDel.tabLabel || confirmDel.badge || "this slide"}
          onCancel={() => setConfirmDel(null)}
          onConfirm={() => handleDelete(confirmDel.id)}
        />
      )}
    </div>
  );
}

/* ─── Slide form modal ─── */
function SlideFormModal({
  mode,
  slide,
  onClose,
  onSave,
}: {
  mode: "new" | "edit";
  slide: AdminHeroSlide | null;
  onClose: () => void;
  onSave: (data: SlideFormState, id?: string) => Promise<void>;
}) {
  const isEdit = mode === "edit" && !!slide;

  const [form, setForm] = useState<SlideFormState>(() => {
    if (slide) {
      return {
        badge: slide.badge ?? "",
        headingWords: Array.isArray(slide.headingWords) ? slide.headingWords : [],
        subtitle: slide.subtitle ?? "",
        cta1: slide.cta1 ?? "",
        cta2: slide.cta2 ?? "",
        image: slide.image ?? "",
        fallbackImage: slide.fallbackImage ?? "",
        hudLeftMetric: slide.hudLeftMetric ?? "",
        hudLeftLabel: slide.hudLeftLabel ?? "",
        hudLeftStatus: slide.hudLeftStatus ?? "",
        hudRightMetric: slide.hudRightMetric ?? "",
        hudRightLabel: slide.hudRightLabel ?? "",
        hudRightTrend: slide.hudRightTrend ?? "",
        hudGraphValue: slide.hudGraphValue ?? "",
        hudGraphLabel: slide.hudGraphLabel ?? "",
        tabLabel: slide.tabLabel ?? "",
        tabIcon: slide.tabIcon ?? "Building2",
        accent: slide.accent ?? "#1A2255",
        isActive: slide.isActive !== false,
        sortOrder: Number(slide.sortOrder) || 0,
      };
    }
    return { ...EMPTY_FORM };
  });
  const [headingText, setHeadingText] = useState(
    slide && Array.isArray(slide.headingWords) ? slide.headingWords.join(" ") : ""
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-gray-900 placeholder:text-gray-300 bg-white";

  async function handleSave() {
    const words = headingText
      .split(/\s+/)
      .map((w) => w.trim())
      .filter(Boolean);
    if (!form.badge.trim() || !form.tabLabel.trim() || words.length === 0) {
      setErr("Badge, tab label, and heading words are required.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const payload: SlideFormState = {
        ...form,
        headingWords: words,
        sortOrder: Number(form.sortOrder) || 0,
      };
      await onSave(payload, isEdit ? slide!.id : undefined);
      onClose();
    } catch (e: unknown) {
      setErr((e as Error).message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  const Field = ({
    label,
    hint,
    children,
  }: {
    label: string;
    hint?: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-gray-300 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[13px] font-bold text-gray-900">
              {isEdit ? "Edit hero slide" : "Add hero slide"}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isEdit ? "Update slide content" : "Create a new rotating hero slide"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={15} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Badge">
              <input
                value={form.badge}
                onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                placeholder="Empowering Enterprises"
                className={inputCls}
              />
            </Field>
            <Field label="Tab label">
              <input
                value={form.tabLabel}
                onChange={(e) => setForm((f) => ({ ...f, tabLabel: e.target.value }))}
                placeholder="Business Loans"
                className={inputCls}
              />
            </Field>
          </div>

          <Field
            label="Heading words"
            hint="Separate words with spaces — they animate word-by-word in the hero (last word is highlighted)."
          >
            <input
              value={headingText}
              onChange={(e) => setHeadingText(e.target.value)}
              placeholder="Accelerate Your MSME Growth"
              className={inputCls}
            />
          </Field>

          <Field label="Subtitle">
            <textarea
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              rows={2}
              placeholder="Customized collateral-free funding solutions…"
              className={inputCls + " resize-none"}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Primary CTA">
              <input
                value={form.cta1}
                onChange={(e) => setForm((f) => ({ ...f, cta1: e.target.value }))}
                placeholder="Build Finance"
                className={inputCls}
              />
            </Field>
            <Field label="Secondary CTA">
              <input
                value={form.cta2}
                onChange={(e) => setForm((f) => ({ ...f, cta2: e.target.value }))}
                placeholder="Contact us"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Image URL / path">
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="/images/pages/hero-indian-team.png"
                className={inputCls}
              />
            </Field>
            <Field label="Fallback image URL">
              <input
                value={form.fallbackImage}
                onChange={(e) => setForm((f) => ({ ...f, fallbackImage: e.target.value }))}
                placeholder="https://images.unsplash.com/…"
                className={inputCls}
              />
            </Field>
          </div>

          {/* HUD left */}
          <div className="rounded-xl border border-gray-100 p-3 space-y-3 bg-gray-50/40">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              HUD — left floater
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Metric">
                <input
                  value={form.hudLeftMetric}
                  onChange={(e) => setForm((f) => ({ ...f, hudLeftMetric: e.target.value }))}
                  placeholder="+18%"
                  className={inputCls}
                />
              </Field>
              <Field label="Label">
                <input
                  value={form.hudLeftLabel}
                  onChange={(e) => setForm((f) => ({ ...f, hudLeftLabel: e.target.value }))}
                  placeholder="Market Forecast"
                  className={inputCls}
                />
              </Field>
              <Field label="Status">
                <input
                  value={form.hudLeftStatus}
                  onChange={(e) => setForm((f) => ({ ...f, hudLeftStatus: e.target.value }))}
                  placeholder="Optimal Condition"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* HUD right */}
          <div className="rounded-xl border border-gray-100 p-3 space-y-3 bg-gray-50/40">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              HUD — right floater
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Metric">
                <input
                  value={form.hudRightMetric}
                  onChange={(e) => setForm((f) => ({ ...f, hudRightMetric: e.target.value }))}
                  placeholder="9.5% p.a."
                  className={inputCls}
                />
              </Field>
              <Field label="Label">
                <input
                  value={form.hudRightLabel}
                  onChange={(e) => setForm((f) => ({ ...f, hudRightLabel: e.target.value }))}
                  placeholder="Average Interest Rate"
                  className={inputCls}
                />
              </Field>
              <Field label="Trend">
                <input
                  value={form.hudRightTrend}
                  onChange={(e) => setForm((f) => ({ ...f, hudRightTrend: e.target.value }))}
                  placeholder="Stable"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* HUD bottom */}
          <div className="rounded-xl border border-gray-100 p-3 space-y-3 bg-gray-50/40">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              HUD — bottom floater
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Value">
                <input
                  value={form.hudGraphValue}
                  onChange={(e) => setForm((f) => ({ ...f, hudGraphValue: e.target.value }))}
                  placeholder="₹50 Crores"
                  className={inputCls}
                />
              </Field>
              <Field label="Label">
                <input
                  value={form.hudGraphLabel}
                  onChange={(e) => setForm((f) => ({ ...f, hudGraphLabel: e.target.value }))}
                  placeholder="Max Liquidity Pool Available"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <Field label="Tab icon">
              <select
                value={form.tabIcon}
                onChange={(e) => setForm((f) => ({ ...f, tabIcon: e.target.value }))}
                className={inputCls}
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Accent colour">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.accent}
                  onChange={(e) => setForm((f) => ({ ...f, accent: e.target.value }))}
                  className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer shrink-0"
                />
                <input
                  value={form.accent}
                  onChange={(e) => setForm((f) => ({ ...f, accent: e.target.value }))}
                  className={inputCls + " font-mono"}
                />
              </div>
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))
                }
                className={inputCls}
              />
            </Field>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <p className="text-[12px] font-semibold text-gray-700">Active</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Show this slide on the homepage hero
              </p>
            </div>
            <button
              onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              className="relative rounded-full transition-colors shrink-0"
              style={{ width: 40, height: 22, background: form.isActive ? B.blue : "#D1D5DB" }}
            >
              <span
                className="absolute top-0.5 bg-white rounded-full shadow transition-transform"
                style={{
                  width: 18,
                  height: 18,
                  left: 2,
                  transform: form.isActive ? "translateX(18px)" : "translateX(0)",
                }}
              />
            </button>
          </div>

          {err && (
            <div className="flex items-center gap-2 text-red-600 text-[12px] bg-red-50 px-3 py-2.5 rounded-lg border border-red-100">
              <AlertTriangle size={13} />
              {err}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: B.navy }}
          >
            {saving ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={13} />
                {isEdit ? "Save changes" : "Create slide"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Confirm delete modal ─── */
function ConfirmDelete({
  label,
  onCancel,
  onConfirm,
}: {
  label: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <h3 className="text-[15px] font-bold text-gray-900 mb-1">Delete slide?</h3>
        <p className="text-sm text-gray-400 mb-6">
          &ldquo;{label}&rdquo; will be permanently removed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setDeleting(true);
              await onConfirm();
              setDeleting(false);
            }}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
