"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartProvider";
import type { MenuItem, OrderResponse } from "../../lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const cancelled = params.get("cancelled") === "1";
  const { entries, clear } = useCart();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: MenuItem[]) => setMenu(data))
      .catch(() => setMenu([]));
  }, []);

  const totalCents = useMemo(() => {
    return entries.reduce((sum, e) => {
      const item = menu.find((m) => m.id === e.itemId);
      return sum + (item ? item.priceCents * e.quantity : 0);
    }, 0);
  }, [entries, menu]);

  async function placeOrder() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: entries,
          customer: form,
          paymentMethod,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to place order");
      }
      const data: OrderResponse = await res.json();

      clear();

      if (paymentMethod === "card" && data.payment?.url) {
        window.location.href = data.payment.url;
        return;
      }
      router.push(`/order/${data.order.token}`);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = submitting || entries.length === 0 || !form.name || !form.email || !form.phone;

  return (
    <div>
      <h2>Checkout</h2>
      {cancelled && <div style={{ background: "#fff7f7", border: "1px solid #ffd6d6", padding: 12, borderRadius: 6, marginBottom: 12 }}>Payment cancelled</div>}
      {error && <div style={{ background: "#fff7f7", border: "1px solid #ffd6d6", padding: 12, borderRadius: 6, marginBottom: 12 }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "8px 10px", marginTop: 6 }} />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "8px 10px", marginTop: 6 }} />
            </div>
            <div>
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%", padding: "8px 10px", marginTop: 6 }} />
            </div>
            <div>
              <label>Payment Method</label>
              <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="radio" name="pm" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} /> Card
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="radio" name="pm" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /> Cash on Delivery
                </label>
              </div>
            </div>
          </div>
          <button
            disabled={disabled}
            onClick={placeOrder}
            style={{ marginTop: 16, padding: "10px 14px", background: disabled ? "#aaa" : "#111", color: "white", borderRadius: 6, border: 0, cursor: disabled ? "not-allowed" : "pointer" }}
          >
            {submitting ? "Placing..." : "Place Order"}
          </button>
        </div>
        <div>
          <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Summary</div>
            <div style={{ display: "grid", gap: 6 }}>
              {entries.map((e) => {
                const item = menu.find((m) => m.id === e.itemId);
                if (!item) return null;
                return (
                  <div key={e.itemId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span>
                      {item.name} × {e.quantity}
                    </span>
                    <span>₹{((item.priceCents * e.quantity) / 100).toFixed(2)}</span>
                  </div>
                );
              })}
              <div style={{ borderTop: "1px dashed #ddd", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>Total</span>
                <span>₹{(totalCents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

