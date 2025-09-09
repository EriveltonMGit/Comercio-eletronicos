// src/components/favorites/favorites-grid.tsx

"use client";

import { ProductCard } from "../products/product-card";
import { useAppSelector } from "../../lib/hooks";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { FavoriteItem } from "../../lib/features/favorites/favoritesSlice";

// 1. Defina a interface para as props do componente
interface FavoritesGridProps {
  favorites: FavoriteItem[];
}

// 2. Receba a prop 'favorites' na assinatura da função
export function FavoritesGrid({ favorites }: FavoritesGridProps) {
  // Pega a lista completa de produtos do estado global
  const allProducts = useAppSelector((state) => state.products.items);

  // Filtra a lista completa de produtos para obter os detalhes dos favoritos
  // Nota: a comparação do id foi ajustada para string para consistência
  const favoriteProducts = allProducts.filter((product) =>
    favorites.some((fav) => fav.id === product.id.toString())
  );

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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Meus Favoritos ({favorites.length})</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => (
          // Como 'favoriteProducts' agora contém os dados completos do produto
          // e o ProductCard aceita esses tipos, o erro é resolvido.
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}