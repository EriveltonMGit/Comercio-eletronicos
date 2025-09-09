"use client"

import { useEffect } from "react"
import { Header } from "../../components/layout/header"
import { FavoritesGrid } from "../../components/favorites/favorites-grid"
import { CartSidebar } from "../../components/cart/cart-sidebar"
import { useAppDispatch } from "../../lib/hooks"
import { setProducts } from "../../lib/features/products/productsSlice"
import { mockProducts } from "../../lib/data/products"

export default function FavoritesPage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setProducts(mockProducts))
  }, [dispatch])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Favoritos</h1>
          <p className="text-muted-foreground">Seus produtos favoritos salvos para comprar depois</p>
        </div>

        <FavoritesGrid />
      </main>
    </div>
  )
}
