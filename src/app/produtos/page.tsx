"use client"

import { useEffect, useState } from "react"
import { Header } from "../../components/layout/header"
import { Footer } from "../../components/layout/footer"
import { CartSidebar } from "../../components/cart/cart-sidebar"
import { ProductGrid } from "../../components/products/product-grid"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Slider } from "../../components/ui/slider"
import { useAppDispatch, useAppSelector } from "../../lib/hooks"
import { useToast } from "../../hooks/use-toast"
import { setProducts, setFilters, clearFilters } from "../../lib/features/products/productsSlice"
import { mockProducts } from "../../lib/data/products"
import { Filter, X } from "lucide-react"

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const dispatch = useAppDispatch()
  const { success } = useToast()

  const { filteredItems, categories, brands, filters, searchQuery } = useAppSelector((state) => state.products)

  useEffect(() => {
    dispatch(setProducts(mockProducts))
  }, [dispatch])

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    success("Filtros limpos", "Todos os filtros foram removidos")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Header />
      <CartSidebar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <Card className="sticky top-24">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Filtros</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Categoria</label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Marca</label>
                  <Select value={filters.brand} onValueChange={(value) => handleFilterChange("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as marcas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as marcas</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Preço: R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]}
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                    max={1000}
                    min={0}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Ordenar por</label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nome</SelectItem>
                      <SelectItem value="price-low">Menor preço</SelectItem>
                      <SelectItem value="price-high">Maior preço</SelectItem>
                      <SelectItem value="rating">Melhor avaliação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleClearFilters} variant="outline" className="w-full bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Produtos"}
              </h1>
              <p className="text-slate-600">
                {filteredItems.length} produto{filteredItems.length !== 1 ? "s" : ""} encontrado
                {filteredItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            <ProductGrid products={filteredItems} />

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">Nenhum produto encontrado com os filtros aplicados.</p>
                <Button onClick={handleClearFilters} variant="outline">
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
