// src/app/politicas/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Componentes UI
import Header from "../../components/layout/header";
import { Footer } from "../../components/layout/footer";
import { CartSidebar } from "../../components/cart/cart-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";

// Ícones
import { ShieldCheck, FileText, RefreshCcw, Handshake, Truck } from "lucide-react";
import { PolicyPageSkeleton } from "@/src/components/skeletons/policy-page-skeleton";

// Esqueleto da página


export default function PoliticasPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simula o carregamento dos dados
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <CartSidebar />

            {isLoading ? (
                <PolicyPageSkeleton />
            ) : (
                <main className="container mx-auto px-4 py-8 lg:py-16">
                    {/* Seção de Hero */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 text-slate-800 mb-2">
                            <Image src="/icons/policy.gif" alt="Ícone de Documentos" width={40} height={40} className="w-10 h-10" />
                            <h1 className="text-2xl md:text-3xl font-bold">Políticas da Loja</h1>
                        </div>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Transparência é fundamental. Conheça as políticas que regem a sua experiência de compra em nosso site.
                        </p>
                    </div>

                    <Separator className="my-12" />

                    {/* Cards de Políticas */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Card: Política de Privacidade */}
                        <Card className="p-6 text-center rounded-xl shadow-md border-slate-200 transition-transform duration-300 hover:scale-105">
                            <CardHeader className="p-0 mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-2xl font-bold mt-2">Política de Privacidade</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 text-slate-600">
                                <p>Entenda como coletamos, usamos e protegemos suas informações pessoais. Sua segurança é nossa prioridade.</p>
                                <Link href="/politicas/privacidade" passHref>
                                    <Button className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700">
                                        Leia mais
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Card: Termos e Condições */}
                        <Card className="p-6 text-center rounded-xl shadow-md border-slate-200 transition-transform duration-300 hover:scale-105">
                            <CardHeader className="p-0 mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-2xl font-bold mt-2">Termos e Condições</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 text-slate-600">
                                <p>Conheça as regras para usar nosso site. Ao navegar, você concorda com nossos termos e condições.</p>
                                <Link href="/politicas/termos" passHref>
                                    <Button className="mt-6 w-full" variant="outline">
                                        Leia mais
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Card: Política de Trocas e Devoluções */}
                        <Card className="p-6 text-center rounded-xl shadow-md border-slate-200 transition-transform duration-300 hover:scale-105">
                            <CardHeader className="p-0 mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-50 text-purple-600 mb-2">
                                    <RefreshCcw className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-2xl font-bold mt-2">Política de Trocas</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 text-slate-600">
                                <p>Detalhes sobre como realizar trocas, devoluções e exercer seu direito de arrependimento.</p>
                                <Link href="/politicas/trocas" passHref>
                                    <Button className="mt-6 w-full" variant="outline">
                                        Leia mais
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Card: Política de Envio e Prazos */}
                        <Card className="p-6 text-center rounded-xl shadow-md border-slate-200 transition-transform duration-300 hover:scale-105">
                            <CardHeader className="p-0 mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-50 text-orange-600 mb-2">
                                    <Truck className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-2xl font-bold mt-2">Política de Envio</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 text-slate-600">
                                <p>Informações detalhadas sobre os métodos de envio, prazos de entrega e o processo de rastreamento.</p>
                                <Link href="/politicas/envio" passHref>
                                    <Button className="mt-6 w-full" variant="outline">
                                        Leia mais
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Card: Direitos do Consumidor */}
                        <Card className="p-6 text-center rounded-xl shadow-md border-slate-200 transition-transform duration-300 hover:scale-105">
                            <CardHeader className="p-0 mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-cyan-50 text-cyan-600 mb-2">
                                    <Handshake className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-2xl font-bold mt-2">Direitos do Consumidor</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 text-slate-600">
                                <p>Apresentamos os seus direitos como consumidor, de acordo com o Código de Defesa do Consumidor.</p>
                                <Link href="/politicas/direitos" passHref>
                                    <Button className="mt-6 w-full" variant="outline">
                                        Leia mais
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </section>
                </main>
            )}

            <Footer />
        </div>
    );
}