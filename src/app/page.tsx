// src/app/HomePage.tsx
"use client";

import { useEffect, useState } from "react";
import { Footer } from "../components/layout/footer";
import { CartSidebar } from "../components/cart/cart-sidebar";
import { ProductGrid } from "../components/products/product-grid";
import { Button } from "../components/ui/button";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setProducts } from "../lib/features/products/productsSlice";
import { getAllProductsData } from "@/src/services/cardService";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { imagens } from "../types/imagens";
import CarrosselMercadoLivre from "../components/imageCarousel/carousel";
import Header from "../components/layout/header";
import { ProductGridSkeleton } from "../components/ui/skeleton";
import { PromoCards } from "../components/PromoCards/PromoCards";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsFromApi = await getAllProductsData();
        if (productsFromApi.length > 0) {
          dispatch(setProducts(productsFromApi));
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
      setIsLoading(false);
    }
  }, [dispatch, products.length]);

  const featuredProducts = products
    .filter((p) => p.category === "smartphones" || p.category === "laptops")
    .slice(0, 4);

  const discountedProducts = products.filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Header />
      <CarrosselMercadoLivre imagens={imagens} />
      <CartSidebar />

      <main>
        {/* Destaques */}
        <section className="py-12 sm:py-16">
          <PromoCards />
          <div className="container mx-auto px-2 sm:px-4 lg:px-8 mt-12 sm:mt-16 lg:mt-32 bg-white py-8 rounded-lg shadow">
            {isLoading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <ProductGrid
                products={featuredProducts}
                title="Eletrônicos em Destaque"
              />
            )}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/produtos">
                  Ver Todos os Produtos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Ofertas */}
        {isLoading ? (
          <div className="py-12 sm:py-16 bg-gradient-to-r from-slate-50 to-emerald-50">
            <div className="container mx-auto px-2 sm:px-4 lg:px-8">
              <ProductGridSkeleton count={4} />
            </div>
          </div>
        ) : (
          discountedProducts.length > 0 && (
            <section className="py-12 sm:py-16 bg-gradient-to-r from-slate-50 to-emerald-50">
              <div className="container mx-auto px-2 sm:px-4 lg:px-8">
                <ProductGrid
                  products={discountedProducts}
                  title="Ofertas Especiais"
                />
              </div>
            </section>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}
