// src/lib/features/products/productsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: number;
  name: string;
  title?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviewsCount?: number;
  stock: number;
  sizes?: string[];
  colors?: string[];
  features?: string[];
  discount?: string;
  discountPercentage?: number;
  shipment?: string | boolean;
  seller?: { name: string };
  tags?: string[];
}

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  categories: string[];
  brands: string[];
  searchQuery: string;
  filters: {
    category: string;
    brand: string;
    priceRange: [number, number];
    sortBy: "name" | "price-low" | "price-high" | "rating";
  };
  isLoading: boolean;
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
};

/* ---------------------
  ALIASES: categorias "amigáveis" que o menu/links usa (ex: laptops)
--------------------- */
const CATEGORY_ALIASES: Record<string, string[]> = {
  laptops: ["laptop", "notebook", "macbook", "thinkpad"],
  "mens-shirts": ["shirt", "camisa", "t-shirt"],
  "pet-supplies": ["pet", "dog", "cat", "ração", "pet food"],
  "mobile-accessories": ["charger", "cabo", "case", "capinha", "carregador"],
  // adicione aqui mais aliases conforme seu catálogo
};

function normalizeTextForSearch(text?: string) {
  return (text ?? "").toString().toLowerCase();
}

function matchByAliases(product: Product, categoryKey: string) {
  const keywords = CATEGORY_ALIASES[categoryKey] ?? [categoryKey.replace(/-/g, " ")];
  const haystack =
    normalizeTextForSearch(product.name) +
    " " +
    normalizeTextForSearch(product.title) +
    " " +
    normalizeTextForSearch(product.description) +
    " " +
    (product.tags || []).join(" ").toLowerCase() +
    " " +
    normalizeTextForSearch(product.brand) +
    " " +
    normalizeTextForSearch(product.category);
  return keywords.some(k => haystack.includes(k.toLowerCase()));
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      // Normalize products: garante name/title, lowercases em category/brand, garante tags[]
      const normalized = action.payload.map((p) => {
        const name = (p as any).name ?? (p as any).title ?? p.title ?? "";
        return {
          ...p,
          name,
          title: p.title ?? undefined,
          category: (p.category ?? "").toString().toLowerCase(),
          brand: (p.brand ?? "").toString(),
          tags: p.tags ?? [],
        } as Product;
      });

      state.items = normalized;
      state.filteredItems = normalized;

      // categories baseadas nas categorias reais dos produtos
      const categoriesSet = new Set(normalized.map((p) => (p.category || "").toString().toLowerCase()).filter(Boolean));

      // adiciona aliases como categorias quando houver produtos que batam com os aliases
      for (const aliasKey of Object.keys(CATEGORY_ALIASES)) {
        if (!categoriesSet.has(aliasKey)) {
          const found = normalized.some((p) => matchByAliases(p, aliasKey));
          if (found) categoriesSet.add(aliasKey);
        }
      }

      state.categories = Array.from(categoriesSet);
      state.brands = Array.from(new Set(normalized.map((p) => p.brand).filter(Boolean)));
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      applyFiltersAndSearch(state);
    },

    setFilters: (state, action: PayloadAction<Partial<ProductsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
      applyFiltersAndSearch(state);
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = "";
      state.filteredItems = state.items;
    },
  },
});

export const { setProducts, setSearchQuery, setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;

function applyFiltersAndSearch(state: ProductsState) {
  let filtered = state.items;

  // Busca por query (nome/descrição/marca/categoria)
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.name ?? "").toLowerCase().includes(query) ||
        (p.title ?? "").toLowerCase().includes(query) ||
        (p.description ?? "").toLowerCase().includes(query) ||
        (p.category ?? "").toLowerCase().includes(query) ||
        (p.brand ?? "").toLowerCase().includes(query) ||
        ((p.tags || []).join(" ").toLowerCase().includes(query)),
    );
  }

  // FILTRO DE CATEGORIA — com fallback por aliases caso não haja correspondência exata
  if (state.filters.category) {
    const selectedCat = state.filters.category.toString().toLowerCase();

    // primeiro tenta correspondência exata
    let byCategory = filtered.filter((p) => (p.category ?? "").toString().toLowerCase() === selectedCat);

    // se não achou nada, tenta buscar por aliases/palavras-chave em title/description/tags/brand
    if (byCategory.length === 0) {
      byCategory = filtered.filter((p) => matchByAliases(p, selectedCat));
      // console.debug(`[productsSlice] fallback category search for "${selectedCat}", found ${byCategory.length} results`);
    }

    filtered = byCategory;
  }

  // FILTRO DE MARCA
  if (state.filters.brand) {
    const brandFilter = state.filters.brand.toString();
    filtered = filtered.filter((p) => (p.brand ?? "").toString() === brandFilter);
  }

  // FILTRO DE PREÇO
  filtered = filtered.filter((p) => p.price >= state.filters.priceRange[0] && p.price <= state.filters.priceRange[1]);

  // ORDENAÇÃO
  switch (state.filters.sortBy) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    default:
      filtered.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
  }

  state.filteredItems = filtered;
}
