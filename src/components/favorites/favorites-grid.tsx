"use client"

import { ProductCard } from "../../components/products/product-card"
import { useAppSelector } from "../../lib/hooks"
import { mockProducts } from "../../lib/data/products"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "../../components/ui/button"
import Link from "next/link"

export function FavoritesGrid() {
  const favorites = useAppSelector((state) => state.favorites.items)

  // Get full product data for favorites
  const favoriteProducts = mockProducts.filter((product) => favorites.some((fav) => fav.id === product.id))

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sua lista de favoritos está vazia</h2>
          <p className="text-muted-foreground mb-6 text-pretty">
            Explore nossos produtos e adicione seus favoritos para encontrá-los facilmente depois.
          </p>
          <Button asChild>
            <Link href="/">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Descobrir Produtos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Meus Favoritos ({favorites.length})</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
