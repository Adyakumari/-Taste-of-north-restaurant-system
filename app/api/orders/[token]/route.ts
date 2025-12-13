import { NextRequest, NextResponse } from "next/server";
import { findOrderByToken, updateOrderStatus } from "../../../../lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    const order = await findOrderByToken(token);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();
    const { status } = body;

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

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
