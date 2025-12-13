import { NextRequest, NextResponse } from "next/server";
import { listOrders, updateOrderStatus } from "../../../../lib/db";

export async function GET() {
  try {
    const orders = await listOrders();
    return NextResponse.json(orders);
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, status } = body;

    if (!token || !status) {
      return NextResponse.json(
        { message: "Token and status are required" },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(token, status);
    if (!updated) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
