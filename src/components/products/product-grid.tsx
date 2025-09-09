"use client"

import { ProductCard } from "./product-card"
import type { Product } from "../../lib/features/products/productsSlice"

interface ProductGridProps {
  products: Product[]
  title?: string
}

export function ProductGrid({ products, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold text-foreground text-balance">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
