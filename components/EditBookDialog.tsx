"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: {
    id: string;
    title?: string;
    description?: string;
    longDescription?: string;
    src?: string;
  };
}

export default function EditBookDialog({ open, onOpenChange, book }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(book.title || "");
  const [description, setDescription] = useState(book.description || "");
  const [longDescription, setLongDescription] = useState(
    book.longDescription || ""
  );
  const [src, setSrc] = useState(book.src || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(book.title || "");
      setDescription(book.description || "");
      setLongDescription(book.longDescription || "");
      setSrc(book.src || "");
    }
  }, [open, book]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, longDescription, src }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        alert(json?.error || "Failed to save book");
        setIsSaving(false);
        return;
      }
      onOpenChange(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to save book");
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/30"
        onClick={() => onOpenChange(false)}
      />
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 z-60 w-full max-w-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Book</h3>

        <label className="block mb-2">
          <span className="text-sm">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Image source (URL)</span>
          <input
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm">Long Description</span>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-800"
            rows={6}
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-800"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
