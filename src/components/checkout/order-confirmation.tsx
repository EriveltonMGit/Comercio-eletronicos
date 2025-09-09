"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { resetCheckout } from "../../lib/features/checkout/checkoutSlice"
import { useToast } from "../../hooks/use-toast"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { CheckCircle, Package, CreditCard, Truck, Copy, QrCode } from "lucide-react"

export function OrderConfirmation() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const { orderId, shippingAddress, paymentMethod, shippingMethod, orderTotal } = useAppSelector(
    (state) => state.checkout,
  )

  useEffect(() => {
    toast({
      title: "Pedido confirmado!",
      description: `Seu pedido #${orderId} foi processado com sucesso.`,
      variant: "default",
    })
  }, [orderId, toast])

  const handleContinueShopping = () => {
    dispatch(resetCheckout())
    router.push("/")
  }

  const handleCopyPixCode = () => {
    const pixCode = `00020126580014BR.GOV.BCB.PIX013636c4c14c-4b8a-4c4a-8b1a-1234567890125204000053039865802BR5925LOJA EXEMPLO LTDA6009SAO PAULO62070503***6304`
    navigator.clipboard.writeText(pixCode)
    toast({
      title: "Código PIX copiado!",
      description: "Cole o código no seu app bancário para efetuar o pagamento.",
      variant: "default",
    })
  }

  const getPaymentInstructions = () => {
    switch (paymentMethod.type) {
      case "pix":
        return (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Pagamento via PIX</h4>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Escaneie o QR Code ou copie o código PIX abaixo para efetuar o pagamento:
            </p>
            <div className="bg-white p-3 rounded border border-blue-300 mb-3">
              <code className="text-xs break-all text-gray-700">
                00020126580014BR.GOV.BCB.PIX013636c4c14c-4b8a-4c4a-8b1a-1234567890125204000053039865802BR5925LOJA
                EXEMPLO LTDA6009SAO PAULO62070503***6304
              </code>
            </div>
            <Button onClick={handleCopyPixCode} variant="outline" size="sm" className="w-full bg-transparent">
              <Copy className="w-4 h-4 mr-2" />
              Copiar código PIX
            </Button>
            <p className="text-xs text-blue-700 mt-2">⚠️ O pagamento deve ser realizado em até 30 minutos.</p>
          </div>
        )

      case "boleto":
        return (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-orange-900">Pagamento via Boleto</h4>
            </div>
            <p className="text-sm text-orange-800 mb-3">
              O boleto foi enviado para seu e-mail e estará disponível para impressão em alguns minutos.
            </p>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Package className="w-4 h-4 mr-2" />
              Visualizar Boleto
            </Button>
            <p className="text-xs text-orange-700 mt-2">⚠️ Vencimento: 3 dias úteis</p>
          </div>
        )

      default:
        return (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Pagamento Aprovado</h4>
            </div>
            <p className="text-sm text-green-800">
              Seu pagamento foi processado com sucesso no cartão terminado em ****{paymentMethod.cardNumber?.slice(-4)}.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-2">Pedido Confirmado!</CardTitle>
            <p className="text-emerald-100">Obrigado pela sua compra. Seu pedido foi processado com sucesso.</p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Order Details */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pedido #{orderId}</h3>
              <p className="text-gray-600">Você receberá um e-mail de confirmação em breve.</p>
            </div>

            <Separator />

            {/* Payment Instructions */}
            {getPaymentInstructions()}

            <Separator />

            {/* Shipping Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Informações de Entrega</h4>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p className="text-gray-700">{shippingAddress.address}</p>
                <p className="text-gray-700">
                  {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}
                </p>
                <p className="text-gray-700">{shippingAddress.phone}</p>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Método de entrega:</strong> {shippingMethod.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Prazo:</strong> {shippingMethod.deliveryTime}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Total */}
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total do Pedido:</span>
                <span className="text-2xl font-bold text-emerald-600">R$ {orderTotal?.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={handleContinueShopping} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Continuar Comprando
              </Button>
              <Button variant="outline" onClick={() => router.push("/perfil")} className="flex-1">
                Ver Meus Pedidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
