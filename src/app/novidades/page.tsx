"use client";

import React, { useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/src/lib/hooks";
import { setProducts } from "@/src/lib/features/products/productsSlice";
import { getAllProductsData } from "@/src/services/cardService";
import { message } from "antd";

import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/src/components/products/product-card";
import { Footer } from "@/src/components/layout/footer";
import Header from "@/src/components/layout/header";

export default function Novidades() {
    const dispatch = useAppDispatch();
    const allProducts = useAppSelector((state) => state.products.items);
    const loading = useAppSelector((state) => state.products.isLoading);

    useEffect(() => {
        // Carrega os produtos se o estado estiver vazio
        if (allProducts.length === 0) {
            const fetchProducts = async () => {
                try {
                    const productsFromApi = await getAllProductsData();
                    dispatch(setProducts(productsFromApi));
                } catch (e) {
                    console.error("Failed to fetch products for Novidades page:", e);
                    message.error("Erro ao carregar os últimos lançamentos. Tente novamente mais tarde.");
                }
            };
            fetchProducts();
        }
    }, [allProducts.length, dispatch]);

    // Use useMemo para memorizar o resultado do filtro e ordenação
    const latestProducts = useMemo(() => {
        // Ordena os produtos por ID de forma decrescente para simular "novidades"
        return [...allProducts].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 12);
    }, [allProducts]);

    return (
        <>
            <Header />
            <main className="container mx-auto p-4 min-h-[calc(100vh-128px)]">
                <div className="flex items-center gap-2 mb-6">
                    <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-1xl font-bold text-slate-800 flex items-center gap-3">

                        Novidades
                        <img src="/icons/novidades.gif" alt="" className="w-10 h-10 "
                        />
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-lg text-slate-500">
                        Carregando novidades...
                    </div>
                ) : (
                    <>
                        {latestProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {latestProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-lg text-slate-500">
                                Nenhuma novidade encontrada no momento.
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}