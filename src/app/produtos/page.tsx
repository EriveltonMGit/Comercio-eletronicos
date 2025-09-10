// src/app/produtos/page.tsx
"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Footer } from "../../components/layout/footer";
import { CartSidebar } from "../../components/cart/cart-sidebar";
import { ProductGrid } from "../../components/products/product-grid";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setProducts, setFilters, clearFilters } from "../../lib/features/products/productsSlice";
import { getAllProductsData, ProductDetails } from "@/src/services/cardService";
import { Filter, X } from "lucide-react";
import Header from "@/src/components/layout/header";
import { message } from "antd";
import { translations } from "@/src/lib/translations";
import { ProductGridSkeleton } from "@/src/components/ui/skeleton";
import { Breadcrumbs } from "@/src/components/layout/breadcrumbs";
import Image from "next/image"; // Importar o componente Image

interface ProductsByCategory {
  [key: string]: ProductDetails[];
}

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { filteredItems, categories, brands, filters, searchQuery } = useAppSelector((state) => state.products);
  const allProducts = useAppSelector((state) => state.products.items);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        if (allProducts.length === 0) {
          const allProds = await getAllProductsData();
          dispatch(setProducts(allProds));
        }

        const categoryFromUrl = searchParams.get("category");
        dispatch(setFilters({ category: categoryFromUrl || "" }));
      } catch (e) {
        console.error("Failed to fetch products:", e);
        message.error("Erro ao carregar produtos. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [searchParams, dispatch, allProducts.length]);

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    message.success("Filtros limpos.");
  };

  const groupedProducts = useMemo(() => {
    if (filteredItems.length === 0) return {};

    return filteredItems.reduce<ProductsByCategory>((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product as ProductDetails);
      return acc;
    }, {});
  }, [filteredItems]);

  const breadcrumbItems = [
    { label: "Produtos", href: "/produtos" }
  ];
  if (filters.category) {
    breadcrumbItems.push({
      label: translations[filters.category] || filters.category,
      href: `/produtos?category=${filters.category}`
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <CartSidebar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64">
            <Card className="sticky top-24 bg-white shadow-lg border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-800">Filtros</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-slate-600 hover:bg-slate-100"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className={`space-y-6 p-4 transition-all duration-300 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Categorias */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-700">Categorias</h3>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(value) => handleFilterChange("category", value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="w-full h-8"> {/* Ajustado para h-8 */}
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">Todas as Categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {translations[category] || category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Marcas */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-700">Marcas</h3>
                  <Select
                    value={filters.brand || "all"}
                    onValueChange={(value) => handleFilterChange("brand", value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="w-full h-8"> {/* Ajustado para h-8 */}
                      <SelectValue placeholder="Selecione uma marca" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">Todas as Marcas</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {translations[brand] || brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Preço */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-700">Preço</h3>
                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <span>R$ {filters.priceRange[0]}</span>
                    <span>R$ {filters.priceRange[1]}</span>
                  </div>
                  <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                    className="w-full"
                  />
                </div>
                {/* Limpar Filtros */}
                <div className="pt-4">
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    size="sm" // Ajustado para 'sm'
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-3 h-3 mr-1" /> {/* Ícone menor */}
                    Limpar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1">
            {isLoading ? (
              <ProductGridSkeleton />
            ) : (
              Object.keys(groupedProducts).length > 0 ? (
                <>
                  <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-2"> {/* `gap-2` para diminuir o espaço */}
                      <h1 className="text-2xl font-bold text-slate-900">
                        {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Produtos"}
                      </h1>
                      <img src="/icons/pedidos.gif" alt="Ícone de Documentos" width={28} height={28} className="w-7 h-7" /> {/* Reduzido o tamanho */}
                    </div>
                    <p className="text-slate-600">
                      {filteredItems.length} produto{filteredItems.length !== 1 ? "s" : ""} encontrado{filteredItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {Object.entries(groupedProducts).map(([category, products]) => (
                    <section key={category} className="mb-12">
                      <Card className="shadow-lg border-slate-200">
                        <CardHeader>
                          <h2 className="text-3xl font-bold text-slate-900 capitalize">
                            {translations[category] || category}
                          </h2>
                          <p className="text-slate-600 mt-1">
                            {products.length} produto{products.length !== 1 ? "s" : ""}
                          </p>
                        </CardHeader>
                        <CardContent className="p-4">
                          <ProductGrid products={products} />
                        </CardContent>
                      </Card>
                    </section>
                  ))}
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
                  <p className="text-slate-600 mb-4">Nenhum produto encontrado com os filtros aplicados.</p>
                  <Button onClick={handleClearFilters} variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                    Limpar Filtros
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}