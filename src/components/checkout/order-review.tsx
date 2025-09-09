"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { setCurrentStep, setProcessing, setOrderId } from "../../lib/features/checkout/checkoutSlice"
import { clearCart } from "../../lib/features/cart/cartSlice"
import { ShoppingBag, MapPin, Truck, CreditCard, Loader2 } from "lucide-react"

export function OrderReview() {
  const dispatch = useAppDispatch()
  const { shippingAddress, paymentMethod, shippingMethod, isProcessing } = useAppSelector((state) => state.checkout)
  const { items, total } = useAppSelector((state) => state.cart)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const shippingCost = shippingMethod?.price || 0
  const freeShippingEligible = total >= 199
  const finalShippingCost = freeShippingEligible && shippingMethod?.id === "standard" ? 0 : shippingCost
  const finalTotal = total + finalShippingCost

  const handleBack = () => {
    dispatch(setCurrentStep(3))
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    dispatch(setProcessing(true))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate order ID
      const orderId = `ORD-${Date.now()}`
      dispatch(setOrderId(orderId))

      // Clear cart
      dispatch(clearCart())

      // Go to confirmation
      dispatch(setCurrentStep(5))
    } catch (error) {
      console.error("Error placing order:", error)
    } finally {
      setIsSubmitting(false)
      dispatch(setProcessing(false))
    }
  }

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod.type) {
      case "credit":
        return `Cartão de Crédito ${
          paymentMethod.installments && paymentMethod.installments > 1
            ? `(${paymentMethod.installments}x)`
            : "(à vista)"
        }`
      case "debit":
        return "Cartão de Débito"
      case "pix":
        return "PIX"
      case "boleto":
        return "Boleto Bancário"
      default:
        return "Não selecionado"
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Itens do Pedido ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground line-clamp-2">{item.name}</h4>
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
                  <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold text-primary">R$ {item.price.toFixed(2)}</span>
                  <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Endereço de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <p className="font-medium">
              {shippingAddress.firstName} {shippingAddress.lastName}
            </p>
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}
            </p>
            <p>{shippingAddress.phone}</p>
            <p>{shippingAddress.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Método de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shippingMethod && (
              <div>
                <p className="font-medium">{shippingMethod.name}</p>
                <p className="text-sm text-muted-foreground">{shippingMethod.description}</p>
                <p className="text-sm text-muted-foreground">{shippingMethod.estimatedDays}</p>
                <p className="font-semibold mt-2">
                  {finalShippingCost === 0 ? "Grátis" : `R$ ${finalShippingCost.toFixed(2)}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Forma de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="font-medium">{getPaymentMethodDisplay()}</p>
              {(paymentMethod.type === "credit" || paymentMethod.type === "debit") && paymentMethod.cardNumber && (
                <p className="text-sm text-muted-foreground">**** **** **** {paymentMethod.cardNumber.slice(-4)}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Frete</span>
            <span>{finalShippingCost === 0 ? "Grátis" : `R$ ${finalShippingCost.toFixed(2)}`}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">R$ {finalTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
          Voltar
        </Button>
        <Button onClick={handlePlaceOrder} disabled={isSubmitting} size="lg" className="min-w-[200px]">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            "Finalizar Pedido"
          )}
        </Button>
      </div>
    </div>
  )
}
