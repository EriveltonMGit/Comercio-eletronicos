import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
}

// Load auth from localStorage
const loadAuthFromStorage = (): AuthState => {
  if (typeof window !== "undefined") {
    const savedAuth = localStorage.getItem("auth")
    if (savedAuth) {
      return JSON.parse(savedAuth)
    }
  }
  return initialState
}

// Save auth to localStorage
const saveAuthToStorage = (state: AuthState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth", JSON.stringify(state))
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthFromStorage(),
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      saveAuthToStorage(state)
    },
    loginFailure: (state) => {
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      saveAuthToStorage(state)
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer
