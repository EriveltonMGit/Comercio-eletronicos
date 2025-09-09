import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  description: string
  category: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
  sizes?: string[]
  colors?: string[]
  features?: string[]
}

interface ProductsState {
  items: Product[]
  filteredItems: Product[]
  categories: string[]
  brands: string[]
  searchQuery: string
  filters: {
    category: string
    brand: string
    priceRange: [number, number]
    sortBy: "name" | "price-low" | "price-high" | "rating"
  }
  isLoading: boolean
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  categories: [],
  brands: [],
  searchQuery: "",
  filters: {
    category: "",
    brand: "",
    priceRange: [0, 1000],
    sortBy: "name",
  },
  isLoading: false,
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload
      state.filteredItems = action.payload
      state.categories = [...new Set(action.payload.map((p) => p.category))]
      state.brands = [...new Set(action.payload.map((p) => p.brand))]
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      applyFiltersAndSearch(state)
    },
    setFilters: (state, action: PayloadAction<Partial<ProductsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
      applyFiltersAndSearch(state)
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
      state.searchQuery = ""
      state.filteredItems = state.items
    },
  },
})

function applyFiltersAndSearch(state: ProductsState) {
  let filtered = state.items

  // Apply search query
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query),
    )
  }

  // Apply filters
  if (state.filters.category) {
    filtered = filtered.filter((p) => p.category === state.filters.category)
  }

  if (state.filters.brand) {
    filtered = filtered.filter((p) => p.brand === state.filters.brand)
  }

  filtered = filtered.filter((p) => p.price >= state.filters.priceRange[0] && p.price <= state.filters.priceRange[1])

  // Apply sorting
  switch (state.filters.sortBy) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filtered.sort((a, b) => b.price - a.price)
      break
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating)
      break
    default:
      filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  state.filteredItems = filtered
}

export const { setProducts, setSearchQuery, setFilters, clearFilters } = productsSlice.actions
export default productsSlice.reducer
