import { NextRequest, NextResponse } from "next/server";
import { findOrderByToken, markOrderPaid } from "../../../lib/db";

// This endpoint simulates payment. If STRIPE_SECRET_KEY exists, this is where you'd
// create a Stripe Checkout Session and redirect. For demo, we mark as paid and redirect.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("orderToken");
  if (!token) return NextResponse.redirect(new URL("/checkout?cancelled=1", req.url));

  const order = await findOrderByToken(token);
  if (!order) return NextResponse.redirect(new URL("/checkout?cancelled=1", req.url));

  // Simulate successful payment:
  await markOrderPaid(order.token);
  return NextResponse.redirect(new URL(`/order/${order.token}`, req.url));
}


