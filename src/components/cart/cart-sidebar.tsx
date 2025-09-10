// src/components/cart/cart-sidebar.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { toggleCart, removeFromCart, updateQuantity } from "../../lib/features/cart/cartSlice"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import type { CartItem as CartItemType } from "../../lib/features/cart/cartSlice"

// Importe o message do Ant Design diretamente
import { message } from "antd"

export function CartSidebar() {
  const { items, total, isOpen } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()
  
 
  const handleClose = () => {
    dispatch(toggleCart())
  }

  const handleRemoveItem = (item: CartItemType) => {
    dispatch(removeFromCart({ id: item.id, size: item.size, color: item.color }))
    // Adicionando a notificação de erro usando message.error
    message.error(`"${item.name}" foi removido do seu carrinho.`);
  }

  const handleUpdateQuantity = (item: CartItemType, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(item);
      return;
    }
    dispatch(updateQuantity({ id: item.id, size: item.size, color: item.color, quantity: newQuantity }))
    // Adicionando a notificação de sucesso usando message.success
    message.success(`A quantidade de "${item.name}" foi alterada para ${newQuantity}.`);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/80 z-50 transition-opacity " onClick={handleClose} />}

      {/* Sidebar */}
      <div
        className={`fixed bg-[#f3f4f6] top-0 right-0 h-full w-full max-w-md bg-sidebar border-l border-sidebar-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-[#f3f4f6]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sidebar-foreground" />
              <h2 className="text-lg font-semibold text-sidebar-foreground">Carrinho ({itemCount})</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-[#f3f4f6]">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-sidebar-foreground mb-2">Seu carrinho está vazio</h3>
                <p className="text-sidebar-foreground/70 mb-4">Adicione alguns produtos para começar suas compras</p>
                <Button onClick={handleClose} asChild>
                  <Link href="/">Continuar Comprando</Link>
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-3 p-3 bg-sidebar-primary rounded-lg"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sidebar-primary-foreground text-sm line-clamp-2">{item.name}</h4>

                      <div className="flex items-center gap-2 mt-1">
                        {item.size && (
                          <Badge variant="secondary" className="text-xs">
                            {item.size}
                          </Badge>
                        )}
                        {item.color && (
                          <Badge variant="secondary" className="text-xs">
                            {item.color}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-sidebar-primary-foreground">
                          R$ {item.price.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="text-sm font-medium w-8 text-center text-sidebar-primary-foreground">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-sidebar-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-sidebar-foreground">Total:</span>
                <span className="text-xl font-bold text-sidebar-accent">R$ {total.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-accent-foreground"
                  asChild
                >
                  <Link href="/checkout" onClick={handleClose}>
                    Finalizar Compra
                  </Link>
                </Button>

                <Button variant="outline" className="w-full bg-transparent" onClick={handleClose} asChild>
                  <Link href="/">Continuar Comprando</Link>
                </Button>
              </div>

              <p className="text-xs text-sidebar-foreground/70 text-center">Frete e impostos calculados no checkout</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}