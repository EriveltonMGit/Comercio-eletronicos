"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Header } from "../../../components/layout/header"
import { CartSidebar } from "../../../components/cart/cart-sidebar"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Card, CardContent } from "../../../components/ui/card"
import { Separator } from "../../../components/ui/separator"
import { useAppDispatch, useAppSelector } from "../../../lib/hooks"
import { addToCart } from "../../../lib/features/cart/cartSlice"
import { addToFavorites, removeFromFavorites } from "../../../lib/features/favorites/favoritesSlice"
import { setProducts } from "../../../lib/features/products/productsSlice"
import { mockProducts } from "../../../lib/data/products"
import { ConfirmationModal } from "../../../components/ui/confirmation-modal"
import { ProductGrid } from "../../../components/products/product-grid"
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react"

export default function ProductPage() {
  const params = useParams()
  const dispatch = useAppDispatch()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"cart" | "favorites">("cart")

  const products = useAppSelector((state) => state.products.items)
  const favorites = useAppSelector((state) => state.favorites.items)

  const product = products.find((p) => p.id === params.id)
  const isFavorite = favorites.some((item) => item.id === params.id)

  useEffect(() => {
    if (products.length === 0) {
      dispatch(setProducts(mockProducts))
    }
  }, [dispatch, products.length])

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0])
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0])
      }
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CartSidebar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produto não encontrado</h1>
          <p className="text-muted-foreground">O produto que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.price) * 100)
    : 0

  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: selectedSize,
          color: selectedColor,
        }),
      )
    }
    setModalType("cart")
    setShowModal(true)
  }

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id))
    } else {
      dispatch(
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        }),
      )
      setModalType("favorites")
      setShowModal(true)
    }
  }

  const images = product.images || [product.image]

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        <CartSidebar />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? "border-primary" : "border-border"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold text-foreground text-balance">{product.name}</h1>
                <p className="text-muted-foreground mt-2">{product.brand}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">R$ {product.price.toFixed(2)}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        R$ {product.originalPrice!.toFixed(2)}
                      </span>
                      <Badge className="bg-destructive text-destructive-foreground">-{discountPercentage}%</Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  ou 12x de R$ {(product.price / 12).toFixed(2)} sem juros
                </p>
              </div>

              {/* Options */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Cor:</h3>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Tamanho:</h3>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Quantidade:</h3>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? "Adicionar ao Carrinho" : "Fora de Estoque"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                  className={isFavorite ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Frete grátis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Compra segura</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RotateCcw className="w-4 h-4 text-primary" />
                  <span>7 dias para trocar</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Descrição</h2>
                <p className="text-muted-foreground text-pretty leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            {product.features && product.features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Características</h2>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <ProductGrid products={relatedProducts} title="Produtos Relacionados" />
            </section>
          )}
        </main>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        productName={product.name}
      />
    </>
  )
}
