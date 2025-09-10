"use client"

import { useEffect } from "react"

import { Footer } from "../../components/layout/footer"
import { CartSidebar } from "../../components/cart/cart-sidebar"
import { ProductGrid } from "../../components/products/product-grid"
import { Badge } from "../../components/ui/badge"
import { useAppDispatch, useAppSelector } from "../../lib/hooks"
import { setProducts } from "../../lib/features/products/productsSlice"
import { mockProducts } from "../../lib/data/products"
import { Percent, Clock, File as Fire } from "lucide-react"
import Header from "@/src/components/layout/header"

export default function OffersPage() {
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.products.items)

  useEffect(() => {
    dispatch(setProducts(mockProducts))
  }, [dispatch])

  const discountedProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Header />
      <CartSidebar />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Fire className="w-8 h-8" />
              <Badge className="bg-white/20 text-white border-white/30">Ofertas Limitadas</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Ofertas Especiais</h1>
            <p className="text-xl text-red-100 mb-6">Aproveite descontos imperdíveis em produtos selecionados</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                <span>Até 70% OFF</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Por tempo limitado</span>
              </div>
            </div>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {discountedProducts.length > 0 ? (
              <ProductGrid products={discountedProducts} />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Nenhuma oferta disponível no momento</h2>
                <p className="text-slate-600">Volte em breve para conferir nossas próximas promoções!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
