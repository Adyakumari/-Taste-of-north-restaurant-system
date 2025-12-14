"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MenuItem } from "../../lib/types";
import { useCart } from "../../components/CartProvider";
import { useToast } from "../../components/ToastProvider";
import { useSearchParams } from "next/navigation";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const { addItem } = useCart();
  const { show } = useToast();
  const searchParams = useSearchParams();
  const query = (searchParams.get("search") || "").trim().toLowerCase();
  const [stepperOpen, setStepperOpen] = useState<string | null>(null);
  const [stepperQty, setStepperQty] = useState(1);


  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: MenuItem[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  
  const visibleItems = useMemo(() => {
    if (!query) return items;
    return items.filter((it) =>
      `${it.name} ${it.description}`.toLowerCase().includes(query)
    );
  }, [items, query]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) set.add(it.category || "Other");
    const order = ["Starters", "Mains", "Breads", "Desserts", "Beverages", "Other"];
    return Array.from(set).sort((a, b) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [items]);

  const [activeCat, setActiveCat] = useState<string | null>(null);
  useEffect(() => {
    if (!activeCat && categories.length > 0) setActiveCat(categories[0]);
  }, [categories, activeCat]);

  const itemsInActive = useMemo(() => {
    const cat = activeCat || categories[0];
    return visibleItems.filter((it) => (it.category || "Other") === cat);
  }, [visibleItems, activeCat, categories]);

  return (
    <div>
      <div className="menu-hero">
        <span className="brand-mark" aria-hidden>🌶️</span>
        <h2 style={{ margin: 0 }}>Our Menu</h2>
      </div>
      <div className="menu-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab ${cat === (activeCat || categories[0]) ? "active" : ""}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {query && <p className="muted" style={{ marginTop: 8 }}>Showing results for “{query}”</p>}

      <div className="menu-grid-2" style={{ marginTop: 12 }}>
        {itemsInActive.map((item, idx) => (
          <div key={item.id} className={`menu-card ${idx % 2 === 1 ? "alt" : ""}`}>
            <Link href={`/menu/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="menu-card-img" referrerPolicy="no-referrer" />
            </Link>
            <div className="menu-card-body">
              <h4 style={{ margin: "0 0 6px" }}>{item.name}</h4>
              <p className="muted" style={{ margin: "0 0 12px" }}>{item.description}</p>
              <div className="row">
                <span className="price-badge">₹{(item.priceCents / 100).toFixed(2)}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link className="btn btn-outline" href={`/menu/${item.id}`}>View</Link>
                  {stepperOpen === item.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #ddd", borderRadius: 4, padding: "4px 8px" }}>
                      <button
                        onClick={() => setStepperQty(Math.max(1, stepperQty - 1))}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "2px 6px", fontWeight: "bold" }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: 30, textAlign: "center", fontWeight: "600" }}>{stepperQty}</span>
                      <button
                        onClick={() => setStepperQty(stepperQty + 1)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "2px 6px", fontWeight: "bold" }}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-accent"
                        onClick={() => {
                          addItem(item.id, stepperQty);
                          show(`Added ${stepperQty}x ${item.name} to cart`);
                          setStepperOpen(null);
                          setStepperQty(1);
                        }}
                        style={{ padding: "6px 12px", fontSize: 12 }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setStepperOpen(null);
                          setStepperQty(1);
                        }}
                        style={{ background: "none", border: "1px solid #ccc", cursor: "pointer", borderRadius: 3, padding: "4px 8px", fontSize: 12 }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-accent"
                      onClick={() => setStepperOpen(item.id)}
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

