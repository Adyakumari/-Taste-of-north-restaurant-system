"use client";

import "./globals.css";
import Link from "next/link";
import { CartProvider } from "../components/CartProvider";
import { ToastProvider } from "../components/ToastProvider";
import { AuthProvider, useAuth } from "../components/AuthProvider";
import { useCart } from "../components/CartProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main
                data-testid="layout-container"
                className="flex flex-column min-vh-100 shadow-2 center-inner"
                style={{ transform: "none", transition: "transform .2s", paddingBottom: 32 }}
              >
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

function Header() {
  const { entries } = useCart();
  const count = entries.reduce((s, e) => s + e.quantity, 0);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <header className="header">
      <div className="container header-bar header-bar--three">
        {/* Left: brand/logo */}
        <div className="header-left">
          <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span className="brand-mark" aria-hidden>🌶️</span>
            <span className="brand-name">Taste of North</span>
          </Link>
        </div>

        {/* Center: main navigation */}
        <nav className="nav nav-main">
          <Link href="/menu">Menu</Link>
          <Link href="/reservations">Reservations</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            Cart {count > 0 && <span className="badge">{count}</span>}
          </Link>
        </nav>

        {/* Right: actions + CTA (CTA slightly left by ordering first) */}
        <div className="header-actions">
          <Link href="/menu" className="btn btn-cta">Order Now</Link>
          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              const term = q.trim();
              router.push(term ? `/menu?search=${encodeURIComponent(term)}` : "/menu");
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="search-input"
              placeholder="Search dishes"
              aria-label="Search dishes"
            />
            <button type="submit" className="icon-btn" aria-label="Search">🔍</button>
          </form>
          {user ? (
            <>
              <span className="muted hide-sm">Hi, {user.name.split(" ")[0]}</span>
              <button className="icon-btn hide-sm" onClick={logout} aria-label="Logout">⎋</button>
            </>
          ) : (
            <>
              <Link href="/login" className="icon-btn hide-sm" aria-label="Log in">🔑</Link>
              <Link href="/signup" className="icon-btn hide-sm" aria-label="Sign up">➕</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4 className="footer-title">About Taste of North</h4>
            <ul className="footer-list">
              <li><a className="footer-link" href="#">Our Story</a></li>
              <li><a className="footer-link" href="#">Chef’s Standards</a></li>
              <li><a className="footer-link" href="#">Allergy Guide</a></li>
              <li><a className="footer-link" href="#">Nutritional Info</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Careers</h4>
            <ul className="footer-list">
              <li><a className="footer-link" href="#">Work With Us</a></li>
              <li><a className="footer-link" href="#">Hourly Opportunities</a></li>
              <li><a className="footer-link" href="#">Management Roles</a></li>
              <li><a className="footer-link" href="#">Corporate</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Company Info</h4>
            <ul className="footer-list">
              <li><a className="footer-link" href="#">News & Press</a></li>
              <li><a className="footer-link" href="#">Locations</a></li>
              <li><a className="footer-link" href="#">Franchise & Partners</a></li>
              <li><a className="footer-link" href="#">Become a Supplier</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Get in Touch</h4>
            <ul className="footer-list">
              <li><a className="footer-link" href="#">Contact Us</a></li>
              <li><a className="footer-link" href="#">Feedback</a></li>
              <li><a className="footer-link" href="#">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Let’s Be Friends</h4>
            <div className="footer-social">
              <a className="footer-social-btn" href="#" aria-label="Facebook">f</a>
              <a className="footer-social-btn" href="#" aria-label="X">x</a>
              <a className="footer-social-btn" href="#" aria-label="Instagram">ig</a>
              <a className="footer-social-btn" href="#" aria-label="YouTube">yt</a>
              <a className="footer-social-btn" href="#" aria-label="TikTok">tt</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-left">© {new Date().getFullYear()} Taste of North. All rights reserved.</div>
          <div className="footer-bottom-links">
            <a className="footer-link" href="#">Terms</a>
            <a className="footer-link" href="#">Privacy</a>
            <a className="footer-link" href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

