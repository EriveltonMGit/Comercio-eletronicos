"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { CheckCircle, Package, Truck, Home } from "lucide-react"

export default function OrderConfirmationPage() {
  const router = useRouter()

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16" />
            </div>
            <CardTitle className="text-2xl font-bold">Pedido Confirmado!</CardTitle>
            <p className="text-emerald-100 mt-2">Seu pedido foi processado com sucesso</p>
          </CardHeader>

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Obrigado pela sua compra!</h2>
              <p className="text-gray-600">
                Você receberá um e-mail de confirmação em breve com os detalhes do seu pedido.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
                <Package className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">Pedido Processado</p>
                  <p className="text-sm text-gray-600">Seu pedido está sendo preparado</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Envio em Breve</p>
                  <p className="text-sm text-gray-600">Você receberá o código de rastreamento</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => router.push("/")} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Home className="w-4 h-4 mr-2" />
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
