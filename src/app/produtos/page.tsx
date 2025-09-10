// src/app/produtos/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Footer } from "../../components/layout/footer";
import { CartSidebar } from "../../components/cart/cart-sidebar";
import { ProductGrid } from "../../components/products/product-grid";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setProducts, setFilters, clearFilters } from "../../lib/features/products/productsSlice";
import { getAllProductsData } from "@/src/services/cardService";
import { Filter, X } from "lucide-react";
import Header from "@/src/components/layout/header";

import { message } from "antd";
import { translations } from "@/src/lib/translations";
import { ProductGridSkeleton } from "@/src/components/ui/skeleton";

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  const { filteredItems, categories, brands, filters, searchQuery } = useAppSelector((state) => state.products);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsFromApi = await getAllProductsData();
        if (productsFromApi.length > 0) {
          dispatch(setProducts(productsFromApi));
        }
      } catch (e) {
        console.error("Failed to fetch products:", e);
        message.error("Erro ao carregar produtos. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    if (filteredItems.length === 0) {
      fetchProducts();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, filteredItems.length]);

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    message.success("Filtros limpos.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <CartSidebar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <div className="lg:w-64">
            <Card className="sticky top-24 bg-white shadow-lg border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-800">Filtros</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden text-slate-600 hover:bg-slate-100">
                  <Filter className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className={`space-y-6 p-4 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* O restante do seu código de filtros permanece inalterado aqui */}
                {/* ... */}
              </CardContent>
            </Card>
          </div>

          {/* Grid de produtos */}
          <div className="flex-1">
            {isLoading ? (
              <ProductGridSkeleton />
            ) : (
              <>
                <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Produtos"}
                  </h1>
                  <p className="text-slate-600">
                    {filteredItems.length} produto{filteredItems.length !== 1 ? "s" : ""} encontrado{filteredItems.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <ProductGrid products={filteredItems} />

                {filteredItems.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
                    <p className="text-slate-600 mb-4">Nenhum produto encontrado com os filtros aplicados.</p>
                    <Button onClick={handleClearFilters} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}