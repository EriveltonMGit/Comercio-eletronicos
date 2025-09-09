// lib/features/cart/cartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
};

// Safe loader: lê itens + total do localStorage, MAS força isOpen = false
const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") return initialState;
  const savedCart = localStorage.getItem("cart");
  if (!savedCart) return initialState;

  try {
    const parsed = JSON.parse(savedCart);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      total: typeof parsed.total === "number" ? parsed.total : 0,
      isOpen: false, // <-- sempre carregar fechado
    };
  } catch (e) {
    console.error("Erro ao parsear cart do localStorage:", e);
    return initialState;
  }
};

// Ao salvar, excluímos isOpen para não persistir o state de UI
const saveCartToStorage = (state: CartState) => {
  if (typeof window === "undefined") return;
  const { isOpen, ...toSave } = state;
  try {
    localStorage.setItem("cart", JSON.stringify(toSave));
  } catch (e) {
    console.error("Erro ao salvar cart no localStorage:", e);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCartToStorage(state);
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size?: string; color?: string }>) => {
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color)
      );
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCartToStorage(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; size?: string; color?: string; quantity: number }>) => {
      const item = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color
      );
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color)
          );
        }
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      saveCartToStorage(state);
    },
    // toggleCart agora aceita payload boolean para forçar estado
    toggleCart: (state, action: PayloadAction<boolean | undefined>) => {
      if (typeof action.payload === "boolean") {
        state.isOpen = action.payload;
      } else {
        state.isOpen = !state.isOpen;
      }
      // Não precisamos salvar isOpen no localStorage
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;
