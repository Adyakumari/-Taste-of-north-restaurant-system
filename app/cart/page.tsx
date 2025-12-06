"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../components/CartProvider";
import type { MenuItem } from "../../lib/types";

export default function CartPage() {
  const { entries, updateItem, removeItem, clear } = useCart();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: MenuItem[]) => setMenu(data))
      .catch(() => setMenu([]));
  }, []);

  const enriched = useMemo(() => {
    return entries
      .map((e) => {
        const item = menu.find((m) => m.id === e.itemId);
        if (!item) return null;
        return { item, quantity: e.quantity, lineCents: e.quantity * item.priceCents };
      })
      .filter(Boolean) as { item: MenuItem; quantity: number; lineCents: number }[];
  }, [entries, menu]);

  const subtotalCents = enriched.reduce((sum, r) => sum + r.lineCents, 0);
  const taxCents = Math.round(subtotalCents * 0.08);
  const serviceFeeCents = enriched.length > 0 ? 300 : 0;
  const totalCents = subtotalCents + taxCents + serviceFeeCents;

  if (entries.length === 0) {
    return (
      <div className="cart-wrap">
        <div className="menu-hero" style={{ justifyContent: "flex-start" }}>
          <span className="brand-mark" aria-hidden>🛒</span>
          <h2 style={{ margin: 0 }}>Your Cart</h2>
        </div>
        <p className="muted">Your cart is empty.</p>
        <Link className="btn btn-primary" href="/menu" style={{ width: "max-content" }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-wrap">
      <div className="menu-hero" style={{ justifyContent: "flex-start" }}>
        <span className="brand-mark" aria-hidden>🛒</span>
        <h2 style={{ margin: 0 }}>Your Cart</h2>
      </div>

      <div className="cart-card">
        {enriched.map(({ item, quantity, lineCents }) => (
          <div key={item.id} className="cart-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="cart-thumb" referrerPolicy="no-referrer" />
            <div className="cart-row-main">
              <div className="cart-row-title">{item.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>₹{(item.priceCents / 100).toFixed(2)} each</div>
              <div className="qty-stepper">
                <button
                  className="step"
                  onClick={() => updateItem(item.id, Math.max(1, quantity - 1))}
                  aria-label={`Decrease ${item.name}`}
                >
                  −
                </button>
                <input
                  value={quantity}
                  aria-label={`${item.name} quantity`}
                  onChange={(e) => {
                    const n = parseInt(e.target.value || "1", 10);
                    updateItem(item.id, Math.max(1, isNaN(n) ? 1 : n));
                  }}
                />
                <button
                  className="step"
                  onClick={() => updateItem(item.id, quantity + 1)}
                  aria-label={`Increase ${item.name}`}
                >
                  +
                </button>
              </div>
            </div>
            <div className="cart-row-right">
              <button className="cart-remove" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}>×</button>
              <div className="cart-line-price">₹{(lineCents / 100).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-card">
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Add a note for your chef:</div>
        <textarea
          className="note-input"
          placeholder="e.g. Please make the sauce extra spicy."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
        />
      </div>

      <div className="cart-card">
        <div className="summary-row"><span>Subtotal</span><span>₹{(subtotalCents / 100).toFixed(2)}</span></div>
        <div className="summary-row"><span>Tax</span><span>₹{(taxCents / 100).toFixed(2)}</span></div>
        <div className="summary-row"><span>Service Fee</span><span>₹{(serviceFeeCents / 100).toFixed(2)}</span></div>
        <div className="summary-row total"><span>Total</span><span>₹{(totalCents / 100).toFixed(2)}</span></div>
      </div>

      <div className="cart-actions">
        <Link href="/checkout" className="btn btn-primary" style={{ minWidth: 160 }}>Checkout</Link>
        <Link href="/menu" className="btn btn-secondary">Continue Ordering</Link>
        <button onClick={() => clear()} className="btn btn-outline">Clear Cart</button>
      </div>
    </div>
  );
}

