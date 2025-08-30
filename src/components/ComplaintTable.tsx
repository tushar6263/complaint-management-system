"use client";

import { useEffect, useState } from "react";
import { PRIORITIES, STATUSES } from "@/utils/constants";
import type { ComplaintDTO } from "@/types";

type MaybeResponse = { complaints?: ComplaintDTO[] } | ComplaintDTO[];

export default function ComplaintTable() {
  const [complaints, setComplaints] = useState<ComplaintDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{ status: string; priority: string }>({ status: "", priority: "" });

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.priority) params.set("priority", filters.priority);

      const res = await fetch(`/api/complaints?${params.toString()}`);
      const data: MaybeResponse = await res.json();

      if (Array.isArray(data)) setComplaints(data);
      else if (Array.isArray((data as any).complaints)) setComplaints((data as any).complaints);
      else setComplaints([]);
    } catch (err) {
      console.error("failed to load complaints", err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filters.status, filters.priority]);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("update failed");
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  }

  async function deleteComplaint(id: string) {
    if (!confirm("Delete this complaint?")) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete complaint");
    }
  }

  return (
    <div className="w-full max-w-6xl">
      {/* filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex gap-3">
          <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="border rounded-lg px-3 py-2">
            <option value="">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} className="border rounded-lg px-3 py-2">
            <option value="">All Priority</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setFilters({ status: "", priority: "" })} className="px-4 py-2 rounded-lg border">
            Reset
          </button>
          <button onClick={() => load()} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Priority</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="p-3" colSpan={6}>
                  Loading…
                </td>
              </tr>
            )}

            {!loading && complaints.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={6}>
                  No complaints found.
                </td>
              </tr>
            )}

            {!loading &&
              complaints.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3">{c.priority}</td>
                  <td className="p-3">{new Date(c.dateSubmitted ?? c.createdAt ?? "").toLocaleString()}</td>

                  <td className="p-3">
                    <select className="border rounded px-2 py-1" value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(c._id, "In Progress")} className="px-3 py-1 bg-yellow-500 text-white rounded">
                        In Progress
                      </button>
                      <button onClick={() => updateStatus(c._id, "Resolved")} className="px-3 py-1 bg-green-500 text-white rounded">
                        Resolve
                      </button>
                      <button onClick={() => deleteComplaint(c._id)} className="px-3 py-1 border rounded text-red-600">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
