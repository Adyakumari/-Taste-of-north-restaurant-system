import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import type { CartEntry, Customer, Order, Reservation } from "./types";
import menu from "../data/menu.json";

const dataDir = path.join(process.cwd(), "data");
const ordersPath = path.join(dataDir, "orders.json");
const reservationsPath = path.join(dataDir, "reservations.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(ordersPath);
  } catch {
    await fs.writeFile(ordersPath, "[]", "utf8");
  }
  try {
    await fs.access(reservationsPath);
  } catch {
    await fs.writeFile(reservationsPath, "[]", "utf8");
  }
}

async function readOrders(): Promise<Order[]> {
  await ensureStore();
  const raw = await fs.readFile(ordersPath, "utf8");
  try {
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await ensureStore();
  await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), "utf8");
}

export async function addOrder(items: CartEntry[], customer: Customer, paymentMethod: "card" | "cod") {
  const orders = await readOrders();
  // Compute total
  const totalCents = items.reduce((sum, e) => {
    const item = (menu as any[]).find((m) => m.id === e.itemId);
    return sum + (item ? item.priceCents * e.quantity : 0);
  }, 0);

  const id = nanoid();
  const token = nanoid(10);
  const order: Order = {
    id,
    token,
    items,
    customer,
    totalCents,
    status: paymentMethod === "card" ? "pending" : "preparing",
    paymentMethod,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  await writeOrders(orders);
  return { order };
}

export async function findOrderByToken(token: string) {
  const orders = await readOrders();
  return orders.find((o) => o.token === token) || null;
}

export async function markOrderPaid(token: string) {
  const orders = await readOrders();
  const idx = orders.findIndex((o) => o.token === token);
  if (idx < 0) return null;
  const order = orders[idx];
  if (order.status === "pending") {
    order.status = "preparing";
    orders[idx] = order;
    await writeOrders(orders);
  }
  return order;
}

async function readReservations(): Promise<Reservation[]> {
  await ensureStore();
  const raw = await fs.readFile(reservationsPath, "utf8");
  try {
    const parsed = JSON.parse(raw) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeReservations(reservations: Reservation[]) {
  await ensureStore();
  await fs.writeFile(reservationsPath, JSON.stringify(reservations, null, 2), "utf8");
}

export async function addReservation(input: Omit<Reservation, "id" | "token" | "status" | "createdAt">) {
  const reservations = await readReservations();
  const id = nanoid();
  const token = nanoid(10);
  const reservation: Reservation = {
    id,
    token,
    name: input.name,
    email: input.email,
    phone: input.phone,
    date: input.date,
    time: input.time,
    partySize: input.partySize,
    notes: input.notes,
    status: "requested",
    createdAt: new Date().toISOString()
  };
  reservations.push(reservation);
  await writeReservations(reservations);
  return reservation;
}

export async function findReservationByToken(token: string) {
  const reservations = await readReservations();
  return reservations.find((r) => r.token === token) || null;
}

export async function listOrders() {
  return readOrders();
}

export async function updateOrderStatus(token: string, status: Order["status"]) {
  const orders = await readOrders();
  const idx = orders.findIndex((o) => o.token === token);
  if (idx < 0) return null;
  orders[idx].status = status;
  await writeOrders(orders);
  return orders[idx];
}


