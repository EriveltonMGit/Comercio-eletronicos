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
import { ProductGrid } from "../../../components/products/product-grid";
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react";
import Header from "@/src/components/layout/header";
import { Breadcrumbs } from "@/src/components/layout/breadcrumbs";

import {
  getProductById,
  getRelatedProducts,
  ProductDetails,
  RelatedProduct,
} from "@/src/services/cardService";

import { translations } from "@/src/lib/translations";
import { message } from "antd";
import { ProductPageSkeleton } from "@/src/components/skeletons/product-page-skeleton";

export default function ProductPage() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id.toString() === params.id);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
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

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <CartSidebar />
        <ProductPageSkeleton />
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      message.error("Este produto está fora de estoque.");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
        })
      );
    }
    message.success(`${translations[product.name] || product.name} foi adicionado ao carrinho!`);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id.toString()));
      message.success(`${translations[product.name] || product.name} foi removido dos seus favoritos.`);
    } else {
      dispatch(
        addToFavorites({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
        })
      );
      message.success(`${translations[product.name] || product.name} foi salvo nos seus favoritos!`);
    }
  };

  const images = product.images || [product.image];

  // Construção dinâmica dos itens do breadcrumb
  const breadcrumbItems = [
    { label: "Produtos", href: "/produtos" },
    { label: translations[product.category] || product.category, href: `/produtos?category=${product.category}` },
    { label: translations[product.name] || product.name },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <CartSidebar />

        <main className="container mx-auto px-4 py-8 lg:py-16">
          {/* Adicione o Breadcrumbs aqui, acima do container principal do produto */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr] gap-8 lg:gap-12 bg-white p-6 rounded-lg shadow-md border border-slate-200">
            {/* Product Images */}
            <div className="lg:order-1 flex flex-col items-center">
              <div className="w-full max-w-lg aspect-square overflow-hidden rounded-lg bg-muted border border-slate-200">
                <Image
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-contain"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto mt-4 w-full justify-center">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === index ? "border-blue-500" : "border-transparent hover:border-blue-300"}`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 lg:order-2">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {translations[product.category] || product.category}
                </Badge>
                <h1 className="text-3xl font-bold text-slate-900 text-balance">{translations[product.name] || product.name}</h1>
                <p className="text-slate-600 mt-2 text-lg">{translations[product.brand] || product.brand}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-slate-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  {product.rating} ({product.reviewsCount} avaliações)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-slate-900">R$ {product.price.toFixed(2)}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-slate-500 line-through">
                        R$ {product.originalPrice!.toFixed(2)}
                      </span>
                      <Badge className="bg-red-500 text-white font-semibold">-{discountPercentage}%</Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  em 12x de R$ {(product.price / 12).toFixed(2)} sem juros
                </p>
              </div>
              <Separator />

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Quantidade:</h3>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center text-slate-900">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions - Botões lado a lado */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-lg py-6"
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock > 0 ? "Adicionar ao Carrinho" : "Fora de Estoque"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={`flex-1 text-blue-600 border-blue-600 font-bold text-lg py-6 ${isFavorite ? "bg-blue-100 hover:bg-blue-200" : "bg-white hover:bg-blue-50"}`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFavorite ? "fill-blue-600" : ""}`} />
                  {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                </Button>
              </div>

              {/* Features */}
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <span>{typeof product.shipment === 'string' ? translations[product.shipment] || product.shipment : "Frete grátis"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Compra segura</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <RotateCcw className="w-4 h-4 text-emerald-500" />
                  <span>7 dias para trocar</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="shadow-md border-slate-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Descrição</h2>
                <p className="text-slate-600 text-pretty leading-relaxed">
                  {translations[product.description] || product.description}
                </p>
              </CardContent>
            </Card>

            {product.specifications && product.specifications.length > 0 && (
              <Card className="shadow-md border-slate-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Especificações</h2>
                  <ul className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="flex gap-2 text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {translations[spec.key] || spec.key}:
                        </span>
                        <span>{translations[spec.value] || spec.value}</span>
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
    </>
  );
}