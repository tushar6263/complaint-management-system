"use client";

import { useState } from "react";
import { CATEGORIES, PRIORITIES } from "@/utils/constants";

type FormState = {
  title: string;
  description: string;
  category: string;
  priority: string;
};

export default function ComplaintForm() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    category: CATEGORIES[0],
    priority: PRIORITIES[1], // Medium default
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Failed to submit");
      }

      setMessage({ type: "ok", text: "✅ Complaint submitted successfully." });
      setForm({ title: "", description: "", category: CATEGORIES[0], priority: PRIORITIES[1] });
    } catch (err: any) {
      setMessage({ type: "err", text: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-blue-600">Submit a Complaint</h2>

      {message && (
        <div className={`p-2 rounded ${message.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Complaint Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Short summary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Describe the issue..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <div className="flex gap-4 items-center">
            {PRIORITIES.map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input name="priority" type="radio" value={p} checked={form.priority === p} onChange={handleChange} />
                <span className="text-sm">{p}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
        <button type="button" onClick={() => setForm({ title: "", description: "", category: CATEGORIES[0], priority: PRIORITIES[1] })} className="px-4 py-2 rounded-xl border">
          Reset
        </button>
      </div>
    </form>
  );
}
