import { NextRequest, NextResponse } from "next/server";
import { addReservation } from "../../../lib/db";
import type { CreateReservationRequest } from "../../../lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateReservationRequest;
    if (!body.name || !body.email || !body.phone || !body.date || !body.time || !body.partySize) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    const reservation = await addReservation({
      name: body.name,
      email: body.email,
      phone: body.phone,
      date: body.date,
      time: body.time,
      partySize: body.partySize,
      notes: body.notes
    });
    return NextResponse.json({ token: reservation.token, reservation });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Failed to create reservation" }, { status: 500 });
  }
}


