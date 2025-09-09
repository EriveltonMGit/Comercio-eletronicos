// services/dailyOffer.ts

// Reutilizamos as interfaces Product e ProductDetails do seu cardService.ts
// Certifique-se de que esses tipos estão disponíveis ou importe-os se estiverem em um arquivo separado
import { Product, ProductDetails,  } from './productsCardCarousel'; // Ajuste o caminho se necessário

export interface DailyOfferDetails {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
  originalPrice?: number;
  currentPrice: number;
  discountPercentage?: number; // Adicionar percentual de desconto
}

export async function getDailyOfferData(): Promise<DailyOfferDetails | null> {
  try {
    // Buscamos produtos da categoria 'laptops'
    const response = await fetch("https://dummyjson.com/products/category/laptops");
    const data = await response.json();

    if (data && data.products && data.products.length > 0) {
      // Pega o primeiro notebook encontrado na lista
      const product: Product = data.products[0];

      // Formata os dados para o seu DailyOfferDetails
      const originalPrice = Math.round(product.price * (1 + product.discountPercentage / 100));
      const currentPrice = product.price;

      return {
        id: product.id.toString(),
        image: product.thumbnail || product.images[0],
        title: product.title,
        description: product.description,
        link: `/products/${product.id}`, // Link para a página de detalhes do produto
        originalPrice: originalPrice,
        currentPrice: currentPrice,
        discountPercentage: product.discountPercentage,
      };
    }
    // Se não encontrar notebooks, retorna null
    return null;
  } catch (error) {
    console.error("Erro ao carregar a oferta do dia (notebook):", error);
    return null;
  }
}