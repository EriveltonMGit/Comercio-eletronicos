// src/app/outlet/page.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

// Componentes UI
import { Footer } from "../../components/layout/footer";
import { CartSidebar } from "../../components/cart/cart-sidebar";
import { ProductGrid } from "../../components/products/product-grid";
import { Badge } from "../../components/ui/badge";
import Header from "@/src/components/layout/header";
import { Button } from "@/src/components/ui/button"; // Importe o Button

// Esqueletos
import { OutletPageSkeleton } from "@/src/components/skeletons/outlet-page-skeleton";

// Hooks e Redux
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setProducts, Product as ProductType } from "../../lib/features/products/productsSlice";

// Serviços e Ícones
import { getAllProductsData, RelatedProduct as RelatedProductType } from "../../services/cardService";
import { Tag, ArrowLeft } from "lucide-react"; // Importe o ícone ArrowLeft
import { message } from "antd";

export default function OutletPage() {
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
                console.error("Failed to fetch products for outlet:", e);
                setError("Erro ao carregar os produtos do Outlet. Tente novamente mais tarde.");
                message.error("Erro ao carregar os produtos do Outlet. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllProducts();
    }, [dispatch, allProducts.length]);

    // Lógica para filtrar produtos com descontos significativos E eletrônicos
    const outletProducts = useMemo(() => {
        const minDiscountPercentage = 20;
        const electronicsCategories = [
            "smartphones",
            "laptops",
            "smartwatches",
            "mobile-accessories",
            "womens-watches",
            "mens-watches"
        ];

        // Filtra os produtos que se encaixam na lógica de outlet
        return [...allProducts]
            .filter(p => {
                // Condição 1: Desconto alto
                const isHighDiscount = p.discountPercentage && p.discountPercentage > minDiscountPercentage;
                // Condição 2: Categoria de eletrônicos
                const isElectronic = electronicsCategories.includes(p.category);

                // Retorna produtos com alto desconto OU que são da categoria de eletrônicos
                return isHighDiscount || isElectronic;
            })
            // Mapeia para o tipo 'RelatedProductType'
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
                {/* Remove o botão de voltar separado para evitar redundância */}

                {isLoading ? (
                    <OutletPageSkeleton />
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : (
                    <>
                        {/* Hero Section para Outlet */}
                        <section className="bg-gradient-to-br from-purple-500 to-pink-600 text-white py-16 text-center mt-0 shadow-lg">
                            <div className="container mx-auto px-4">
                                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                                    Preços que você vai amar!
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">Outlet Imperdível</h1>
                                <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                                    Últimas unidades com descontos de até 70%!
                                </p>
                            </div>
                        </section>

                        {/* Grade de Produtos */}
                        <section className="py-16">
                            <div className="container mx-auto px-4">
                                {/* NOVO: Título com seta de voltar */}
                                <div className="flex items-center gap-2 mb-8">
                                    <Link href="/" className="text-slate-600 hover:text-slate-800 transition-colors">
                                        <ArrowLeft className="w-6 h-6" />
                                    </Link>
                                    <h2 className="text-1xl font-bold text-slate-800 flex items-center gap-2">
                                        Produtos em Liquidação
                                        <img src="/icons/outlet.gif" alt="" className="w-10 h-10 " />
                                    </h2>
                                </div>

                                {outletProducts.length > 0 ? (
                                    <ProductGrid products={outletProducts} />
                                ) : (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum produto em outlet encontrado.</h3>
                                        <p className="text-slate-600">Fique de olho, essa seção é atualizada com frequência!</p>
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