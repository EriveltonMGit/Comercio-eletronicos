"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { useAppDispatch, useAppSelector } from "../../lib/hooks"
import { useToast } from "../../hooks/use-toast"
import { addToCart } from "../../lib/features/cart/cartSlice"
import { addToFavorites, removeFromFavorites } from "../../lib/features/favorites/favoritesSlice"
import type { Product } from "../../lib/features/products/productsSlice"
import { ConfirmationModal } from "../../components/ui/confirmation-modal"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"cart" | "favorites">("cart")

  const dispatch = useAppDispatch()
  const favorites = useAppSelector((state) => state.favorites.items)
  const { success, error } = useToast()

  const isFavorite = favorites.some((item) => item.id === product.id)
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const handleAddToCart = () => {
    if (!product.inStock) {
      error("Produto indisponível", "Este produto está fora de estoque")
      return
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }),
    )
    success("Produto adicionado!", `${product.name} foi adicionado ao carrinho`)
    setModalType("cart")
    setShowModal(true)
  }

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id))
      success("Removido dos favoritos", `${product.name} foi removido dos favoritos`)
    } else {
      dispatch(
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        }),
      )
      success("Adicionado aos favoritos!", `${product.name} foi salvo nos seus favoritos`)
      setModalType("favorites")
      setShowModal(true)
    }
  }

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-emerald-300">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <Link href={`/produto/${product.id}`}>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {hasDiscount && (
              <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                -{discountPercentage}%
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 bg-white/90 hover:bg-white shadow-md ${
                isFavorite ? "text-red-500 hover:text-red-600" : "text-slate-600 hover:text-red-500"
              }`}
              onClick={handleToggleFavorite}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>

          <div className="p-4">
            <Link href={`/produto/${product.id}`}>
              <h3 className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "text-amber-400 fill-current" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">({product.reviews})</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-emerald-600">R$ {product.price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-sm text-slate-500 line-through">R$ {product.originalPrice!.toFixed(2)}</span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.inStock ? "Adicionar ao Carrinho" : "Fora de Estoque"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        productName={product.name}
      />
    </>
  )
}
