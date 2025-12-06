"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Order } from "../../../lib/types";

export default function OrderTrackingPage() {
  const params = useParams<{ token: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.token) return;
    fetch(`/api/orders/${params.token}`)
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j?.message || "Failed to fetch order");
        }
        return r.json();
      })
      .then((data: Order) => setOrder(data))
      .catch((e: any) => setError(e.message || "Error"));
  }, [params.token]);

  if (error) return <div>{error}</div>;
  if (!order) return <div>Loading order...</div>;

  return (
    <div>
      <h2>Order Confirmation</h2>
      <div style={{ marginBottom: 8 }}>Thank you! Your order has been placed.</div>
      <div>
        <strong>Tracking token:</strong> <code>{order.token}</code>
      </div>
      <div style={{ marginTop: 12 }}>
        <div>Status: <strong>{order.status}</strong></div>
        <div>Payment: <strong>{order.paymentMethod}</strong></div>
        <div>Total: <strong>₹{(order.totalCents / 100).toFixed(2)}</strong></div>
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
        Save this token to check your order status later.
      </div>
    </div>
  );
}

