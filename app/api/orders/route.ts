import { NextRequest, NextResponse } from "next/server";
import { addOrder } from "../../../lib/db";
import type { CreateOrderRequest, OrderResponse } from "../../../lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateOrderRequest;
    if (!body?.items?.length) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }
    if (!body.customer?.name || !body.customer?.email || !body.customer?.phone) {
      return NextResponse.json({ message: "Customer info is required" }, { status: 400 });
    }
    const paymentMethod = body.paymentMethod === "cod" ? "cod" : "card";
    const result = await addOrder(body.items, body.customer, paymentMethod);

    const response: OrderResponse = {
      order: result.order,
      payment: undefined
    };

    if (paymentMethod === "card") {
      // Stripe optional: if no key, provide a mock payment URL to simulate redirect.
      const hasStripe = !!process.env.STRIPE_SECRET_KEY;
      response.payment = {
        provider: hasStripe ? "stripe" : "mock",
        url: hasStripe
          ? `/api/payment?orderToken=${result.order.token}`
          : `/order/${result.order.token}`
      };
    }

    return NextResponse.json(response);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Failed to create order" }, { status: 500 });
  }
}


