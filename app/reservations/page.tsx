"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReservationsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    partySize: 2,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.message || "Failed to create reservation");
      }
      const data = await res.json();
      router.push(`/reservations/${data.token}`);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="reserve-wrap">
      <div className="reserve-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={56} height={56} style={{ borderRadius: 12, background: "#fff", padding: 6 }} />
        <h2 style={{ margin: 8, textAlign: "center" }}>Reserve a Table</h2>
        <p className="muted" style={{ marginTop: -6, textAlign: "center" }}>
          Plan your perfect dining experience. We look forward to hosting you.
        </p>
      </div>

      <div className="reserve-card">
        <h3 className="reserve-title">Reservation Details</h3>
        {error && <div className="reserve-error">{error}</div>}
        <div className="reserve-grid">
          <div>
            <label>Name<span style={{ color: "#e67e22" }}>*</span></label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          </div>
          <div>
            <label>Email<span style={{ color: "#e67e22" }}>*</span></label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
          </div>
          <div>
            <label>Number of Guests<span style={{ color: "#e67e22" }}>*</span></label>
            <select
              className="input"
              value={form.partySize}
              onChange={(e) => setForm({ ...form, partySize: parseInt(e.target.value, 10) })}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Date<span style={{ color: "#e67e22" }}>*</span></label>
            <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label>Time<span style={{ color: "#e67e22" }}>*</span></label>
            <input className="input" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
          <div>
            <label>Special Requests</label>
            <textarea className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} placeholder="Let us know any allergies or special occasions!" />
          </div>
        </div>
        <p className="muted" style={{ textAlign: "center" }}>
          We will do our best to accommodate your preferences.
        </p>
        <button
          onClick={submit}
          disabled={submitting || !form.name || !form.email || !form.date || !form.time || !form.partySize}
          className="btn btn-reserve"
        >
          {submitting ? "Submitting..." : "Reserve Now"}
        </button>
      </div>
    </div>
  );
}

