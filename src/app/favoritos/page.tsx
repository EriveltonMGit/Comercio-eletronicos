"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setProducts } from "../../lib/features/products/productsSlice";
import { CartSidebar } from "../../components/cart/cart-sidebar";
import { FavoritesGrid } from "../../components/favorites/favorites-grid";
import Header from "@/src/components/layout/header";
// Alterado a importação para a função correta:
import { getAllProductsData } from "@/src/services/cardService";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const allProducts = useAppSelector((state) => state.products.items);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      // Alterado para chamar a função correta
      const productsFromApi = await getAllProductsData();
      if (productsFromApi.length > 0) {
        dispatch(setProducts(productsFromApi));
      }
      setIsLoading(false);
    };

    // Verifique se os produtos já estão carregados para evitar buscas desnecessárias
    if (allProducts.length === 0) {
      fetchProducts();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, allProducts.length]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Favoritos</h1>
          <p className="text-muted-foreground">Seus produtos favoritos salvos para comprar depois</p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">Carregando seus favoritos...</h2>
            <p className="text-muted-foreground">Por favor, aguarde.</p>
          </div>
        ) : (
          <FavoritesGrid favorites={favorites} />
        )}
      </main>
    </div>
  );
}