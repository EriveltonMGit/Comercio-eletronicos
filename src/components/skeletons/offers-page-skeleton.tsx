// src/components/skeletons/offers-page-skeleton.tsx
import React from 'react';
import { Card, CardContent } from '../ui/card';

export function OffersPageSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Esqueleto para a seção de destaque (Daily Offer) */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 py-12 md:py-24">
                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="h-6 w-32 bg-slate-700 rounded mb-4" /> {/* Badge */}
                        <div className="h-10 w-3/4 bg-slate-700 rounded mb-4" /> {/* Título */}
                        <div className="h-4 w-full bg-slate-700 rounded mb-2" /> {/* Descrição */}
                        <div className="h-4 w-2/3 bg-slate-700 rounded mb-6" /> {/* Descrição */}
                        <div className="h-12 w-48 bg-emerald-600 rounded-lg" /> {/* Botão */}
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-xs aspect-square bg-slate-700 rounded-lg" /> {/* Imagem */}
                    </div>
                </div>
            </section>

            {/* Esqueleto para a seção de outras ofertas */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="h-8 w-1/3 bg-slate-300 rounded mb-8" /> {/* Título "Outras Ofertas" */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* 4 Cards de Esqueleto */}
                        <Card className="rounded-xl shadow-md border-slate-200">
                            <div className="relative aspect-square bg-slate-200 rounded-t-xl" />
                            <CardContent className="p-4 space-y-2">
                                <div className="h-4 bg-slate-300 rounded w-3/4" />
                                <div className="h-4 bg-slate-300 rounded w-1/2" />
                                <div className="h-6 bg-emerald-500 rounded w-1/3" />
                            </CardContent>
                        </Card>
                        <Card className="rounded-xl shadow-md border-slate-200">
                            <div className="relative aspect-square bg-slate-200 rounded-t-xl" />
                            <CardContent className="p-4 space-y-2">
                                <div className="h-4 bg-slate-300 rounded w-3/4" />
                                <div className="h-4 bg-slate-300 rounded w-1/2" />
                                <div className="h-6 bg-emerald-500 rounded w-1/3" />
                            </CardContent>
                        </Card>
                        <Card className="rounded-xl shadow-md border-slate-200">
                            <div className="relative aspect-square bg-slate-200 rounded-t-xl" />
                            <CardContent className="p-4 space-y-2">
                                <div className="h-4 bg-slate-300 rounded w-3/4" />
                                <div className="h-4 bg-slate-300 rounded w-1/2" />
                                <div className="h-6 bg-emerald-500 rounded w-1/3" />
                            </CardContent>
                        </Card>
                        <Card className="rounded-xl shadow-md border-slate-200">
                            <div className="relative aspect-square bg-slate-200 rounded-t-xl" />
                            <CardContent className="p-4 space-y-2">
                                <div className="h-4 bg-slate-300 rounded w-3/4" />
                                <div className="h-4 bg-slate-300 rounded w-1/2" />
                                <div className="h-6 bg-emerald-500 rounded w-1/3" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}