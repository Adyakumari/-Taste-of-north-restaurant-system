"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartEntry } from "../lib/types";

type CartContextValue = {
  entries: CartEntry[];
  addItem: (itemId: string, quantity: number) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "taste-of-north:cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartEntry[];
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const api = useMemo<CartContextValue>(() => {
    return {
      entries,
      addItem: (itemId, quantity) => {
        setEntries((prev) => {
          const next = [...prev];
          const idx = next.findIndex((e) => e.itemId === itemId);
          if (idx >= 0) {
            next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          } else {
            next.push({ itemId, quantity });
          }
          return next;
        });
      },
      updateItem: (itemId, quantity) => {
        setEntries((prev) => prev.map((e) => (e.itemId === itemId ? { ...e, quantity: Math.max(1, quantity) } : e)));
      },
      removeItem: (itemId) => {
        setEntries((prev) => prev.filter((e) => e.itemId !== itemId));
      },
      clear: () => setEntries([]),
    };
  }, [entries]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


