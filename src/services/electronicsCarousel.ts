// services/electronicsCarousel.ts

// Reutilize as interfaces do seu cardService.ts, ou defina-as aqui se preferir.
// Por simplicidade, vou defini-las aqui novamente para que este arquivo seja autocontido.
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
  id: string; // Mudei para string para ser consistente, mas dummyjson usa number. Ajuste conforme sua necessidade.
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  shipment?: string;
  rating: number;
  reviewsCount: number;
  seller: {
    name: string;
  };
}

// Funções auxiliares para simular dados que a dummyjson não tem diretamente
const generateSellerData = (): { name: string } => {
  return {
    name: "Eletrônicos Shop " + Math.floor(Math.random() * 50),
  };
};

const generateReviewsCount = (): number => {
  return Math.floor(Math.random() * 400) + 100; // Entre 100 e 500 reviews
};

export async function getElectronicsData(): Promise<ProductDetails[]> {
  // A categoria para notebooks na dummyjson.com é 'laptops'
  const categoryToFetch = 'laptops';
  const limit = 15; // Número de produtos que queremos buscar

  try {
    // Requisição para a categoria específica de 'laptops'
    const response = await fetch(`https://dummyjson.com/products/category/${categoryToFetch}?limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro detalhado da API DummyJSON:", errorData);
      throw new Error(`Erro na API DummyJSON: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.products || !Array.isArray(data.products)) {
      console.warn("Resposta da API DummyJSON não contém 'products' ou não é um array:", data);
      return [];
    }

    const products: ProductDetails[] = data.products.map((product: ProductDummyJson) => {
      const originalPrice = product.price / (1 - product.discountPercentage / 100);
      const discount = product.discountPercentage > 0
        ? `${Math.round(product.discountPercentage)}% OFF`
        : undefined;

      return {
        id: product.id.toString(), // Converte para string se sua interface espera string
        name: product.title,
        image: product.thumbnail || product.images[0] || "/placeholder.svg",
        price: product.price,
        originalPrice: Math.round(originalPrice * 100) / 100, // Arredonda para 2 casas decimais
        discount: discount,
        shipment: Math.random() > 0.3 ? "Frete GRÁTIS" : undefined, // Mais chances de frete grátis
        rating: product.rating,
        reviewsCount: generateReviewsCount(),
        seller: generateSellerData(),
      };
    });

    return products;

  } catch (error) {
    console.error("Erro ao buscar ou processar produtos eletrônicos da DummyJSON:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}