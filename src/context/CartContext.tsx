"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  variantId: string | null;
  variantName: string | null;
  price: number;
  image: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantKey: string) => void;
  updateQuantity: (variantKey: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bc-cart";

export function keyOf(item: Pick<CartItem, "productId" | "variantId">) {
  return `${item.productId}::${item.variantId ?? "default"}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  // Suivi de l'utilisateur connecté
  useEffect(() => {
    const sb = createClient();
    let active = true;
    sb.auth.getUser().then(({ data }) => {
      if (active) setUserId(data.user?.id ?? null);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // À la connexion : pousse le panier local vers le compte, ou le récupère
  useEffect(() => {
    if (!hydrated || !userId) return;
    const sb = createClient();
    (async () => {
      if (items.length > 0) {
        await sb.from("carts").upsert({ user_id: userId, items, updated_at: new Date().toISOString() });
      } else {
        const { data } = await sb.from("carts").select("items").eq("user_id", userId).maybeSingle();
        if (data?.items && Array.isArray(data.items)) setItems(data.items as CartItem[]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, hydrated]);

  // Sauvegarde du panier sur le compte (debounce)
  useEffect(() => {
    if (!hydrated || !userId) return;
    const sb = createClient();
    const t = setTimeout(() => {
      sb.from("carts").upsert({ user_id: userId, items, updated_at: new Date().toISOString() });
    }, 600);
    return () => clearTimeout(t);
  }, [items, userId, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const k = keyOf(item);
        const existing = prev.find((i) => keyOf(i) === k);
        if (existing) {
          return prev.map((i) =>
            keyOf(i) === k ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [...prev, { ...item, quantity }];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((variantKey: string) => {
    setItems((prev) => prev.filter((i) => keyOf(i) !== variantKey));
  }, []);

  const updateQuantity = useCallback((variantKey: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          keyOf(i) === variantKey ? { ...i, quantity: Math.max(0, quantity) } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.quantity * i.price, 0);
    return {
      items,
      count,
      total,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clear,
    };
  }, [items, isOpen, addItem, removeItem, updateQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un CartProvider");
  return ctx;
}
