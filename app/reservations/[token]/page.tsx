"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Reservation } from "../../../lib/types";

export default function ReservationDetailPage() {
  const params = useParams<{ token: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.token) return;
    fetch(`/api/reservations/${params.token}`)
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j?.message || "Failed to fetch reservation");
        }
        return r.json();
      })
      .then((data: Reservation) => setReservation(data))
      .catch((e: any) => setError(e.message || "Error"));
  }, [params.token]);

  if (error) return <div>{error}</div>;
  if (!reservation) return <div>Loading reservation...</div>;

  return (
    <div>
      <h2>Reservation Confirmed</h2>
      <div style={{ marginBottom: 8 }}>Thank you for your reservation.</div>
      <div>
        <strong>Tracking token:</strong> <code>{reservation.token}</code>
      </div>
      <div style={{ marginTop: 12 }}>
        <div>Status: <strong>{reservation.status}</strong></div>
        <div>Date: <strong>{reservation.date}</strong></div>
        <div>Time: <strong>{reservation.time}</strong></div>
        <div>Party Size: <strong>{reservation.partySize}</strong></div>
      </div>
    </div>
  );
}

