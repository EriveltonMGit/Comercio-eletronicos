import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
}

interface FavoritesState {
  items: FavoriteItem[]
}

const initialState: FavoritesState = {
  items: [],
}

// Load favorites from localStorage
const loadFavoritesFromStorage = (): FavoritesState => {
  if (typeof window !== "undefined") {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      return JSON.parse(savedFavorites)
    }
  }
  return initialState
}

// Save favorites to localStorage
const saveFavoritesToStorage = (state: FavoritesState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("favorites", JSON.stringify(state))
  }
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: loadFavoritesFromStorage(),
  reducers: {
    addToFavorites: (state, action: PayloadAction<FavoriteItem>) => {
      const exists = state.items.find((item) => item.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
        saveFavoritesToStorage(state)
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      saveFavoritesToStorage(state)
    },
    clearFavorites: (state) => {
      state.items = []
      saveFavoritesToStorage(state)
    },
  },
})

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
