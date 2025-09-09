import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

interface CartState {
  items: CartItem[]
  total: number
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
}

const loadCartFromStorage = (): CartState => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      return JSON.parse(savedCart)
    }
  }
  return initialState
}

const saveCartToStorage = (state: CartState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(state))
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }

      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      saveCartToStorage(state)
    },
    // Ajuste: payload agora é um objeto com as informações completas do item
    removeFromCart: (state, action: PayloadAction<{ id: string; size?: string; color?: string }>) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color)
      )
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      saveCartToStorage(state)
    },
    // Ajuste: payload agora é um objeto completo com quantidade
    updateQuantity: (state, action: PayloadAction<{ id: string; size?: string; color?: string; quantity: number }>) => {
      const item = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color
      )
      if (item) {
        item.quantity = action.payload.quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color)
          )
        }
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      saveCartToStorage(state)
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
      saveCartToStorage(state)
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } = cartSlice.actions
export default cartSlice.reducer