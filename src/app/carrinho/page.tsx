"use client"

import { useEffect } from "react"

import { CartItem } from "../../components/cart/cart-item"
import { CartSidebar } from "../../components/cart/cart-sidebar"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { clearCart } from "../../lib/features/cart/cartSlice"
import { setProducts } from "../../lib/features/products/productsSlice"
import { mockProducts } from "../../lib/data/products"
import { ShoppingCart, ArrowLeft, Trash2, CreditCard, Link } from "lucide-react"
import Header from "@/src/components/layout/header"

export default function CartPage() {
  const { items, total } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setProducts(mockProducts))
  }, [dispatch])

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = total > 199 ? 0 : 15.9
  const finalTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <CartSidebar />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8 text-pretty">
              Parece que você ainda não adicionou nenhum item ao seu carrinho. Explore nossos produtos e encontre algo
              especial!
            </p>
            <Button size="lg" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuar Comprando
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Carrinho de Compras</h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "itens"} no seu carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Itens</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCart}
                className="text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Carrinho
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />
              ))}
            </div>

            <div className="pt-4">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continuar Comprando
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})
                    </span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">
                      {shipping === 0 ? <span className="text-green-600">Grátis</span> : `R$ ${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">Frete grátis em compras acima de R$ 199,00</p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">R$ {finalTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-2 ">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Finalizar Compra
                    </Link>
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">Parcelamento em até 12x sem juros</p>
                </div>

                <div className="pt-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>7 dias para trocas e devoluções</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Entrega rápida e confiável</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}