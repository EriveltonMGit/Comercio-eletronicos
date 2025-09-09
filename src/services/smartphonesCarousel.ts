// services/smartphonesCarousel.ts

// Reutilize as interfaces do seu cardService.ts ou ElectronicsCarousel.ts
interface ProductDummyJson {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductDetails {
  id: string; // ID do produto
  name: string; // Título do produto
  image: string; // URL da imagem principal
  price: number;
  originalPrice?: number;
  discount?: string; // Ex: "10% OFF"
  shipment?: string; // Ex: "Frete GRÁTIS"
  rating: number;
  reviewsCount: number;
  seller: {
    name: string; // Nome do vendedor
  };
}

// Funções auxiliares para simular dados que a dummyjson não tem diretamente
const generateSellerData = (): { name: string } => {
  return {
    name: "Smartphone Mega Store " + Math.floor(Math.random() * 50),
  };
};

const generateReviewsCount = (): number => {
  return Math.floor(Math.random() * 600) + 150; // Entre 150 e 750 reviews
};

export async function getSmartphonesData(): Promise<ProductDetails[]> {
  // A categoria para smartphones na dummyjson.com é 'smartphones'
  const categoryToFetch = 'smartphones';
  const limit = 15; // Número de produtos que queremos buscar

  try {
    // Requisição para a categoria específica de 'smartphones'
    const response = await fetch(`https://dummyjson.com/products/category/${categoryToFetch}?limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro detalhado da API DummyJSON para Smartphones:", errorData);
      throw new Error(`Erro na API DummyJSON: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.products || !Array.isArray(data.products)) {
      console.warn("Resposta da API DummyJSON para Smartphones não contém 'products' ou não é um array:", data);
      return [];
    }

    const products: ProductDetails[] = data.products.map((product: ProductDummyJson) => {
      const originalPrice = product.price / (1 - product.discountPercentage / 100);
      const discount = product.discountPercentage > 0
        ? `${Math.round(product.discountPercentage)}% OFF`
        : undefined;

      return {
        id: product.id.toString(), // Converte para string
        name: product.title,
        image: product.thumbnail || product.images[0] || "/placeholder.svg",
        price: product.price,
        originalPrice: Math.round(originalPrice * 100) / 100, // Arredonda para 2 casas decimais
        discount: discount,
        shipment: Math.random() > 0.2 ? "Frete GRÁTIS" : undefined, // Mais chances de frete grátis
        rating: product.rating,
        reviewsCount: generateReviewsCount(),
        seller: generateSellerData(),
      };
    });

    return products;

  } catch (error) {
    console.error("Erro ao buscar ou processar produtos de Smartphones da DummyJSON:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}