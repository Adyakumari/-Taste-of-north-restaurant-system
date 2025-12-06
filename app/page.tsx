"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuItem } from "../lib/types";
import { useCart } from "../components/CartProvider";
import { useToast } from "../components/ToastProvider";

export default function HomePage() {
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const { addItem } = useCart();
  const { show } = useToast();

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: MenuItem[]) => setFeatured(data.slice(0, 3)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <section style={{ padding: "24px 0" }}>
        <h2>Welcome to Taste of North</h2>
        <p>
          Discover authentic North Indian cuisine. Browse our menu, add to cart, and place your
          order with an easy checkout and order tracking.
        </p>
        <Link href="/menu" className="btn btn-primary" style={{ marginTop: 12 }}>
          Explore Menu
        </Link>
      </section>
      <section style={{ padding: "24px 0" }}>
        <h3>Featured Dishes</h3>
        <div className="grid grid-cards" style={{ marginTop: 12 }}>
          {featured.map((item) => (
            <div key={item.id} className="card">
              <Link href={`/menu/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="card-img" />
              </Link>
              <div className="card-body">
                <div className="row" style={{ alignItems: "baseline" }}>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <span style={{ fontWeight: 600 }}>₹{(item.priceCents / 100).toFixed(2)}</span>
                </div>
                <p className="muted" style={{ margin: "8px 0 12px", fontSize: 14 }}>{item.description}</p>
                <div className="row">
                  <Link className="btn btn-outline" href={`/menu/${item.id}`}>View</Link>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      addItem(item.id, 1);
                      show(`Added ${item.name} to cart`);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

