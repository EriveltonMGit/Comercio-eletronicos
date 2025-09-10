// src/components/checkout/shipping-method.tsx
"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Label } from "../../components/ui/label"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { setShippingMethod, setCurrentStep } from "../../lib/features/checkout/checkoutSlice"
import type { ShippingMethod as ShippingMethodType } from "../../lib/features/checkout/checkoutSlice"
import { Truck, Clock, Zap, ArrowLeft, ArrowRight } from "lucide-react"

const shippingMethods: ShippingMethodType[] = [
  {
    id: "standard",
    name: "Entrega Padrão",
    description: "Entrega em dias úteis",
    price: 15.9,
    estimatedDays: "5-7 dias úteis",
  },
  {
    id: "express",
    name: "Entrega Expressa",
    description: "Entrega mais rápida",
    price: 25.9,
    estimatedDays: "2-3 dias úteis",
  },
  {
    id: "same-day",
    name: "Entrega no Mesmo Dia",
    description: "Disponível para algumas regiões",
    price: 35.9,
    estimatedDays: "Hoje até 18h",
  },
]

export function ShippingMethodSelector() {
  const dispatch = useAppDispatch()
  const { shippingMethod } = useAppSelector((state) => state.checkout)
  const cartTotal = useAppSelector((state) => state.cart.total)

  const handleMethodChange = (methodId: string) => {
    const method = shippingMethods.find((m) => m.id === methodId)
    if (method) {
      dispatch(setShippingMethod(method))
    }
  }

  const handleContinue = () => {
    if (shippingMethod) {
      dispatch(setCurrentStep(3))
    }
  }

  const handleBack = () => {
    dispatch(setCurrentStep(1))
  }

  const getIcon = (methodId: string) => {
    switch (methodId) {
      case "standard":
        return <Truck className="w-5 h-5 text-emerald-600" />
      case "express":
        return <Clock className="w-5 h-5 text-emerald-600" />
      case "same-day":
        return <Zap className="w-5 h-5 text-emerald-600" />
      default:
        return <Truck className="w-5 h-5 text-emerald-600" />
    }
  }

  const freeShippingEligible = cartTotal >= 199

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <Truck className="w-5 h-5 text-emerald-600" />
          Método de Entrega
        </CardTitle>
        {freeShippingEligible && (
          <p className="text-sm text-emerald-600 font-medium">
            🎉 Você ganhou frete grátis! Escolha a entrega padrão sem custo adicional.
          </p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <RadioGroup value={shippingMethod?.id || ""} onValueChange={handleMethodChange} className="space-y-3">
          {shippingMethods.map((method) => {
            const isFree = freeShippingEligible && method.id === "standard"
            const displayPrice = isFree ? 0 : method.price

            return (
              <div
                key={method.id}
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors cursor-pointer ${shippingMethod?.id === method.id ? "bg-emerald-50 border-emerald-400" : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      {getIcon(method.id)}
                      <div>
                        <div className="font-semibold text-slate-800">
                          {method.name}
                          {isFree && <span className="ml-2 text-emerald-600 text-sm">(Grátis)</span>}
                        </div>
                        <div className="text-sm text-slate-500">{method.description}</div>
                        <div className="text-sm text-slate-500">{method.estimatedDays}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-800">
                        {isFree ? "Grátis" : `R$ ${displayPrice.toFixed(2)}`}
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            )
          })}
        </RadioGroup>
        <div className="flex justify-between pt-6">
          <Button variant="ghost" onClick={handleBack} className="text-slate-600 hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleContinue} disabled={!shippingMethod} className="bg-emerald-600 hover:bg-emerald-700">
            Continuar para Pagamento
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </div>
  )
}

export const ShippingMethod = ShippingMethodSelector