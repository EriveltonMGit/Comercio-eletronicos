import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentMethod {
  type: "credit" | "debit" | "pix" | "boleto"
  cardNumber?: string
  cardName?: string
  expiryDate?: string
  cvv?: string
  installments?: number
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

interface CheckoutState {
  currentStep: number
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  shippingMethod: ShippingMethod | null
  isProcessing: boolean
  orderId: string | null
  // FIX: Adicionando orderTotal à interface do estado
  orderTotal: number | null
}

const initialState: CheckoutState = {
  currentStep: 1,
  shippingAddress: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brasil",
  },
  paymentMethod: {
    type: "credit",
    installments: 1,
  },
  shippingMethod: null,
  isProcessing: false,
  orderId: null,
  // FIX: Inicializando orderTotal como null
  orderTotal: null,
}

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    setShippingAddress: (state, action: PayloadAction<Partial<ShippingAddress>>) => {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload }
    },
    setPaymentMethod: (state, action: PayloadAction<Partial<PaymentMethod>>) => {
      state.paymentMethod = { ...state.paymentMethod, ...action.payload }
    },
    setShippingMethod: (state, action: PayloadAction<ShippingMethod>) => {
      state.shippingMethod = action.payload
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload
    },
    setOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload
    },
    // FIX: Adicionando o novo reducer para salvar o total do pedido
    setOrderTotal: (state, action: PayloadAction<number>) => {
      state.orderTotal = action.payload
    },
    resetCheckout: (state) => {
      return initialState
    },
  },
})

export const {
  setCurrentStep,
  setShippingAddress,
  setPaymentMethod,
  setShippingMethod,
  setProcessing,
  setOrderId,
  // FIX: Exportando a nova action
  setOrderTotal,
  resetCheckout,
} = checkoutSlice.actions

export const clearCheckout = resetCheckout

export default checkoutSlice.reducer