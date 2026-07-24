"use client";

/**
 * BlogPostsPanel — admin panel for managing blog posts.
 *
 * Self-contained: only depends on React, lucide-react, the shared
 * admin-client / icon-registry helpers, shadcn/ui primitives, and the
 * BlogPost type from blog-data. Reads + writes via the
 * /api/admin/blog-posts REST endpoints (see worklog Task ID 2).
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  RefreshCw,
  Search,
  Star,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  FileText,
} from "lucide-react";
import { apiFetch, canEdit, type AdminUser } from "@/lib/admin-client";
import { ICON_OPTIONS } from "@/lib/icon-registry";
import { Switch } from "@/components/ui/switch";
import { DynamicIcon } from "@/components/DynamicIcon";
import { type BlogPost } from "@/lib/blog-data";

/** Admin blog post = public BlogPost + admin metadata. */
interface AdminBlogPost extends BlogPost {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ─── Brand colours ─── */
const B = { navy: "#1C1D62", blue: "#304AC0", green: "#87B73C" };

/* ─── Form state ─── */
interface FormState {
  id: string;
  category: string;
  categoryIcon: string;
  title: string;
  excerpt: string;
  contentText: string;
  author: string;
  date: string;
  readTime: string;
  color: string;
  featured: boolean;
  isActive: boolean;
  tagsText: string;
  image: string;
}

const EMPTY_FORM: FormState = {
  id: "",
  category: "",
  categoryIcon: "FileText",
  title: "",
  excerpt: "",
  contentText: "",
  author: "Credora Advisory Team",
  date: new Date().toISOString().slice(0, 10),
  readTime: "5 min read",
  color: B.blue,
  featured: false,
  isActive: true,
  tagsText: "",
  image: "",
};

function postToForm(p: AdminBlogPost): FormState {
  return {
    id: p.id,
    category: p.category,
    categoryIcon: p.categoryIcon || "FileText",
    title: p.title,
    excerpt: p.excerpt,
    contentText: Array.isArray(p.content) ? p.content.join("\n") : "",
    author: p.author,
    date: p.date,
    readTime: p.readTime,
    color: p.color,
    featured: !!p.featured,
    isActive: p.isActive !== false,
    tagsText: Array.isArray(p.tags) ? p.tags.join(", ") : "",
    image: p.image,
  };
}

function fmtDate(d: string): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(d).slice(0, 10);
  }
}

/* ─── Skeleton ─── */
function Skeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
          <div className="flex gap-4">
            <div className="w-24 h-16 rounded-lg bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded bg-gray-100" />
              <div className="h-2.5 w-1/2 rounded bg-gray-100" />
              <div className="h-2.5 w-1/3 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Toast ─── */
function Toast({ msg }: { msg: string }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
      style={{ background: B.navy, boxShadow: "0 8px 32px rgba(28,29,98,0.25)" }}
    >
      <Check size={15} className="shrink-0" />
      {msg}
    </div>
  );
}

/* ─── Confirm delete ─── */
function ConfirmDelete({
  title,
  onCancel,
  onConfirm,
}: {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <h3 className="text-[15px] font-bold text-gray-900 mb-1">Delete blog post?</h3>
        <p className="text-sm text-gray-400 mb-6 line-clamp-2">{title}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Field wrapper ─── */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{hint}</p>}
    </div>
  );
}

/* ─── Post form modal ─── */
function PostFormModal({
  post,
  existingCategories,
  onClose,
  onSave,
}: {
  post: AdminBlogPost | null;
  existingCategories: string[];
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}) {
  const isEdit = !!post;
  const [form, setForm] = useState<FormState>(post ? postToForm(post) : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-gray-900 placeholder:text-gray-300 bg-white";

  async function handleSave() {
    if (!form.title.trim() || !form.excerpt.trim() || !form.image.trim()) {
      setErr("Title, excerpt, and image are required.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const payload: Record<string, unknown> = {
        category: form.category.trim(),
        categoryIcon: form.categoryIcon,
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.contentText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        author: form.author.trim() || "Credora Advisory Team",
        date: form.date,
        readTime: form.readTime.trim() || "5 min read",
        color: form.color,
        featured: form.featured,
        tags: form.tagsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        image: form.image.trim(),
        isActive: form.isActive,
      };
      if (isEdit) {
        payload.id = post!.id;
      } else if (form.id.trim()) {
        payload.id = form.id.trim();
      }
      await onSave(payload);
      onClose();
    } catch (e: unknown) {
      const msg = (e as Error).message || "Failed to save.";
      if (/already exist|slug|conflict|409/i.test(msg)) {
        setErr("A post with that slug already exists. Edit the slug/title.");
      } else {
        setErr(msg);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[13px] font-bold text-gray-900">
              {isEdit ? "Edit blog post" : "New blog post"}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isEdit ? "Update post details" : "Create a new blog post"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={15} className="text-gray-400" />
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Why Your Credit Profile Matters More Than Your CIBIL Score"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Slug (id)"
              hint={isEdit ? "Slug cannot be changed after creation." : "Leave empty to auto-generate from the title."}
            >
              <input
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                placeholder="auto-generated from title"
                disabled={isEdit}
                className={inputCls + (isEdit ? " opacity-60 cursor-not-allowed" : "")}
              />
            </Field>
            <Field label="Category">
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Credit Health"
                list="blog-categories-dl"
                className={inputCls}
              />
              <datalist id="blog-categories-dl">
                {existingCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
          </div>

          <Field label="Category icon" hint="Pick a lucide icon to display next to the category.">
            <div className="flex items-center gap-2">
              <select
                value={form.categoryIcon}
                onChange={(e) => setForm((f) => ({ ...f, categoryIcon: e.target.value }))}
                className={inputCls + " cursor-pointer pr-8"}
              >
                {ICON_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 border border-gray-200"
                style={{ backgroundColor: `${form.color}10`, color: form.color }}
                aria-hidden
              >
                <DynamicIcon name={form.categoryIcon} size={16} />
              </div>
            </div>
          </Field>

          <Field label="Excerpt">
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={3}
              placeholder="Short summary shown on cards and search results…"
              className={inputCls + " resize-none"}
            />
          </Field>

          <Field label="Image URL / path" hint="Use a relative path like /images/blog/post.png or an absolute URL.">
            <input
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="/images/blog/post.png"
              className={inputCls}
            />
          </Field>

          <Field label="Content" hint="One paragraph per line. Blank lines are ignored.">
            <textarea
              value={form.contentText}
              onChange={(e) => setForm((f) => ({ ...f, contentText: e.target.value }))}
              rows={8}
              placeholder={"First paragraph goes here.\n\nSecond paragraph goes here."}
              className={inputCls + " resize-y min-h-[180px]"}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Author">
              <input
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Credora Advisory Team"
                className={inputCls}
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="Read time">
              <input
                value={form.readTime}
                onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
                placeholder="5 min read"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Tags" hint="Comma separated, e.g. Credit Profile, CIBIL, Loan Approval">
            <input
              value={form.tagsText}
              onChange={(e) => setForm((f) => ({ ...f, tagsText: e.target.value }))}
              placeholder="Credit Profile, CIBIL, Loan Approval"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <Field label="Accent colour">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer bg-white p-0.5"
                />
                <input
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className={inputCls + " font-mono"}
                />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-[12px] font-semibold text-gray-700">Featured</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Show in featured row</p>
                </div>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-[12px] font-semibold text-gray-700">Active</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Visible publicly</p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                />
              </div>
            </div>
          </div>

          {err && (
            <div className="flex items-center gap-2 text-red-600 text-[12px] bg-red-50 px-3 py-2.5 rounded-lg border border-red-100">
              <AlertTriangle size={13} />
              {err}
            </div>
          )}
        </div>

        {/* footer */}
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
                {isEdit ? "Save changes" : "Create post"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Single post row card ─── */
function PostRow({
  post,
  editable,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
}: {
  post: AdminBlogPost;
  editable: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onToggleFeatured: () => void;
}) {
  const isActive = post.isActive !== false;
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
      style={{ borderTop: `3px solid ${post.color || B.blue}` }}
    >
      <div className="p-4 flex gap-4">
        {/* Thumbnail */}
        <div className="relative w-24 h-20 sm:w-28 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <FileText size={18} />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">
              {post.title}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              {post.featured && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#FEF7E6", color: "#B45309" }}
                  title="Featured"
                >
                  <Star size={9} className="fill-current" />
                  Featured
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ color: post.color, backgroundColor: `${post.color}10` }}
            >
              <DynamicIcon name={post.categoryIcon} size={10} />
              {post.category || "Uncategorised"}
            </span>
            <span className="text-[10px] text-gray-400">{fmtDate(post.date)}</span>
            <span className="text-[10px] text-gray-400">·</span>
            <span className="text-[10px] text-gray-400">{post.readTime}</span>
          </div>

          <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              {/* Active toggle */}
              {editable ? (
                <div className="flex items-center gap-1.5">
                  <Switch checked={isActive} onCheckedChange={onToggleActive} />
                  <span
                    className="text-[10px] font-semibold flex items-center gap-1"
                    style={{ color: isActive ? "#15803D" : "#9CA3AF" }}
                  >
                    {isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                    {isActive ? "Active" : "Hidden"}
                  </span>
                </div>
              ) : (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "#F0FDF4" : "#FFF1F2",
                    color: isActive ? "#15803D" : "#BE123C",
                  }}
                >
                  {isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                  {isActive ? "Active" : "Hidden"}
                </span>
              )}

              {/* Featured toggle */}
              {editable && (
                <button
                  onClick={onToggleFeatured}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors"
                  style={{
                    background: post.featured ? "#FEF7E6" : "#F9FAFB",
                    color: post.featured ? "#B45309" : "#9CA3AF",
                  }}
                  title={post.featured ? "Unfeature" : "Mark as featured"}
                >
                  <Star size={10} className={post.featured ? "fill-current" : ""} />
                  {post.featured ? "Featured" : "Feature"}
                </button>
              )}
            </div>

            {editable && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <Pencil size={11} />
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                  title="Delete post"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main panel ─── */
export default function BlogPostsPanel({ user }: { user: AdminUser }) {
  const editable = canEdit(user);
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<AdminBlogPost | null | "new">(null);
  const [confirmDel, setConfirmDel] = useState<AdminBlogPost | null>(null);
  const [toast, setToast] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch<{ data?: AdminBlogPost[] }>(
        "/api/admin/blog-posts?limit=100"
      );
      setPosts(Array.isArray(d.data) ? d.data : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 3000);
  }

  // Existing category list (for the form datalist).
  const existingCategories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  // Client-side search filter (title + category).
  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [posts, query]);

  async function handleSave(data: Record<string, unknown>) {
    const isEdit = !!data.id;
    await apiFetch("/api/admin/blog-posts", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    showToast(isEdit ? "Blog post updated" : "Blog post created");
    load();
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch("/api/admin/blog-posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      showToast("Post deleted");
    } catch (e) {
      showToast((e as Error).message || "Delete failed");
    } finally {
      setConfirmDel(null);
      load();
    }
  }

  async function toggleActive(p: AdminBlogPost) {
    setBusyId(p.id);
    try {
      await apiFetch("/api/admin/blog-posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, isActive: !(p.isActive !== false) }),
      });
      load();
    } catch (e) {
      showToast((e as Error).message || "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeatured(p: AdminBlogPost) {
    setBusyId(p.id);
    try {
      await apiFetch("/api/admin/blog-posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, featured: !p.featured }),
      });
      load();
    } catch (e) {
      showToast((e as Error).message || "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      {toast && <Toast msg={toast} />}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Blog Posts</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Manage blog articles shown on the public /blog pages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or category…"
              className="border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-[12px] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-gray-900 placeholder:text-gray-300 bg-white w-56"
            />
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
          {editable ? (
            <button
              onClick={() => setForm("new")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90"
              style={{ background: B.navy }}
            >
              <Plus size={14} />
              New Post
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-medium text-gray-400">
              <EyeOff size={12} />
              Read-only — viewer role
            </span>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <Skeleton />
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <FileText size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-700">
            {posts.length === 0 ? "No blog posts yet" : "No posts match your search"}
          </p>
          <p className="text-[12px] text-gray-400 mt-1">
            {posts.length === 0
              ? "Create your first blog post to display it on the public site."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((p) => (
            <div
              key={p.id}
              className={busyId === p.id ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}
            >
              <PostRow
                post={p}
                editable={editable}
                onEdit={() => setForm(p)}
                onDelete={() => setConfirmDel(p)}
                onToggleActive={() => toggleActive(p)}
                onToggleFeatured={() => toggleFeatured(p)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {form !== null && (
        <PostFormModal
          post={form === "new" ? null : form}
          existingCategories={existingCategories}
          onClose={() => setForm(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <ConfirmDelete
          title={confirmDel.title}
          onCancel={() => setConfirmDel(null)}
          onConfirm={() => handleDelete(confirmDel.id)}
        />
      )}
    </div>
  );
}
