"use client"

import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useAppDispatch } from "../../lib/hooks"
import { removeFromCart, updateQuantity } from "../../lib/features/cart/cartSlice"
import type { CartItem as CartItemType } from "../../lib/features/cart/cartSlice"
import { Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch()

  const handleRemove = () => {
    // FIX: Pass the complete object for item identification
    dispatch(removeFromCart({ id: item.id, size: item.size, color: item.color }))
  }

  const handleUpdateQuantity = (newQuantity: number) => {
    // FIX: Pass the complete object for item identification
    dispatch(updateQuantity({ id: item.id, size: item.size, color: item.color, quantity: newQuantity }))
  }

  const subtotal = item.price * item.quantity

  return (
    <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-card-foreground line-clamp-2 mb-1">{item.name}</h3>

        <div className="flex items-center gap-2 mb-2">
          {item.size && (
            <Badge variant="secondary" className="text-xs">
              Tamanho: {item.size}
            </Badge>
          )}
          {item.color && (
            <Badge variant="secondary" className="text-xs">
              Cor: {item.color}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-primary">R$ {item.price.toFixed(2)}</span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>

              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-card-foreground">R$ {subtotal.toFixed(2)}</span>

            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={handleRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}