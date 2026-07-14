"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { CartItem, CartState } from "@/types";
import { analytics } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Cart Actions
// ---------------------------------------------------------------------------
type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

// ---------------------------------------------------------------------------
// Cart Reducer
// ---------------------------------------------------------------------------
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return {
        items: action.payload,
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
      };

    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      );

      const updatedItems = existing
        ? state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { ...action.payload, quantity: 1 }];

      return {
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (i) => i.productId !== action.payload.productId
      );
      return {
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const updatedItems = state.items.filter(
          (i) => i.productId !== action.payload.productId
        );
        return {
          items: updatedItems,
          itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
        };
      }
      const updatedItems = state.items.map((i) =>
        i.productId === action.payload.productId
          ? { ...i, quantity: action.payload.quantity }
          : i
      );
      return {
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }

    case "CLEAR_CART":
      return { items: [], itemCount: 0 };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------
interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "lps_cart_v1";
const initialState: CartState = { items: [], itemCount: 0 };

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {
      // Corrupt storage — silently reset
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // Persist to localStorage on every cart change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // localStorage quota exceeded — no-op
    }
  }, [state.items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      dispatch({ type: "ADD_ITEM", payload: item });
      analytics.addedToCart(item.productId, item.name, item.category);
      toast.success(`${item.name} added to cart`, {
        description: "Tap 'Send Order via WhatsApp' to complete your enquiry.",
        duration: 3000,
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
    analytics.removedFromCart(productId);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const isInCart = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
    }),
    [state, addItem, removeItem, updateQuantity, clearCart, isInCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook — must be used within CartProvider
// ---------------------------------------------------------------------------
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
