// src/components/confirmation-modal.tsx

"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { CheckCircle, Heart, ShoppingCart } from "lucide-react";

// Adicione os imports do Redux
import { useAppDispatch } from "../../lib/hooks";
import { toggleCart } from "../../lib/features/cart/cartSlice";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "cart" | "favorites";
  productName: string;
}

export function ConfirmationModal({ isOpen, onClose, type, productName }: ConfirmationModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch(); // Inicialize o dispatch

  const handleContinueShopping = () => {
    onClose();
  };

  const handleGoToDestination = () => {
    onClose();
    if (type === "cart") {
      // Use a ação Redux para abrir o carrinho
      dispatch(toggleCart(true));
    } else {
      router.push("/favoritos");
    }
  };

  const isCart = type === "cart";
  const Icon = isCart ? ShoppingCart : Heart;
  const title = isCart ? "Produto Adicionado ao Carrinho!" : "Produto Adicionado aos Favoritos!";
  const description = isCart
    ? `"${productName}" foi adicionado ao seu carrinho.`
    : `"${productName}" foi adicionado aos seus favoritos.`;
  const actionText = isCart ? "Ver Carrinho" : "Ver Favoritos";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-emerald-100 animate-in fade-in-90 zoom-in-95 data-[state=open]:duration-300 data-[state=closed]:duration-200"
      >
        <DialogHeader className="text-center ">
          <div
            className="mx-auto mb-4 flex items-center justify-center relative w-20 h-20"
          >
            <img src="/icons/sacola.gif" alt="Sacola de compras" className="w-full h-full object-contain" />
            <div
              className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-white p-0.5 shadow-md"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-800">{title}</DialogTitle>
          <DialogDescription className="text-md text-slate-600 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleContinueShopping}
            className="flex-1 bg-white/80 text-emerald-600 border-emerald-400 hover:bg-emerald-50 hover:border-emerald-500 transition-all duration-300 rounded-lg py-2 h-10"
          >
            Continuar Comprando
          </Button>
          <Button
            onClick={handleGoToDestination}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg py-2 h-10"
          >
            <Icon className="w-4 h-4 mr-2" />
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}