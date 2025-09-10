// src/components/products/product-card.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { addToCart } from "../../lib/features/cart/cartSlice";
import { addToFavorites, removeFromFavorites } from "../../lib/features/favorites/favoritesSlice";
import type { Product } from "../../lib/features/products/productsSlice";
import type { RelatedProduct } from "../../services/cardService";

import { notification } from "antd";
import { ConfirmationModal } from "../ui/confirmation-modal";
import { CheckCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product | RelatedProduct;
}

function hasOriginalPrice(product: Product | RelatedProduct): product is Product {
  return (product as Product).originalPrice !== undefined;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const isFavorite = favorites.some((item) => item.id === product.id.toString());
  const hasDiscount = hasOriginalPrice(product) && product.originalPrice! > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const inStock = "inStock" in product ? product.inStock : true;
  const reviewsCount = "reviewsCount" in product ? product.reviewsCount : 0;
  const brand = "brand" in product ? product.brand : "";
  const rating = "rating" in product ? product.rating : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    if (!inStock) {
      console.log("➡️ Chamando notification.error: fora de estoque");
      notification.error({
        message: 'Produto Indisponível',
        description: 'Este produto está fora de estoque no momento.',
      });
      return;
    }

    dispatch(
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
      })
    );

    console.log("✅ Abrindo modal de confirmação e exibindo notificação");

    // Exibe a notificação de sucesso grande, com o ícone de 'check'
    notification.success({
      message: 'Adicionado ao Carrinho!',
      description: `${product.name} foi adicionado ao seu carrinho.`,
      placement: 'topRight',
      icon: <CheckCircle className="text-emerald-500" />,
      style: {
        width: 350,
        top: 24,
      }
    });

    // Abre o modal
    setIsModalOpen(true);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id.toString()));
      console.log("❌ Chamando notification.success: produto removido dos favoritos");
      notification.success({
        message: 'Removido dos Favoritos',
        description: `${product.name} foi removido dos seus favoritos.`,
        placement: 'topRight'
      });
    } else {
      dispatch(
        addToFavorites({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
        })
      );
      console.log("💖 Chamando notification.success: produto salvo nos favoritos");
      notification.success({
        message: 'Salvo nos Favoritos!',
        description: `${product.name} foi salvo nos seus favoritos!`,
        placement: 'topRight'
      });
    }
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-emerald-300 h-[400px]">
        <CardContent className="p-0 flex flex-col justify-between h-full">
          <div className="relative overflow-hidden rounded-t-lg">
            <Link href={`/produto/${product.id}`}>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
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
              className={`absolute top-2 right-2 bg-white/90 hover:bg-white shadow-md ${isFavorite
                  ? "text-red-500 hover:text-red-600"
                  : "text-slate-600 hover:text-red-500"
                }`}
              onClick={handleToggleFavorite}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>

          <div className="p-4 flex flex-col justify-start flex-grow">
            <Link href={`/produto/${product.id}`}>
              <h3 className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-muted-foreground truncate ">{brand}</p>

            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-400 fill-current" : "text-slate-300"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">({reviewsCount})</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-emerald-600">
                R$ {product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-slate-500 line-through">
                  R$ {product.originalPrice!.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="p-4 pt-0">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              disabled={!inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {inStock ? "Adicionar ao Carrinho" : "Fora de Estoque"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="cart"
        productName={product.name}
      />
    </>
  );
}