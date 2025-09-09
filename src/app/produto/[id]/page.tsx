// src/app/produto/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { CartSidebar } from "../../../components/cart/cart-sidebar";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";
import { addToCart } from "../../../lib/features/cart/cartSlice";
import { addToFavorites, removeFromFavorites } from "../../../lib/features/favorites/favoritesSlice";
import { ConfirmationModal } from "../../../components/ui/confirmation-modal";
import { ProductGrid } from "../../../components/products/product-grid";
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react";
import Header from "@/src/components/layout/header";

// Importe as funções e tipos da sua API
import {
  getProductById,
  getRelatedProducts,
  ProductDetails,
  RelatedProduct,
} from "@/src/services/cardService";

export default function ProductPage() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"cart" | "favorites">("cart");

  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id.toString() === params.id);

  useEffect(() => {
    const fetchProductData = async () => {
      const productId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (productId) {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct || null);
        if (fetchedProduct) {
          if (fetchedProduct.images && fetchedProduct.images.length > 0) {
            setSelectedImage(0);
          }
        }
      }
    };
    fetchProductData();
  }, [params.id]);

  useEffect(() => {
    const fetchRelatedProductsData = async () => {
      if (product) {
        const related = await getRelatedProducts(product.category);
        const filteredRelated = related.filter((p) => p.id.toString() !== product.id.toString());
        setRelatedProducts(filteredRelated);
      }
    };
    fetchRelatedProductsData();
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CartSidebar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Carregando...</h1>
          <p className="text-muted-foreground">Buscando detalhes do produto.</p>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          // Removendo 'size' e 'color' pois não existem na API
        })
      );
    }
    setModalType("cart");
    setShowModal(true);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id.toString()));
    } else {
      dispatch(
        addToFavorites({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
        })
      );
      setModalType("favorites");
      setShowModal(true);
    }
  };

  const images = product.images || [product.image];

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
                  {product.rating} ({product.reviewsCount} avaliações)
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

              {/* Removendo seções de 'colors' e 'sizes' */}
              {/* O código da API DummyJSON não retorna essas propriedades,
              então a renderização condicional se torna inútil e a lógica
              de estado desnecessária. */}

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
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock > 0 ? "Adicionar ao Carrinho" : "Fora de Estoque"}
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
                  <span>{product.shipment}</span>
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

            {product.specifications && product.specifications.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Especificações</h2>
                  <ul className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="flex gap-2 text-muted-foreground">
                        <span className="font-semibold text-foreground">{spec.key}:</span>
                        <span>{spec.value}</span>
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
  );
}