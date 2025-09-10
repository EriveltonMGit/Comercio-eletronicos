// src/app/pedido-confirmado/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, Home, CreditCard, QrCode, Copy } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { clearCheckout } from "../../lib/features/checkout/checkoutSlice";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { notification } from "antd";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderId, shippingAddress, paymentMethod, shippingMethod, orderTotal } = useAppSelector(
    (state) => state.checkout
  );

  // Exibir a notificação de sucesso apenas uma vez
  useEffect(() => {
    if (orderId) {
      notification.success({
        message: "Pedido confirmado!",
        description: `Seu pedido #${orderId} foi processado com sucesso.`,
        placement: 'topRight',
      });
    }
    // Adicionar um reset leve do estado de checkout para a próxima compra
    return () => {
      dispatch(clearCheckout());
    };
  }, [orderId, dispatch]);

  // Redireciona se não houver um ID de pedido
  if (!orderId) {
    router.push("/");
    return null;
  }

  const handleCopyPixCode = () => {
    const pixCode = `00020126580014BR.GOV.BCB.PIX013636c4c14c-4b8a-4c4a-8b1a-1234567890125204000053039865802BR5925LOJA EXEMPLO LTDA6009SAO PAULO62070503***6304`;
    navigator.clipboard.writeText(pixCode);
    notification.success({
      message: "Código PIX copiado!",
      description: "Cole o código no seu app bancário para efetuar o pagamento.",
      placement: 'topRight',
    });
  };

  const getPaymentInstructions = () => {
    if (!paymentMethod) return null;

    switch (paymentMethod.type) {
      case "pix":
        return (
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-emerald-900">Pagamento via PIX</h4>
            </div>
            <p className="text-sm text-emerald-800 mb-3">
              Escaneie o QR Code ou copie o código PIX abaixo para efetuar o pagamento:
            </p>
            <div className="bg-white p-3 rounded border border-emerald-300 mb-3">
              <code className="text-xs break-all text-gray-700">
                00020126580014BR.GOV.BCB.PIX013636c4c14c-4b8a-4c4a-8b1a-1234567890125204000053039865802BR5925LOJA
                EXEMPLO LTDA6009SAO PAULO62070503***6304
              </code>
            </div>
            <Button onClick={handleCopyPixCode} variant="outline" size="sm" className="w-full bg-white text-emerald-600 border-emerald-400 hover:bg-emerald-50">
              <Copy className="w-4 h-4 mr-2" />
              Copiar código PIX
            </Button>
            <p className="text-xs text-emerald-700 mt-2">⚠️ O pagamento deve ser realizado em até 30 minutos.</p>
          </div>
        );

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
            <Button variant="outline" size="sm" className="w-full bg-white text-orange-600 border-orange-400 hover:bg-orange-50">
              <Package className="w-4 h-4 mr-2" />
              Visualizar Boleto
            </Button>
            <p className="text-xs text-orange-700 mt-2">⚠️ Vencimento: 3 dias úteis</p>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-emerald-900">Pagamento Aprovado</h4>
            </div>
            <p className="text-sm text-emerald-800">
              Seu pagamento foi processado com sucesso no cartão terminado em ****{paymentMethod.cardNumber?.slice(-4)}.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-xl rounded-2xl border-slate-100">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl py-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Pedido #{orderId}</CardTitle>
            <p className="text-emerald-100 mt-2">Obrigado pela sua compra. Seu pedido foi processado com sucesso.</p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              {/* Payment Instructions */}
              {getPaymentInstructions()}

              {/* Shipping Info */}
              {shippingAddress && shippingMethod && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-slate-600" />
                    <h4 className="font-semibold text-slate-800">Informações de Entrega</h4>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-medium text-slate-800">
                      {shippingAddress.firstName} {shippingAddress.lastName}
                    </p>
                    <p className="text-slate-700">{shippingAddress.address}</p>
                    <p className="text-slate-700">
                      {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}
                    </p>
                    <p className="text-slate-700">{shippingAddress.phone}</p>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-sm text-slate-600">
                        <strong>Método de entrega:</strong> {shippingMethod.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        <strong>Prazo:</strong> {shippingMethod.estimatedDays}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Order Total */}
            {orderTotal !== null && (
              <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-lg">
                <span className="text-lg font-semibold text-slate-900">Total do Pedido:</span>
                <span className="text-2xl font-bold text-emerald-600">R$ {orderTotal.toFixed(2)}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={() => router.push("/")} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Home className="w-4 h-4 mr-2" />
                Continuar Comprando
              </Button>
              <Button variant="outline" onClick={() => router.push("/perfil")} className="flex-1">
                <Package className="w-4 h-4 mr-2" />
                Ver Meus Pedidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}