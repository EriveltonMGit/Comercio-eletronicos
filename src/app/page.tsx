// src/app/HomePage.tsx
"use client";

import { useEffect, useState } from "react";
import { Footer } from "../components/layout/footer";
import { CartSidebar } from "../components/cart/cart-sidebar";
import { ProductCard } from "../components/products/product-card";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setProducts } from "../lib/features/products/productsSlice";
import { getAllProductsData, ProductDetails } from "@/src/services/cardService";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { imagens } from "../types/imagens";
import CarrosselMercadoLivre from "../components/imageCarousel/carousel";
import Header from "../components/layout/header";
import { ProductGridSkeleton } from "../components/ui/skeleton";
import { PromoCards } from "../components/PromoCards/PromoCards";
import { translations } from "@/src/lib/translations";
import * as React from "react";

interface ProductsByCategory {
  [key: string]: ProductDetails[];
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const [isLoading, setIsLoading] = useState(true);
  const [productsByCategory, setProductsByCategory] = useState<ProductsByCategory>({});
  const carouselRef = React.useRef<HTMLDivElement>(null);

  // Início das alterações de paginação
  const [pages, setPages] = useState<{ [key: string]: number }>({});
  const itemsPerPage = 4; // Defina quantos itens por página você quer

  const handlePageChange = (category: string, pageNumber: number) => {
    setPages(prev => ({ ...prev, [category]: pageNumber }));
  };
  // Fim das alterações de paginação

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsFromApi = await getAllProductsData();
        if (productsFromApi.length > 0) {
          dispatch(setProducts(productsFromApi));

          const groupedProducts = productsFromApi.reduce<ProductsByCategory>((acc, product) => {
            const category = product.category;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(product);
            return acc;
          }, {});

          setProductsByCategory(groupedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (products.length === 0) {
      fetchProducts();
    } else {
      const groupedProducts = products.reduce<ProductsByCategory>((acc, product) => {
        const category = product.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product as ProductDetails);
        return acc;
      }, {});
      setProductsByCategory(groupedProducts);
      setIsLoading(false);
    }
  }, [dispatch, products.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const electronicCategories = ["smartphones", "laptops"];

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Header />
      <CarrosselMercadoLivre imagens={imagens} />
      <CartSidebar />
      <PromoCards />

      <main className="container mx-auto px-2 sm:px-4 lg:px-8 mt-12 sm:mt-16 lg:mt-32">
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          Object.keys(productsByCategory).length > 0 ? (
            <>
              {/* Seção de Eletrônicos em Destaque (Carrossel) */}
              <section className="mb-12 relative">
                <Card className="bg-white rounded-lg shadow py-8">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-2xl text-slate-900 mb-4">
                      Eletrônicos em Destaque
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleScroll('left')}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleScroll('right')}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 hidden md:block">
                      Confira os melhores e mais modernos aparelhos do mercado.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div ref={carouselRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-p-4 md:scroll-p-8">
                      {products.filter(p => electronicCategories.includes(p.category)).map(product => (
                        <div key={product.id} className="flex-none w-64 snap-center">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Demais Categorias (Grid com Paginação) */}
              {Object.entries(productsByCategory)
                .filter(([category]) => !electronicCategories.includes(category))
                .map(([category, products]) => {
                  // Início da lógica de paginação
                  const currentPage = pages[category] || 1;
                  const totalPages = Math.ceil(products.length / itemsPerPage);
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const paginatedProducts = products.slice(startIndex, endIndex);
                  // Fim da lógica de paginação

                  return (
                    <section key={category} className="mb-12">
                      <Card className="bg-white rounded-lg shadow py-8 ">
                        <CardHeader>
                          <CardTitle className="flex  items-center justify-between text-2xl text-slate-900 mb-4">
                            {translations[category] || category}
                            <div className="flex gap-2">
                              {/* Botões de navegação */}
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(category, currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(category, currentPage + 1)}
                                disabled={currentPage === totalPages}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500 hidden md:block">
                            {translations[`${category}-description`] || `Explore os melhores produtos na categoria de ${translations[category] || category}.`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 ">
                          {/* Renderiza os produtos paginados */}
                          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedProducts.map(product => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  );
                })}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}