// src/services/cardService.ts

export  interface Product {
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
}

export interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  discount?: string;
}

// Função auxiliar para gerar dados fictícios do vendedor
const generateSellerData = (): Seller => {
  return {
    name: "Loja Exemplo " + Math.floor(Math.random() * 1000),
    rating: parseFloat((Math.random() * 3 + 2).toFixed(1)), // Convertendo para número
    sales: Math.floor(Math.random() * 1000),
  };
};

// Função auxiliar para gerar especificações fictícias
const generateSpecifications = (product: Product) => {
  return [
    { key: "Marca", value: product.brand },
    { key: "Categoria", value: product.category },
    { key: "Modelo", value: `MOD-${product.id.toString().padStart(4, '0')}` },
    { key: "Garantia", value: "12 meses" },
    { key: "SKU", value: `SKU-${product.id.toString().padStart(6, '0')}` },
  ];
};

export const getCardData = async (): Promise<ProductDetails[]> => {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    if (data && data.products) {
      const firstSixProducts: Product[] = data.products.slice(0, 6);
      return firstSixProducts.map((product) => ({
        id: product.id,
        category: product.category, 
        name: product.title,
        image: product.thumbnail || product.images[0] || "/placeholder.svg",
        description: product.description.substring(0, 80) + "...",
        price: product.price,
        originalPrice: Math.round(product.price * (1 + product.discountPercentage/100)),
        discount: `${Math.round(product.discountPercentage)}%`,
        discountPercentage: product.discountPercentage,
        shipment: Math.random() > 0.5 ? "Frete grátis" : "Frete grátis",
        images: product.images,
        rating: product.rating,
        reviewsCount: Math.floor(Math.random() * 500),
        stock: product.stock,
        seller: generateSellerData(),
        specifications: generateSpecifications(product),
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<ProductDetails | undefined> => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const data: Product = await response.json();

    if (data) {
      return {
        id: data.id,
        category: data.category,
        name: data.title,
        image: data.thumbnail || data.images[0] || "/placeholder.svg",
        description: data.description,
        price: data.price,
        originalPrice: Math.round(data.price * (1 + data.discountPercentage/100)),
        discount: `${Math.round(data.discountPercentage)}`,
        discountPercentage: data.discountPercentage,
        shipment: Math.random() > 0.5 ? "Frete grátis" : "Frete grátis",
        images: data.images,
        rating: data.rating,
        reviewsCount: Math.floor(Math.random() * 500),
        stock: data.stock,
        seller: generateSellerData(),
        specifications: generateSpecifications(data),
      };
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return undefined;
  }
};

export const getRelatedProducts = async (id: string): Promise<RelatedProduct[]> => {
  try {
    const response = await fetch(`https://dummyjson.com/products/category/${id}`);
    const data = await response.json();

    if (data && data.products) {
      return data.products.slice(0, 5).map((product: Product) => ({
        id: product.id,
        name: product.title,
        image: product.thumbnail || product.images[0] || "/placeholder.svg",
        price: product.price,
        discount: `${Math.round(product.discountPercentage)}%`,
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching related products for ID ${id}:`, error);
    return [];
  }
};