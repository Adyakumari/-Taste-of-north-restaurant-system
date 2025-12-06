"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { useToast } from "../../components/ToastProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const { show } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div className="auth-wrap">
      <div className="auth-header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Taste of North" width={56} height={56} />
        <h2 style={{ margin: 8 }}>Welcome back</h2>
        <p className="muted" style={{ marginTop: -6 }}>Log in to continue</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const ok = await login(email, password, remember);
          setLoading(false);
          if (ok) {
            show("Welcome back!");
            router.push("/");
          } else {
            show("Invalid credentials");
          }
        }}
        className="card auth-card"
      >
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="you@example.com" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} />
        </div>
        <div>
          <label>Password</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input value={password} onChange={(e) => setPassword(e.target.value)} required type={showPw ? "text" : "password"} placeholder="••••••••" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} />
            <button type="button" className="btn btn-outline" onClick={() => setShowPw((s) => !s)} aria-label="Toggle password visibility">{showPw ? "Hide" : "Show"}</button>
          </div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <div style={{ display: "grid", gap: 8 }}>
          <button type="button" className="btn" onClick={() => show("Google sign-in coming soon")}>Continue with Google</button>
          <button type="button" className="btn" onClick={() => show("Apple sign-in coming soon")}>Continue with Apple</button>
        </div>
        <div className="muted" style={{ textAlign: "center" }}>
          Don’t have an account? <a href="/signup">Create one</a>
        </div>
      </form>
    </div>
  );
}


