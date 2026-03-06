"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, CartItemExtra } from "@/types/CartItem";
import { Product } from "@/types/Product";

type CartState = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
};

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        product: Product;
        quantity: number;
        selectedExtras: CartItemExtra[];
      };
    }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_FROM_STORAGE"; payload: CartItem[] };

function computeTotals(items: CartItem[]) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitTotal * item.quantity,
    0
  );
  const deliveryFee = 0;
  return { itemCount, subtotal, deliveryFee, total: subtotal + deliveryFee };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, selectedExtras } = action.payload;
      const extrasTotal = selectedExtras.reduce(
        (sum, e) => sum + e.extra.price * e.qty,
        0
      );
      const unitTotal = product.price + extrasTotal;
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        selectedExtras,
        unitTotal,
      };
      const items = [...state.items, newItem];
      return { items, ...computeTotals(items) };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.id !== action.payload.id);
      return { items, ...computeTotals(items) };
    }
    case "UPDATE_QUANTITY": {
      const items = state.items.map((i) =>
        i.id === action.payload.id
          ? { ...i, quantity: Math.max(1, action.payload.quantity) }
          : i
      );
      return { items, ...computeTotals(items) };
    }
    case "CLEAR_CART": {
      return { items: [], itemCount: 0, subtotal: 0, deliveryFee: 0, total: 0 };
    }
    case "LOAD_FROM_STORAGE": {
      const items = action.payload;
      return { items, ...computeTotals(items) };
    }
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  deliveryFee: 0,
  total: 0,
};

type CartContextType = CartState & {
  addItem: (
    product: Product,
    quantity: number,
    selectedExtras?: CartItemExtra[]
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("brothers-burger-cart");
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        if (items.length > 0) {
          dispatch({ type: "LOAD_FROM_STORAGE", payload: items });
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("brothers-burger-cart", JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const addItem = (
    product: Product,
    quantity: number,
    selectedExtras: CartItemExtra[] = []
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, selectedExtras } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
