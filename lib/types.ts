export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  category?: string;
};

export type CartEntry = {
  itemId: string;
  quantity: number;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type Order = {
  id: string;
  token: string;
  items: CartEntry[];
  customer: Customer;
  totalCents: number;
  status: "pending" | "paid" | "preparing" | "ready" | "completed";
  paymentMethod: "card" | "cod";
  createdAt: string; // ISO
};

export type CreateOrderRequest = {
  items: CartEntry[];
  customer: Customer;
  paymentMethod: "card" | "cod";
};

export type OrderResponse = {
  order: Order;
  payment?: {
    provider: "stripe" | "mock";
    url: string;
  };
};

export type Reservation = {
  id: string;
  token: string;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  partySize: number;
  notes?: string;
  status: "requested" | "confirmed" | "seated" | "cancelled";
  createdAt: string;
};

export type CreateReservationRequest = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  notes?: string;
};


