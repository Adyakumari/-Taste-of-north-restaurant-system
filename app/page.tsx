"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuItem } from "../lib/types";
import { useCart } from "../components/CartProvider";
import { useToast } from "../components/ToastProvider";

export default function HomePage() {
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const { addItem } = useCart();
  const { show } = useToast();
  const [stepperOpen, setStepperOpen] = useState<string | null>(null);
  const [stepperQty, setStepperQty] = useState(1);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: MenuItem[]) => {
        setFeatured(data.slice(0, 3));
        setAllItems(data);
      })
      .catch(() => {
        setFeatured([]);
        setAllItems([]);
      });
  }, []);

  const categories = Array.from(new Set(allItems.map(item => item.category || "Other")));
  const topCategories = categories.slice(0, 4);

  const handleAddToCart = (itemId: string, qty: number) => {
    const item = allItems.find(i => i.id === itemId);
    addItem(itemId, qty);
    show(`Added ${qty}x ${item?.name} to cart`);
    setStepperOpen(null);
    setStepperQty(1);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
        color: "white",
        padding: "48px 0",
        borderRadius: "12px",
        marginBottom: "32px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🌶️</span>
          <h1 style={{ margin: "0 0 12px", fontSize: "32px" }}>Taste of North</h1>
          <p style={{ margin: "0 0 24px", fontSize: "16px", opacity: "0.95" }}>
            Authentic North Indian cuisine delivered fresh to your door. Experience the flavors of tradition with every bite.
          </p>
          <Link href="/menu" className="btn btn-primary" style={{ marginTop: 0, background: "white", color: "#ff6b35", fontWeight: "600" }}>
            🛒 Explore Menu
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "32px 0", marginBottom: "32px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "32px" }}>Why Choose Taste of North?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
          <div style={{ textAlign: "center", padding: "24px", background: "#f9f9f9", borderRadius: "8px" }}>
            <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>👨‍🍳</span>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Authentic Recipes</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Prepared by experienced chefs using traditional methods</p>
          </div>
          <div style={{ textAlign: "center", padding: "24px", background: "#f9f9f9", borderRadius: "8px" }}>
            <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>🚚</span>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Fast Delivery</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Quick delivery straight to your doorstep</p>
          </div>
          <div style={{ textAlign: "center", padding: "24px", background: "#f9f9f9", borderRadius: "8px" }}>
            <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>⭐</span>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Premium Quality</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Fresh ingredients sourced daily for best taste</p>
          </div>
          <div style={{ textAlign: "center", padding: "24px", background: "#f9f9f9", borderRadius: "8px" }}>
            <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>💰</span>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Best Prices</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Great value for money on all orders</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ padding: "32px 0", marginBottom: "32px" }}>
        <h2 style={{ marginBottom: "24px" }}>Popular Categories</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
          {topCategories.map((cat) => (
            <Link
              key={cat}
              href={`/menu?category=${cat}`}
              style={{
                padding: "16px",
                background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                textAlign: "center",
                fontWeight: "600",
                transition: "transform 0.2s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Dishes */}
      <section style={{ padding: "32px 0", marginBottom: "32px" }}>
        <h2 style={{ marginBottom: "24px" }}>✨ Featured Dishes</h2>
        <div className="grid grid-cards" style={{ marginTop: 12 }}>
          {featured.map((item) => (
            <div key={item.id} className="card" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", transition: "transform 0.2s" }}>
              <Link href={`/menu/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="card-img" style={{ objectFit: "cover" }} />
              </Link>
              <div className="card-body">
                <div className="row" style={{ alignItems: "baseline" }}>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <span style={{ fontWeight: 600, color: "#ff6b35" }}>₹{(item.priceCents / 100).toFixed(2)}</span>
                </div>
                <p className="muted" style={{ margin: "8px 0 12px", fontSize: 14 }}>{item.description}</p>
                <div className="row">
                  <Link className="btn btn-outline" href={`/menu/${item.id}`}>View</Link>
                  {stepperOpen === item.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #ddd", borderRadius: 4, padding: "4px 6px" }}>
                      <button
                        onClick={() => setStepperQty(Math.max(1, stepperQty - 1))}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "2px 4px", fontWeight: "bold" }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: 24, textAlign: "center", fontWeight: "600", fontSize: 14 }}>{stepperQty}</span>
                      <button
                        onClick={() => setStepperQty(stepperQty + 1)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "2px 4px", fontWeight: "bold" }}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(item.id, stepperQty)}
                        style={{ padding: "4px 8px", fontSize: 12 }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setStepperOpen(null);
                          setStepperQty(1);
                        }}
                        style={{ background: "none", border: "1px solid #ccc", cursor: "pointer", borderRadius: 3, padding: "3px 6px", fontSize: 12 }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => setStepperOpen(item.id)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: "#f5f5f5",
        padding: "48px 0",
        borderRadius: "12px",
        textAlign: "center",
        marginBottom: "32px"
      }}>
        <h2 style={{ marginBottom: "16px" }}>Ready to Order?</h2>
        <p style={{ margin: "0 0 24px", color: "#666", fontSize: "16px" }}>
          Browse our complete menu and place your order now. Fast, easy, and delicious!
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link href="/menu" className="btn btn-primary">
            View Full Menu
          </Link>
          <Link href="/reservations" className="btn btn-outline">
            Make a Reservation
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "32px 0" }}>
        <h2 style={{ textAlign: "center", marginBottom: "32px" }}>What Our Customers Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
          {[
            { name: "Rajesh Kumar", text: "Amazing food quality and super fast delivery! Highly recommended.", rating: 5 },
            { name: "Priya Sharma", text: "The flavors are authentic and the service is excellent. Best North Indian food in town!", rating: 5 },
            { name: "Vikram Singh", text: "Order tracking feature is so helpful. Always know when my food arrives. Love it!", rating: 5 }
          ].map((testimonial, idx) => (
            <div key={idx} style={{
              padding: "20px",
              background: "white",
              border: "1px solid #eee",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <div style={{ marginBottom: "12px" }}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} style={{ color: "#ffc107", marginRight: "2px" }}>⭐</span>
                ))}
              </div>
              <p style={{ margin: "0 0 12px", fontStyle: "italic", color: "#666" }}>"{testimonial.text}"</p>
              <p style={{ margin: 0, fontWeight: "600" }}>— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

