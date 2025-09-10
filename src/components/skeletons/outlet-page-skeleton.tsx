// src/components/skeletons/outlet-page-skeleton.tsx

import React from 'react';
import { Card, CardContent } from '../ui/card';

export function OutletPageSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Esqueleto para a seção de hero */}
            <section className="bg-gradient-to-br from-purple-200 to-pink-200 py-12 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="h-6 w-36 bg-purple-300 rounded mb-4 mx-auto" /> {/* Badge */}
                    <div className="h-10 w-2/3 bg-purple-300 rounded mb-4 mx-auto" /> {/* Título */}
                    <div className="h-4 w-1/2 bg-purple-300 rounded mx-auto" /> {/* Descrição */}
                </div>
            </section>

            {/* Esqueleto para a grade de produtos */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="h-8 w-1/4 bg-slate-300 rounded mb-8" /> {/* Título da seção */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <Card key={index} className="rounded-xl shadow-md border-slate-200">
                                <div className="relative aspect-square bg-slate-200 rounded-t-xl" />
                                <CardContent className="p-4 space-y-2">
                                    <div className="h-4 bg-slate-300 rounded w-3/4" />
                                    <div className="h-4 bg-slate-300 rounded w-1/2" />
                                    <div className="h-6 bg-red-500 rounded w-1/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}