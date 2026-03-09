import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { CartItem, Product } from "@/data/products";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_KEY = "cart_guest";

const getStorageKey = (userId?: string) =>
  userId ? `cart_${userId}` : GUEST_KEY;

const loadCart = (key: string): CartItem[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (key: string, items: CartItem[]) => {
  localStorage.setItem(key, JSON.stringify(items));
};

const mergeItems = (base: CartItem[], incoming: CartItem[]): CartItem[] => {
  const merged = [...base];
  incoming.forEach((inc) => {
    const existing = merged.find(
      (i) => (i.product.id || i.product._id) === (inc.product.id || inc.product._id)
    );
    if (existing) {
      existing.quantity += inc.quantity;
    } else {
      merged.push(inc);
    }
  });
  return merged;
};

export const CartProvider = ({
  children,
  userId,
}: {
  children: ReactNode;
  userId?: string;
}) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load user cart on initial render; if not logged in, load guest cart
    return loadCart(getStorageKey(userId));
  });

  // When userId changes (login / logout), swap carts
  const prevUserIdRef = React.useRef<string | undefined>(userId);
  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    prevUserIdRef.current = userId;

    if (prevUserId === userId) return; // no change

    if (userId) {
      // User just logged in: save current guest items, merge with user cart
      const guestItems = items; // items currently in state (guest cart)
      const userItems = loadCart(getStorageKey(userId));
      const merged = mergeItems(userItems, guestItems);
      saveCart(GUEST_KEY, []); // clear guest cart
      saveCart(getStorageKey(userId), merged);
      setItems(merged);
    } else {
      // User just logged out: persist remaining items as guest cart
      saveCart(GUEST_KEY, []);
      setItems([]);
    }
  }, [userId]);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveCart(getStorageKey(userId), items);
  }, [items, userId]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const id = product.id || product._id;
      const existing = prev.find((i) => (i.product.id || i.product._id) === id);
      if (existing)
        return prev.map((i) =>
          (i.product.id || i.product._id) === id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback(
    (productId: string) =>
      setItems((prev) =>
        prev.filter((i) => (i.product.id || i.product._id) !== productId)
      ),
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) return removeFromCart(productId);
      setItems((prev) =>
        prev.map((i) =>
          (i.product.id || i.product._id) === productId ? { ...i, quantity } : i
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
