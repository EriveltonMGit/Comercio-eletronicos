// src/components/skeletons/product-card-skeleton.tsx
import { Card, CardContent } from "../ui/card";

// Componente para o esqueleto de um único card de produto
export function ProductCardSkeleton() {
  return (
    <Card className="animate-pulse">
      {/* Esqueleto para a imagem do produto */}
      <div className="relative aspect-square w-full rounded-t-lg bg-gray-200" />
      <CardContent className="p-4 space-y-3">
        {/* Esqueleto para o nome do produto */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        {/* Esqueleto para o preço do produto */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        {/* Esqueleto para o botão de adicionar ao carrinho */}
        <div className="h-10 bg-gray-200 rounded w-full" />
      </CardContent>
    </Card>
  );
}

// Componente para a grade de esqueletos (usa o componente acima)
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}