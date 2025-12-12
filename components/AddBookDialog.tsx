"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddBookDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [src, setSrc] = useState("");
  const [publicationYear, setPublicationYear] = useState<number | "">(new Date().getFullYear());
  const [rating, setRating] = useState<number | "">(4.0);
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setLongDescription("");
      setSrc("");
      setPublicationYear(new Date().getFullYear());
      setRating(4.0);
      setTags("");
    }
  }, [open]);

  if (!open) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((v) => ({ id: `t${Date.now()}${Math.random().toString(36).slice(2,6)}`, value: v }));

      const body: Record<string, unknown> = {
        title,
        description,
        longDescription,
        src,
      };
      if (publicationYear) body.publicationYear = Number(publicationYear);
      if (rating) body.rating = Number(rating);
      if (tagList.length) body.tags = tagList;

      const res = await fetch(`/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        alert(json?.error || "Failed to create book");
        setIsSaving(false);
        return;
      }

      onOpenChange(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to create book");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={() => onOpenChange(false)} />
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 z-60 w-full max-w-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add Book</h3>

        <label className="block mb-2">
          <span className="text-sm">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800" />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Description</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800" />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Image source (URL)</span>
          <input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="https://..." className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800" />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Long Description</span>
          <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block mb-2">
            <span className="text-sm">Publication Year</span>
            <input type="number" value={publicationYear as number} onChange={(e) => setPublicationYear(e.target.value ? Number(e.target.value) : "")} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800" />
          </label>

          <label className="block mb-2">
            <span className="text-sm">Rating</span>
            <input type="number" step="0.1" min="0" max="5" value={rating as number} onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800" />
          </label>
        </div>

        <label className="block mb-4">
          <span className="text-sm">Tags (comma separated)</span>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Classic, Dystopian" className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800" />
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-800" disabled={isSaving}>Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white" disabled={isSaving}>{isSaving ? "Saving..." : "Create"}</button>
        </div>
      </div>
    </div>
  );
}
