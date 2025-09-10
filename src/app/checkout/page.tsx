"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { message } from "antd";

import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { clearCart } from "../../lib/features/cart/cartSlice";
import { clearCheckout } from "../../lib/features/checkout/checkoutSlice";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

// CORREÇÃO: Importar o nome correto do componente
import { ShippingForm } from "../../components/checkout/shipping-form";
import { ShippingMethodSelector } from "../../components/checkout/shipping-method";
import { PaymentForm } from "../../components/checkout/payment-form";
import { OrderReview } from "../../components/checkout/order-review";

const steps = [
  { id: 1, title: "Endereço de Entrega", component: "shipping" },
  { id: 2, title: "Método de Entrega", component: "method" },
  { id: 3, title: "Pagamento", component: "payment" },
  { id: 4, title: "Revisão", component: "review" },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { items, total } = useAppSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, shippingMethod } = useAppSelector((state) => state.checkout);
  const { user } = useAppSelector((state) => state.auth);

  if (items.length === 0) {
    router.push("/");
    return null;
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // NOVIDADE: Lógica para salvar o pedido no Local Storage
  const handleFinishOrder = async () => {
    setIsProcessing(true);
    message.loading({ content: "Processando pedido...", key: "processing" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const orderId = `ORD-${Date.now()}`;
      const orderDate = new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Calcule o total final com o frete
      const finalTotal = total + (shippingMethod?.price || 0);

      // Crie o objeto do pedido completo
      const newOrder = {
        id: orderId,
        date: orderDate,
        total: finalTotal,
        status: "processando",
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        shippingInfo: shippingAddress,
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
      };

      // Salve no Local Storage
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([newOrder, ...savedOrders]));

      dispatch(clearCart());
      dispatch(clearCheckout());

      message.success({ content: `Pedido #${orderId} criado com sucesso.`, key: "processing", duration: 3 });
      router.push("/pedidos"); // Redireciona para a página de pedidos
    } catch (error) {
      message.error({ content: "Ocorreu um erro. Tente novamente.", key: "processing", duration: 3 });
    } finally {
      setIsProcessing(false);
    }
  };

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
        );
      case 2:
        return !!shippingMethod;
      case 3:
        return (
          paymentMethod.type === "pix" ||
          paymentMethod.type === "boleto" ||
          (paymentMethod.cardNumber && paymentMethod.expiryDate && paymentMethod.cvv && paymentMethod.cardName)
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingForm />;
      case 2:
        return <ShippingMethodSelector />;
      case 3:
        return <PaymentForm />;
      case 4:
        // NOVIDADE: No passo de revisão, o botão de "Finalizar Pedido" chama a função `handleFinishOrder`
        return <OrderReview onFinishOrder={handleFinishOrder} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Botão para voltar ao início */}
        <div className="mb-8">
          <Button variant="ghost" className="text-slate-600 hover:text-slate-800" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar para a home
            </Link>
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors duration-300 ${currentStep >= step.id
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                        : "border-slate-300 text-slate-500"
                      }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="text-base font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium text-center transition-colors duration-300 ${currentStep >= step.id ? "text-emerald-600" : "text-slate-500"
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${currentStep > step.id ? "bg-emerald-600" : "bg-slate-300"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl rounded-2xl border-slate-100">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-2xl">
                <CardTitle className="text-xl font-bold">{steps[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">{renderStepContent()}</CardContent>
            </Card>

            {/* Navigation Buttons */}
            {/* NOVIDADE: Os botões de navegação foram movidos para dentro dos componentes de passo */}
            {currentStep !== steps.length && (
              <div className="flex justify-between mt-6">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 text-slate-600 hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-md"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl rounded-2xl border-slate-100 sticky top-24">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-2xl">
                <CardTitle className="text-lg font-bold">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.color}-${item.size}`}
                      className="flex justify-between text-sm text-slate-600"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-slate-500">
                          {item.color && `Cor: ${item.color}`}
                          {item.size && ` • Tamanho: ${item.size}`}
                          {` • Qtd: ${item.quantity}`}
                        </p>
                      </div>
                      <p className="font-medium text-slate-900">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium text-slate-800">R$ {total.toFixed(2)}</span>
                  </div>
                  {shippingMethod?.price !== undefined && (
                    <div className="flex justify-between">
                      <span>Frete ({shippingMethod.name}):</span>
                      <span className="font-medium text-slate-800">R$ {shippingMethod.price.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
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
  );
}