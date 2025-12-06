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
                  <button
                    className="btn btn-accent"
                    onClick={() => {
                      addItem(item.id, 1);
                      show(`Added ${item.name} to cart`);
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

