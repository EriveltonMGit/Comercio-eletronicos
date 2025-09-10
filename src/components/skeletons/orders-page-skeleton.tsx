// src/components/skeletons/orders-page-skeleton.tsx

import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

export function OrdersPageSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 max-w-5xl animate-pulse">
                <div className="h-10 bg-slate-200 rounded w-1/4 mb-6" />

                <div className="space-y-8">
                    {/* Esqueleto para um Pedido */}
                    <Card className="shadow-lg rounded-2xl border-slate-100 p-6">
                        <CardHeader className="p-0 mb-4 flex-row items-center justify-between border-b pb-4 border-slate-200">
                            <div className="flex flex-col space-y-2">
                                <div className="h-6 bg-slate-200 rounded w-48" />
                                <div className="h-4 bg-slate-200 rounded w-32" />
                            </div>
                            <div className="text-right space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-24" />
                                <div className="h-6 bg-slate-200 rounded w-32" />
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 space-y-6">
                            {/* Esqueleto da Tabela de Produtos */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                                <div className="grid grid-cols-4 bg-slate-100 text-sm font-semibold text-slate-700 py-3 px-4" />
                                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[1fr_4fr_1fr_1fr] items-center py-4 px-4 border-t border-slate-200">
                                    <div className="w-16 h-16 rounded-md bg-slate-200" />
                                    <div className="flex-1 space-y-2 pl-4">
                                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                                    </div>
                                    <div className="h-4 bg-slate-200 rounded w-10 hidden md:block" />
                                    <div className="h-4 bg-slate-200 rounded w-16 ml-auto hidden md:block" />
                                </div>
                                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[1fr_4fr_1fr_1fr] items-center py-4 px-4 border-t border-slate-200">
                                    <div className="w-16 h-16 rounded-md bg-slate-200" />
                                    <div className="flex-1 space-y-2 pl-4">
                                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                                    </div>
                                    <div className="h-4 bg-slate-200 rounded w-10 hidden md:block" />
                                    <div className="h-4 bg-slate-200 rounded w-16 ml-auto hidden md:block" />
                                </div>
                            </div>

                            {/* Esqueleto da Simulação de Entrega */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-slate-200" />
                                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                                </div>
                                <div className="h-4 bg-slate-200 rounded w-full" />
                                <div className="flex justify-between items-center w-full mt-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div className="h-4 w-16 mt-2 bg-slate-200 rounded" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div className="h-4 w-16 mt-2 bg-slate-200 rounded" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div className="h-4 w-16 mt-2 bg-slate-200 rounded" />
                                    </div>
                                </div>
                            </div>

                            {/* Esqueleto do Endereço de Entrega */}
                            <div className="p-4 bg-slate-100 rounded-lg space-y-2">
                                <div className="h-6 bg-slate-200 rounded w-1/3" />
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-full" />
                            </div>

                        </CardContent>
                    </Card>
                    {/* Repetir o esqueleto para outro pedido */}
                    <Card className="shadow-lg rounded-2xl border-slate-100 p-6">
                        <CardHeader className="p-0 mb-4 flex-row items-center justify-between border-b pb-4 border-slate-200">
                            <div className="flex flex-col space-y-2">
                                <div className="h-6 bg-slate-200 rounded w-48" />
                                <div className="h-4 bg-slate-200 rounded w-32" />
                            </div>
                            <div className="text-right space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-24" />
                                <div className="h-6 bg-slate-200 rounded w-32" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-6">
                            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                                <div className="grid grid-cols-4 bg-slate-100 text-sm font-semibold text-slate-700 py-3 px-4" />
                                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[1fr_4fr_1fr_1fr] items-center py-4 px-4 border-t border-slate-200">
                                    <div className="w-16 h-16 rounded-md bg-slate-200" />
                                    <div className="flex-1 space-y-2 pl-4">
                                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                                    </div>
                                    <div className="h-4 bg-slate-200 rounded w-10 hidden md:block" />
                                    <div className="h-4 bg-slate-200 rounded w-16 ml-auto hidden md:block" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-slate-200" />
                                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                                </div>
                                <div className="h-4 bg-slate-200 rounded w-full" />
                                <div className="flex justify-between items-center w-full mt-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div className="h-4 w-16 mt-2 bg-slate-200 rounded" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div className="h-4 w-16 mt-2 bg-slate-200 rounded" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div className="h-4 w-16 mt-2 bg-slate-200 rounded" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-100 rounded-lg space-y-2">
                                <div className="h-6 bg-slate-200 rounded w-1/3" />
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}