// src/services/dailyOffer.ts

import { Product as ApiProduct, ProductDetails } from "@/src/services/cardService";

export interface DailyOfferDetails {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
  originalPrice?: number;
  currentPrice: number;
  discountPercentage?: number;
}

interface DummyCategoryResponse {
  products: ApiProduct[];
  total?: number;
  skip?: number;
  limit?: number;
}

// Esta função busca uma única oferta do dia (o primeiro produto da categoria laptops)
export async function getDailyOfferData(): Promise<DailyOfferDetails | null> {
  try {
    const res = await fetch("https://dummyjson.com/products/category/laptops");
    if (!res.ok) {
      console.error("Erro ao buscar categoria laptops:", res.status, await res.text());
      return null;
    }

    const data: DummyCategoryResponse = await res.json();

    // Se não houver produtos, retorne null
    if (!data?.products || data.products.length === 0) return null;

    const product = data.products[0];

    // Calcula o preço original com base no desconto
    const originalPrice = product.discountPercentage 
      ? Math.round(product.price / (1 - product.discountPercentage / 100))
      : undefined;

    const image = product.thumbnail ?? product.images?.[0] ?? "/placeholder.svg";

    return {
      id: product.id.toString(),
      image,
      title: product.title,
      description: product.description,
      link: `/produto/${product.id}`, 
      originalPrice,
      currentPrice: product.price,
      discountPercentage: product.discountPercentage,
    };
  } catch (error) {
    console.error("Erro ao carregar a oferta do dia (notebook):", error);
    return null;
  }
}