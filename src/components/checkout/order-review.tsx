// src/components/checkout/order-review.tsx

"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { setCurrentStep, setProcessing } from "../../lib/features/checkout/checkoutSlice"
import { ShoppingBag, MapPin, Truck, CreditCard, Loader2, Copy, QrCode, Package } from "lucide-react"
import { notification } from "antd"

// NOVIDADE: Adiciona a prop `onFinishOrder`
export function OrderReview({ onFinishOrder }: { onFinishOrder: () => void }) {
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

    // NOVIDADE: Apenas chama a prop para finalizar o pedido
    const handlePlaceOrder = async () => {
        if (onFinishOrder) {
            onFinishOrder();
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

    const handleCopyPixCode = () => {
        const pixCode = `00020126580014BR.GOV.BCB.PIX013636c4c14c-4b8a-4c4a-8b1a-1234567890125204000053039865802BR5925LOJA EXEMPLO LTDA6009SAO PAULO62070503***6304`
        navigator.clipboard.writeText(pixCode);
        notification.success({
            message: "Código PIX copiado!",
            description: "Cole o código no seu app bancário para efetuar o pagamento.",
            placement: 'topRight',
        });
    };

    const getPaymentInstructions = () => {
        switch (paymentMethod.type) {
            case "pix":
                return (
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <QrCode className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-semibold text-slate-800">Pagamento via PIX</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            Escaneie o QR Code ou copie o código PIX abaixo para efetuar o pagamento:
                        </p>
                        <div className="bg-slate-50 p-3 rounded border border-slate-300 mb-3">
                            <code className="text-xs break-all text-slate-700">
                                00020126580014BR.GOV.BCB.PIX013636c4c14c-4b8a-4c4a-8b1a-1234567890125204000053039865802BR5925LOJA
                                EXEMPLO LTDA6009SAO PAULO62070503***6304
                            </code>
                        </div>
                        <Button onClick={handleCopyPixCode} variant="outline" size="sm" className="w-full bg-white text-emerald-600 border-emerald-400 hover:bg-emerald-50">
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar código PIX
                        </Button>
                        <p className="text-xs text-slate-600 mt-2">⚠️ O pagamento deve ser realizado em até 30 minutos.</p>
                    </div>
                );
            case "boleto":
                return (
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Package className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-semibold text-slate-800">Pagamento via Boleto</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            O boleto foi enviado para seu e-mail e estará disponível para impressão em alguns minutos.
                        </p>
                        <Button variant="outline" size="sm" className="w-full bg-white text-emerald-600 border-emerald-400 hover:bg-emerald-50">
                            <Package className="w-4 h-4 mr-2" />
                            Visualizar Boleto
                        </Button>
                        <p className="text-xs text-slate-600 mt-2">⚠️ Vencimento: 3 dias úteis</p>
                    </div>
                );
            default:
                return (
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-semibold text-slate-800">Pagamento Aprovado</h4>
                        </div>
                        <p className="text-sm text-slate-600">
                            Seu pagamento foi processado com sucesso no cartão terminado em ****{paymentMethod.cardNumber?.slice(-4)}.
                        </p>
                    </div>
                );
        }
    }

    return (
        <div className="space-y-6">
            {/* Order Items */}
            <Card className="rounded-xl shadow-sm border border-slate-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        Itens do Pedido ({items.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-slate-100">
                                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-800 line-clamp-2">{item.name}</h4>
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
                                    <span className="text-sm text-slate-500">Qtd: {item.quantity}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-800">R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="rounded-xl shadow-sm border border-slate-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        Endereço de Entrega
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm space-y-1 text-slate-600">
                        <p className="font-medium text-slate-800">
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
                <Card className="rounded-xl shadow-sm border border-slate-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <Truck className="w-5 h-5 text-emerald-600" />
                            Método de Entrega
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {shippingMethod && (
                            <div className="text-sm space-y-1 text-slate-600">
                                <p className="font-medium text-slate-800">{shippingMethod.name}</p>
                                <p>{shippingMethod.description}</p>
                                <p>{shippingMethod.estimatedDays}</p>
                                <p className="font-semibold mt-2 text-slate-800">
                                    {finalShippingCost === 0 ? "Grátis" : `R$ ${finalShippingCost.toFixed(2)}`}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="rounded-xl shadow-sm border border-slate-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                            Forma de Pagamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm space-y-1 text-slate-600">
                            <p className="font-medium text-slate-800">{getPaymentMethodDisplay()}</p>
                            {(paymentMethod.type === "credit" || paymentMethod.type === "debit") && paymentMethod.cardNumber && (
                                <p>**** **** **** {paymentMethod.cardNumber.slice(-4)}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Order Total */}
            <Card className="rounded-xl shadow-sm border border-slate-100">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium text-slate-800">R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Frete:</span>
                        <span className="font-medium text-slate-800">
                            {finalShippingCost === 0 ? "Grátis" : `R$ ${finalShippingCost.toFixed(2)}`}
                        </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-emerald-600">
                        <span>Total:</span>
                        <span>R$ {finalTotal.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack} disabled={isSubmitting} className="bg-white text-slate-600 border-slate-300 hover:bg-slate-100">
                    Voltar
                </Button>
                <Button onClick={handlePlaceOrder} disabled={isSubmitting} size="lg" className="min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white">
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