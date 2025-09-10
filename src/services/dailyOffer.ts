// services/dailyOffer.ts

// Importe as interfaces corretas do seu projeto. Ajuste o caminho se necessário.
// Ex: import { Product } from "@/src/services/cardService";
import { Product } from "./productsCardCarousel"; // <- verifique se o nome e caminho batem

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
  products: Product[];
  total?: number;
  skip?: number;
  limit?: number;
}

export async function getDailyOfferData(): Promise<DailyOfferDetails | null> {
  try {
    const res = await fetch("https://dummyjson.com/products/category/laptops");
    if (!res.ok) {
      console.error("Erro ao buscar categoria laptops:", res.status, await res.text());
      return null;
    }

    const data: DummyCategoryResponse = await res.json();

    if (!data?.products || data.products.length === 0) return null;

    const product = data.products[0];

    // Garantir que discountPercentage esteja definido e seja um número válido entre 0 e 100
    const discount = typeof product.discountPercentage === "number" && product.discountPercentage > 0
      ? product.discountPercentage
      : undefined;

    // Calcula originalPrice somente se houver discount válido
    const originalPrice = discount
      ? Math.round(product.price / (1 - discount / 100))
      : undefined;

    const image = product.thumbnail ?? product.images?.[0] ?? "/placeholder.svg";

    return {
      id: product.id.toString(),
      image,
      title: product.title,
      description: product.description,
      link: `/produto/${product.id}`, // rota alinhada com seu projeto (src/app/produto/[id]/page.tsx)
      originalPrice,
      currentPrice: product.price,
      discountPercentage: discount,
    };
  } catch (error) {
    console.error("Erro ao carregar a oferta do dia (notebook):", error);
    return null;
  }
}
