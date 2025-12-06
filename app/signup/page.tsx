"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { useToast } from "../../components/ToastProvider";

export default function SignupPage() {
  const { signup } = useAuth();
  const { show } = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
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
        <h2 style={{ margin: 8 }}>Create your account</h2>
        <p className="muted" style={{ marginTop: -6 }}>Join Taste of North</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const ok = await signup(name, email, password, remember);
          setLoading(false);
          if (ok) {
            show("Account created!");
            router.push("/");
          } else {
            show("Email already in use");
          }
        }}
        className="card auth-card"
      >
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} />
        </div>
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
          Keep me signed in
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
        <div style={{ display: "grid", gap: 8 }}>
          <button type="button" className="btn" onClick={() => show("Google sign-up coming soon")}>Continue with Google</button>
          <button type="button" className="btn" onClick={() => show("Apple sign-up coming soon")}>Continue with Apple</button>
        </div>
        <div className="muted" style={{ textAlign: "center" }}>
          Already have an account? <a href="/login">Log in</a>
        </div>
      </form>
    </div>
  );
}


