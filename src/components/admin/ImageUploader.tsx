"use client";

/**
 * ImageUploader — drag-and-drop / click-to-upload widget for the admin panel.
 *
 * Usage:
 *   <ImageUploader
 *     value={form.image}
 *     onChange={(url) => setForm((f) => ({ ...f, image: url }))}
 *     bucket="hero-slides"
 *     label="Slide image"
 *   />
 *
 * - Click or drop a file → uploads to /api/admin/upload?bucket=<bucket>
 * - On success: calls onChange(publicUrl) so the parent form stores the path.
 * - Shows a live preview thumbnail + a "Remove" button.
 * - Falls back to a plain URL text input for external URLs (toggle "Use URL
 *   instead").
 */
import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, Loader2, X, Link as LinkIcon, ImageIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
  hint?: string;
  /** optional aspect ratio hint shown in the drop zone, e.g. "1344 × 768" */
  recommendedSize?: string;
}

type Mode = "upload" | "url";

export default function ImageUploader({
  value,
  onChange,
  bucket = "hero-slides",
  label = "Image",
  hint,
  recommendedSize,
}: Props) {
  const [mode, setMode] = useState<Mode>(value && value.startsWith("http") ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const doUpload = useCallback(
    async (file: File) => {
      setErr("");
      if (!file.type.startsWith("image/")) {
        setErr("Please choose an image file (PNG, JPEG, WebP, GIF, SVG).");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErr("File too large. Maximum 10 MB.");
        return;
      }
      setUploading(true);
      setProgress(0);
      try {
        const fd = new FormData();
        fd.append("file", file);

        // Use XMLHttpRequest for progress events (fetch() doesn't expose upload progress).
        const url = `/api/admin/upload?bucket=${encodeURIComponent(bucket)}`;
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.credentials = true;

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        const result = await new Promise<{ url?: string; error?: string }>((resolve, reject) => {
          xhr.onload = () => {
            try {
              const data = JSON.parse(xhr.responseText);
              if (xhr.status >= 200 && xhr.status < 300 && data.url) {
                resolve(data);
              } else {
                resolve({ error: data.error || `HTTP ${xhr.status}` });
              }
            } catch {
              resolve({ error: `HTTP ${xhr.status}: invalid response` });
            }
          };
          xhr.onerror = () => resolve({ error: "Network error during upload." });
          xhr.send(fd);
        });

        if (result.error) {
          setErr(result.error);
        } else if (result.url) {
          onChange(result.url);
        }
      } catch (e: unknown) {
        setErr((e as Error).message || "Upload failed.");
      } finally {
        setUploading(false);
        setProgress(0);
        // reset the input so the same file can be re-selected
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [bucket, onChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) doUpload(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) doUpload(f);
  };

  const isUrl = value && (value.startsWith("http") || value.startsWith("/"));

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setMode(mode === "upload" ? "url" : "upload")}
          className="text-[10px] text-blue-500 hover:text-blue-700 flex items-center gap-1 font-medium"
        >
          {mode === "upload" ? (
            <>
              <LinkIcon size={10} /> Use URL instead
            </>
          ) : (
            <>
              <ImageIcon size={10} /> Upload file instead
            </>
          )}
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/… or /images/pages/foo.png"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-gray-900 placeholder:text-gray-300 bg-white"
        />
      ) : (
        <>
          {!isUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-all px-4 py-8 text-center ${
                dragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
                onChange={handleFileInput}
                className="sr-only"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <p className="text-xs font-medium text-gray-700">
                    Uploading… {progress}%
                  </p>
                  <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-[10px] text-gray-400">
                    PNG, JPEG, WebP, GIF, SVG · max 10 MB
                    {recommendedSize ? ` · recommended ${recommendedSize}` : ""}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <div className="relative w-full h-40 bg-gray-100">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-contain"
                  unoptimized
                  sizes="100%"
                />
              </div>
              <div className="px-3 py-2 flex items-center justify-between gap-2 bg-white border-t border-gray-100">
                <p className="text-[10px] text-gray-500 truncate flex-1 font-mono">
                  {value}
                </p>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="text-[10px] text-red-500 hover:text-red-700 flex items-center gap-1 font-medium flex-shrink-0"
                >
                  <X size={11} /> Remove
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {err && <p className="text-[10px] text-red-500 mt-1">{err}</p>}
      {hint && !err && <p className="text-[10px] text-gray-300 mt-1">{hint}</p>}
    </div>
  );
}
