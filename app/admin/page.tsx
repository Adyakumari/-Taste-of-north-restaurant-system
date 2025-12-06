"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "../lib/types";

const STATUSES: Order["status"][] = ["pending", "preparing", "ready", "completed", "paid"];

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.message || "Failed to load orders");
      }
      const data = await res.json();
      setOrders(data);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(token: string, status: Order["status"]) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status })
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.message || "Failed to update");
      }
      await load();
    } catch (e: any) {
      setError(e.message || "Error");
    }
  }

  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [orders]);

  return (
    <div>
      <h2>Admin - Orders</h2>
      {error && <div style={{ background: "#fff7f7", border: "1px solid #ffd6d6", padding: 12, borderRadius: 6, marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {sorted.map((o) => (
            <div key={o.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Token: {o.token}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {o.customer.name} • {new Date(o.createdAt).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>Total: ₹{(o.totalCents / 100).toFixed(2)}</div>
                </div>
                <div>
                  <select value={o.status} onChange={(e) => updateStatus(o.token, e.target.value as Order["status"])} style={{ padding: "6px 8px" }}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

