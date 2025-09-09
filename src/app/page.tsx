"use client"

import { useEffect } from "react"

import { Footer } from "../components/layout/footer"
import { CartSidebar } from "../components/cart/cart-sidebar"
import { ProductGrid } from "../components/products/product-grid"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { setProducts } from "../lib/features/products/productsSlice"
import { mockProducts } from "../lib/data/products"
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from "lucide-react"
import Link from "next/link"

import { imagens } from "../types/imagens"
import CarrosselMercadoLivre from "../components/imageCarousel/carousel"
import Header from "../components/layout/header"






export default function HomePage() {
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.products.items)

  useEffect(() => {
    dispatch(setProducts(mockProducts))
  }, [dispatch])

  const featuredProducts = products.slice(0, 4)
  const discountedProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price)

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Header />
      <CarrosselMercadoLivre imagens={imagens}></CarrosselMercadoLivre>

      <CartSidebar />

      <main>
        {/* Hero Section */}
        {/* <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">Ofertas Especiais</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Encontre os Melhores Produtos</h1>
              <p className="text-xl text-emerald-100 mb-8 text-pretty">
                Descubra nossa seleção premium de eletrônicos, roupas e acessórios com os melhores preços do mercado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-white text-emerald-600 hover:bg-slate-100">
                  <Link href="/produtos">
                    Ver Todos os Produtos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/ofertas">Ver Ofertas</Link>
                </Button>
              </div>
            </div>
          </div>
        </section> */}

        {/* Features Section */}
        {/* <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Frete Grátis</h3>
                <p className="text-slate-600 text-sm">Em compras acima de R$ 199</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Compra Segura</h3>
                <p className="text-slate-600 text-sm">Seus dados protegidos</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Parcelamento</h3>
                <p className="text-slate-600 text-sm">Em até 12x sem juros</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Suporte 24h</h3>
                <p className="text-slate-600 text-sm">Atendimento especializado</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ProductGrid products={featuredProducts} title="Produtos em Destaque" />
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

        {/* Discounted Products */}
        {discountedProducts.length > 0 && (
          <section className="py-16 bg-gradient-to-r from-slate-50 to-emerald-50">
            <div className="container mx-auto px-4">
              <ProductGrid products={discountedProducts} title="Ofertas Especiais" />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
