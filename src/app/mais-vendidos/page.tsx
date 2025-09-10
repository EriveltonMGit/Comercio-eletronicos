// src/app/mais-vendidos/page.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

// Componentes UI
import { Footer } from "../../components/layout/footer";
import { CartSidebar } from "../../components/cart/cart-sidebar";
import { ProductGrid } from "../../components/products/product-grid";
import { Badge } from "../../components/ui/badge";
import Header from "@/src/components/layout/header";
import { Button } from "@/src/components/ui/button";

// Esqueletos
import { MaisVendidosPageSkeleton } from "@/src/components/skeletons/mais-vendidos-page-skeleton";

// Hooks e Redux
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setProducts, Product as ProductType } from "../../lib/features/products/productsSlice";

// Serviços e Ícones
import { getAllProductsData, RelatedProduct as RelatedProductType } from "../../services/cardService";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { message } from "antd";

export default function MaisVendidosPage() {
    const dispatch = useAppDispatch();

    const allProducts = useAppSelector((state) => state.products.items);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setIsLoading(true);

                // Busca todos os produtos da API se o estado global estiver vazio
                if (allProducts.length === 0) {
                    const productsFromApi = await getAllProductsData();
                    dispatch(setProducts(productsFromApi));
                }

            } catch (e) {
                console.error("Failed to fetch products for best-sellers:", e);
                setError("Erro ao carregar os produtos mais vendidos. Tente novamente mais tarde.");
                message.error("Erro ao carregar os produtos mais vendidos. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllProducts();
    }, [dispatch, allProducts.length]);

    // Lógica para ordenar e limitar os produtos mais vendidos
    const bestSellers = useMemo(() => {
        return [...allProducts]
            .sort((a, b) => b.price - a.price) // Ordena por preço de forma decrescente
            .slice(0, 20) // Limita a 20 produtos
            .map(p => ({
                id: p.id,
                name: p.name,
                image: p.image || "/placeholder.svg",
                price: p.price,
                discount: p.discount,
                brand: p.brand,
            }));
    }, [allProducts]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <CartSidebar />

            <main>
                {isLoading ? (
                    <MaisVendidosPageSkeleton />
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : (
                    <>
                        {/* Hero Section para Mais Vendidos */}
                        <section className="bg-gradient-to-br from-green-500 to-teal-600 text-white py-16 text-center mt-0 shadow-lg">
                            <div className="container mx-auto px-4">
                                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                                    Mais Procurados!
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">Produtos Mais Vendidos</h1>
                                <p className="text-xl text-green-100 max-w-2xl mx-auto">
                                    Confira os produtos que a nossa comunidade mais ama e compra.
                                </p>
                            </div>
                        </section>

                        {/* Grade de Produtos */}
                        <section className="py-16">
                            <div className="container mx-auto px-4">
                                {/* NOVO: Título com seta de voltar */}
                                <div className="flex items-center gap-2 mb-8">
                                    <Link href="/" className="text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2">
                                        <ArrowLeft className="w-6 h-6" />
                                        <h2 className="text-1xl font-bold text-slate-800 flex items-center gap-2">
                                            Top 20 Mais Vendidos
                                            <img src="/icons/trends.gif" alt="" className="w-10 h-10 " />
                                        </h2>
                                    </Link>
                                </div>

                                {bestSellers.length > 0 ? (
                                    <ProductGrid products={bestSellers} />
                                ) : (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum produto mais vendido encontrado.</h3>
                                        <p className="text-slate-600">Fique de olho, essa lista é atualizada constantemente!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}