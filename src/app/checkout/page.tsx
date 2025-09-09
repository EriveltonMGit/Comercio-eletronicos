"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { clearCart } from "../../lib/features/cart/cartSlice"
import { clearCheckout } from "../../lib/features/checkout/checkoutSlice"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { ShippingForm } from "../../components/checkout/shipping-form"
import { ShippingMethod } from "../../components/checkout/shipping-method"
import { PaymentForm } from "../../components/checkout/payment-form"
import { OrderReview } from "../../components/checkout/order-review"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

const steps = [
  { id: 1, title: "Endereço de Entrega", component: "shipping" },
  { id: 2, title: "Método de Entrega", component: "method" },
  { id: 3, title: "Pagamento", component: "payment" },
  { id: 4, title: "Revisão", component: "review" },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const { items, total } = useAppSelector((state) => state.cart)
  const { shippingAddress, paymentMethod, shippingMethod } = useAppSelector((state) => state.checkout)
  const { user } = useAppSelector((state) => state.auth)

  if (items.length === 0) {
    router.push("/")
    return null
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinishOrder = async () => {
    setIsProcessing(true)

    try {
      toast({
        title: "Processando pedido...",
        description: "Aguarde enquanto processamos seu pagamento.",
        type: "info",
      });

      // Simular processamento do pedido
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const orderId = `PED${Date.now()}`

      // Limpar carrinho e checkout
      dispatch(clearCart())
      dispatch(clearCheckout())

      toast({
        title: "Pedido finalizado!",
        description: `Pedido #${orderId} criado com sucesso.`,
        type: "success", // Use 'type' com o valor 'success'
      });

      // Redirecionar para confirmação
      router.push("/pedido-confirmado")
    } catch (error) {
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro. Tente novamente.",
        type: "error", // Use 'type' com o valor 'error'
      });
    } finally {
      setIsProcessing(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          shippingAddress.firstName &&
          shippingAddress.lastName &&
          shippingAddress.email &&
          shippingAddress.address &&
          shippingAddress.city &&
          shippingAddress.zipCode
        )
      case 2:
        return !!shippingMethod
      case 3:
        return (
          paymentMethod.type === "pix" ||
          paymentMethod.type === "boleto" ||
          (paymentMethod.cardNumber && paymentMethod.expiryDate && paymentMethod.cvv && paymentMethod.cardName)
        )
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingForm />
      case 2:
        return <ShippingMethod />
      case 3:
        return <PaymentForm />
      case 4:
        return <OrderReview />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8 ">
          <div className="flex items-center justify-between ">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-gray-300 text-gray-400"
                    }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${currentStep >= step.id ? "text-emerald-600" : "text-gray-400"
                    }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-emerald-600" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">{renderStepContent()}</CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinishOrder}
                  disabled={!canProceed() || isProcessing}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isProcessing ? "Processando..." : "Finalizar Pedido"}
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 sticky top-4">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      // Corrigido: usando as propriedades 'color' e 'size'
                      key={`${item.id}-${item.color}-${item.size}`}
                      className="flex justify-between text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-500">
                          {/* Corrigido: usando as propriedades 'color' e 'size' */}
                          {item.color && `Cor: ${item.color}`}
                          {item.size && ` • Tamanho: ${item.size}`}
                          {` • Qtd: ${item.quantity}`}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  {shippingMethod?.price && shippingMethod.price > 0 && (
                    <div className="flex justify-between">
                      <span>Frete ({shippingMethod.name}):</span>
                      <span>R$ {shippingMethod.price.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg text-emerald-600">
                    <span>Total:</span>
                    <span>R$ {(total + (shippingMethod?.price || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}