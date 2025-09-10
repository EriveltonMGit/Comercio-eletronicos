"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { toggleCart, removeFromCart, updateQuantity } from "../../lib/features/cart/cartSlice";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../../lib/features/cart/cartSlice";
import { message } from "antd";
import { Dialog } from "@radix-ui/react-dialog";

export function CartSidebar() {
  const { items, total, isOpen } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  
  const handleClose = () => {
    dispatch(toggleCart(false));
  };

  const handleRemoveItem = (item: CartItemType) => {
    dispatch(removeFromCart({ id: item.id, size: item.size, color: item.color }));
    message.error(`"${item.name}" foi removido do seu carrinho.`);
  };

  const handleUpdateQuantity = (item: CartItemType, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(item);
      return;
    }
    dispatch(updateQuantity({ id: item.id, size: item.size, color: item.color, quantity: newQuantity }));
    message.success(`A quantidade de "${item.name}" foi alterada para ${newQuantity}.`);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Overlay com Blur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-all duration-300 ease-in-out bg-black/20 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed bg-white top-0 right-0 h-full w-full max-w-md border-l border-slate-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-800" />
              <h2 className="text-lg font-semibold text-gray-800">Carrinho ({itemCount})</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Seu carrinho está vazio</h3>
                <p className="text-slate-500 mb-4">Adicione alguns produtos para começar suas compras</p>
                <Button onClick={handleClose} asChild>
                  <Link href="/">Continuar Comprando</Link>
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-slate-100">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 text-sm line-clamp-2">{item.name}</h4>
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
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-emerald-600">R$ {item.price.toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent border-slate-300 hover:bg-slate-100"
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3 text-slate-600" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center text-slate-800">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent border-slate-300 hover:bg-slate-100"
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-600"
                            onClick={() => handleRemoveItem(item)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {items.length > 0 && (
            <div className="border-t border-slate-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-emerald-600">R$ {total.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  asChild
                >
                  <Link href="/checkout" onClick={handleClose}>
                    Finalizar Compra
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-white" onClick={handleClose} asChild>
                  <Link href="/">Continuar Comprando</Link>
                </Button>
              </div>
              <p className="text-xs text-slate-500 text-center">Frete e impostos calculados no checkout</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}