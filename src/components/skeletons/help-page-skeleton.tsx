// src/components/skeletons/help-page-skeleton.tsx

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

export function HelpPageSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8 lg:py-16 animate-pulse">
                {/* Esqueleto para a seção de hero */}
                <div className="text-center mb-12">
                    <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto mb-4" />
                    <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto" />
                </div>

                {/* Esqueleto para os FAQs */}
                <div className="space-y-4 max-w-3xl mx-auto mb-12">
                    <div className="h-16 bg-slate-200 rounded-lg" />
                    <div className="h-16 bg-slate-200 rounded-lg" />
                    <div className="h-16 bg-slate-200 rounded-lg" />
                </div>

                {/* Esqueleto para a seção de contato */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <CardHeader className="p-0 mb-4">
                            <div className="h-8 w-8 bg-slate-200 rounded-full mb-2" />
                            <div className="h-6 w-3/4 bg-slate-200 rounded" />
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            <div className="h-4 w-full bg-slate-200 rounded" />
                            <div className="h-4 w-1/2 bg-slate-200 rounded" />
                            <div className="h-10 w-full bg-slate-200 rounded-lg mt-4" />
                        </CardContent>
                    </Card>
                    <Card className="p-6">
                        <CardHeader className="p-0 mb-4">
                            <div className="h-8 w-8 bg-slate-200 rounded-full mb-2" />
                            <div className="h-6 w-3/4 bg-slate-200 rounded" />
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            <div className="h-4 w-full bg-slate-200 rounded" />
                            <div className="h-4 w-1/2 bg-slate-200 rounded" />
                            <div className="h-10 w-full bg-slate-200 rounded-lg mt-4" />
                        </CardContent>
                    </Card>
                    <Card className="p-6">
                        <CardHeader className="p-0 mb-4">
                            <div className="h-8 w-8 bg-slate-200 rounded-full mb-2" />
                            <div className="h-6 w-3/4 bg-slate-200 rounded" />
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            <div className="h-4 w-full bg-slate-200 rounded" />
                            <div className="h-4 w-1/2 bg-slate-200 rounded" />
                            <div className="h-10 w-full bg-slate-200 rounded-lg mt-4" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}