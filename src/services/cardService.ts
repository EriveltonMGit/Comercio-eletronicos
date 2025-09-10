// src/services/cardService.ts

export interface Product {
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

interface Seller {
  name: string;
  rating: number;
  sales: number;
}

export interface ProductDetails {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount: string;
  discountPercentage: number;
  shipment: string | boolean;
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  category: string;
  seller: Seller;
  specifications: {
    key: string;
    value: string;
  }[];
  colors?: string[];
  sizes?: string[];
  features?: string[];
  brand: string;
}

export interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  discount?: string;
  brand: string;
}

const generateSellerData = (brand: string): Seller => {
  return {
    name: brand + " Store",
    rating: parseFloat((Math.random() * 3 + 2).toFixed(1)),
    sales: Math.floor(Math.random() * 1000),
  };
};

const generateSpecifications = (product: Product): { key: string; value: string }[] => {
  return [
    { key: "Marca", value: product.brand },
    { key: "Categoria", value: product.category },
    { key: "Modelo", value: `MOD-${product.id.toString().padStart(4, "0")}` },
    { key: "Garantia", value: "12 meses" },
    { key: "SKU", value: `SKU-${product.id.toString().padStart(6, "0")}` },
  ];
};

/**
 * Função auxiliar para formatar um produto da API para o tipo ProductDetails.
 * Isso garante a consistência do tipo em toda a aplicação.
 */
const formatProduct = (product: Product): ProductDetails => ({
  id: product.id,
  category: product.category,
  name: product.title,
  brand: product.brand,
  image: product.thumbnail || product.images[0] || "/placeholder.svg",
  description: product.description.substring(0, 80) + "...",
  price: product.price,
  originalPrice: Math.round(product.price * (1 + product.discountPercentage / 100)),
  discount: `${Math.round(product.discountPercentage)}%`,
  discountPercentage: product.discountPercentage,
  shipment: "Frete grátis",
  images: product.images,
  rating: product.rating,
  reviewsCount: Math.floor(Math.random() * 500),
  stock: product.stock,
  seller: generateSellerData(product.brand),
  specifications: generateSpecifications(product),
});


export const getCategoryCounts = async (): Promise<Record<string, number>> => {
  try {
    const response = await fetch('https://dummyjson.com/products/categories');
    const categories: string[] = await response.json();
    const counts: Record<string, number> = {};

    for (const category of categories) {
      const catResponse = await fetch(`https://dummyjson.com/products/category/${category}`);
      const catData = await catResponse.json();
      counts[category] = catData.total;
    }

    return counts;
  } catch (error) {
    console.error("Erro ao buscar a contagem das categorias:", error);
    return {};
  }
};


export const getAllProductsData = async (): Promise<ProductDetails[]> => {
  try {
    const allProducts: ProductDetails[] = [];
    const limit = 100;
    let skip = 0;
    let total = 0;

    do {
      const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      const data = await response.json();
      
      if (data && data.products) {
        const productsPage: Product[] = data.products;
        total = data.total;
        const formattedProducts = productsPage.map(formatProduct);
        
        allProducts.push(...formattedProducts);
        skip += limit;
      } else {
        break; // Sai do loop se não houver mais produtos
      }
    } while (allProducts.length < total);

    return allProducts;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<ProductDetails[]> => {
  try {
    const response = await fetch(`https://dummyjson.com/products/category/${category}`);
    const data = await response.json();

    if (data && data.products) {
      const products: Product[] = data.products;
      return products.map(formatProduct);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
};


export const getProductById = async (id: string): Promise<ProductDetails | undefined> => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const data: Product = await response.json();

    if (data) {
      return formatProduct(data);
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return undefined;
  }
};
// Novo: função para buscar a lista completa de categorias
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch('https://dummyjson.com/products/categories');
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const categories: string[] = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
};
export const getRelatedProducts = async (category: string): Promise<RelatedProduct[]> => {
  try {
    const response = await fetch(`https://dummyjson.com/products/category/${category}`);
    const data = await response.json();

    if (data && data.products) {
      return data.products.slice(0, 5).map((product: Product) => ({
        id: product.id,
        name: product.title,
        image: product.thumbnail || product.images[0] || "/placeholder.svg",
        price: product.price,
        discount: `${Math.round(product.discountPercentage)}%`,
        brand: product.brand,
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching related products for category ${category}:`, error);
    return [];
  }
};