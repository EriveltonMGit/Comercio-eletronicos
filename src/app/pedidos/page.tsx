// src/app/pedidos/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../../components/layout/header";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, ShoppingCart, Truck, CheckCircle, Clock } from "lucide-react";
import React from "react";
import { OrdersPageSkeleton } from "../../components/skeletons/orders-page-skeleton";

// Defina um tipo de Pedido (simulado) para o seu estado
interface Order {
    id: string;
    date: string;
    total: number;
    status: 'processando' | 'enviado' | 'entregue';
    items: {
        name: string;
        quantity: number;
        price: number;
        image: string;
    }[];
    shippingInfo: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

// Dados de pedidos simulados
const mockOrders: Order[] = [
    {
        id: "ORD-12345",
        date: "10 de Setembro de 2025",
        total: 4015.88,
        status: 'enviado',
        items: [
            { name: "Apple MacBook Pro 14 Inch Space Grey", quantity: 1, price: 3999.98, image: "/images/product-1.png" },
            { name: "Entrega Padrão", quantity: 1, price: 15.90, image: "/icons/truck-icon.svg" }
        ],
        shippingInfo: {
            address: "Rua Exemplo, 123",
            city: "São Paulo",
            state: "SP",
            zipCode: "01000-000",
        }
    },
    {
        id: "ORD-12346",
        date: "08 de Setembro de 2025",
        total: 299.99,
        status: 'entregue',
        items: [
            { name: "iPhone 6", quantity: 1, price: 299.99, image: "/images/product-5.png" },
        ],
        shippingInfo: {
            address: "Avenida dos Testes, 456",
            city: "Rio de Janeiro",
            state: "RJ",
            zipCode: "20000-000",
        }
    },
];

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setOrders(mockOrders);
            setIsLoading(false);
        };
        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <>
                <Header />
                <OrdersPageSkeleton />
            </>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 py-16">
                <Header />
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Você ainda não tem pedidos</h1>
                    <p className="text-slate-600 mb-8 text-pretty">
                        Quando você fizer sua primeira compra, ela aparecerá aqui.
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Continuar Comprando
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusInfo = (status: Order['status']) => {
        switch (status) {
            case 'processando':
                return {
                    text: 'Processando',
                    color: 'text-orange-600',
                    icon: <Clock className="w-5 h-5 text-orange-600" />,
                    description: 'Seu pedido está sendo preparado para envio.'
                };
            case 'enviado':
                return {
                    text: 'Enviado',
                    color: 'text-blue-600',
                    icon: <Truck className="w-5 h-5 text-blue-600" />,
                    description: 'Seu pedido foi enviado e está a caminho.'
                };
            case 'entregue':
                return {
                    text: 'Entregue',
                    color: 'text-emerald-600',
                    icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
                    description: 'Seu pedido foi entregue com sucesso.'
                };
        }
    };


    const getStatusProgressBar = (status: Order['status']) => {
        const statuses = ['processando', 'enviado', 'entregue'];
        const currentStatusIndex = statuses.indexOf(status);

        return (
            <div className="relative flex justify-between items-center w-full mt-8">
                {/* Linha de progresso */}
                <div className="absolute w-full h-1 bg-slate-300 top-4 -z-10" />
                <div className={`absolute h-1 bg-emerald-600 top-4 -z-10 transition-all duration-500 ${currentStatusIndex === 0 ? 'w-1/4' : currentStatusIndex === 1 ? 'w-1/2' : 'w-full'}`} />

                {statuses.map((s, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const statusInfo = getStatusInfo(s as Order['status']);
                    return (
                        <div key={s} className="flex flex-col items-center z-10 w-1/3 text-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'}`}>
                                {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : null}
                            </div>
                            <span className={`text-xs sm:text-sm mt-2 font-medium ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>{statusInfo.text}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Meus Pedidos</h1>

                <div className="space-y-8">
                    {orders.map(order => {
                        const statusInfo = getStatusInfo(order.status);

                        return (
                            <Card key={order.id} className="shadow-lg rounded-2xl border-slate-100 p-6">
                                <CardHeader className="p-0 mb-4 flex-row items-center justify-between border-b pb-4 border-slate-200">
                                    <div className="flex flex-col">
                                        <CardTitle className="text-xl font-bold text-slate-800">Pedido #{order.id}</CardTitle>
                                        <p className="text-sm text-slate-600 mt-1">Data do Pedido: {order.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-800">Total do Pedido:</p>
                                        <span className="text-xl font-bold text-emerald-600">R$ {order.total.toFixed(2)}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0 space-y-6">
                                    {/* Tabela de Produtos */}
                                    <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                                        {/* Cabeçalho da Tabela */}
                                        <div className="hidden md:grid grid-cols-[1fr_4fr_1fr_1fr] bg-slate-100 text-sm font-semibold text-slate-700 py-3 px-4">
                                            <span>Produto</span>
                                            <span>Detalhes</span>
                                            <span>Qtd</span>
                                            <span className="text-right">Total</span>
                                        </div>
                                        {/* Itens do Pedido */}
                                        {order.items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-[80px_1fr] md:grid-cols-[1fr_4fr_1fr_1fr] items-center py-4 px-4 border-t border-slate-200">
                                                <div className="flex-shrink-0">
                                                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-slate-100">
                                                        {/* AQUI: Usando tag <img> nativa para exibir a imagem */}
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row flex-1 items-start md:items-center justify-between pl-4 md:pl-0">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800 text-sm line-clamp-2">{item.name}</h4>
                                                        <p className="text-sm text-slate-600 mt-1">
                                                            Preço unitário: R$ {item.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <span className="text-sm text-center text-slate-800 hidden md:block">{item.quantity}</span>
                                                    <span className="text-sm font-bold text-emerald-600 text-right hidden md:block">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                                    {/* Versão para mobile */}
                                                    <div className="flex items-center md:hidden text-sm gap-2 mt-2 w-full justify-between">
                                                        <span className="text-slate-800">Qtd: {item.quantity}</span>
                                                        <span className="font-bold text-emerald-600">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Simulação de Entrega */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            {statusInfo.icon}
                                            <h4 className="font-semibold text-slate-800 text-lg">Status do Pedido: {statusInfo.text}</h4>
                                        </div>
                                        <p className="text-slate-600 text-sm">{statusInfo.description}</p>
                                        {getStatusProgressBar(order.status)}
                                    </div>

                                    <div className="p-4 bg-slate-100 rounded-lg">
                                        <h4 className="font-semibold text-slate-800 mb-2">Endereço de Entrega</h4>
                                        <p className="text-sm text-slate-600">
                                            {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.zipCode}
                                        </p>
                                    </div>

                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}