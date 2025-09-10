"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Componentes UI
import { Footer } from "../../components/layout/footer";
import { CartSidebar } from "../../components/cart/cart-sidebar";
import { ProductGrid } from "../../components/products/product-grid";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import Header from "@/src/components/layout/header";

// NOVIDADE: Importação do componente de esqueleto
import { OffersPageSkeleton } from "@/src/components/skeletons/offers-page-skeleton";

// Hooks e Redux
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setProducts, Product as ProductType } from "../../lib/features/products/productsSlice";

// Serviços e Ícones
import { getAllProductsData, RelatedProduct as RelatedProductType } from "../../services/cardService";
import { getDailyOfferData, DailyOfferDetails } from "../../services/dailyOffer";
import { Percent, Clock, Flame, ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import { message } from "antd";


export default function OffersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Estados para o carregamento e dados
  const allProducts = useAppSelector((state) => state.products.items);
  const [dailyOffer, setDailyOffer] = useState<DailyOfferDetails | null>(null);
  const [otherOffers, setOtherOffers] = useState<RelatedProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllOffers = async () => {
      try {
        setIsLoading(true);

        const [dailyOfferData, allProductsFromApi] = await Promise.all([
          getDailyOfferData(),
          allProducts.length === 0 ? getAllProductsData() : Promise.resolve(allProducts)
        ]);

        if (allProducts.length === 0) {
          dispatch(setProducts(allProductsFromApi));
        }

        setDailyOffer(dailyOfferData);

        const discountedProducts = allProductsFromApi.filter(
          (p) => p.originalPrice && p.originalPrice > p.price && p.id.toString() !== dailyOfferData?.id
        );

        const formattedOffers: RelatedProductType[] = discountedProducts.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.image || "/placeholder.svg",
          price: p.price,
          discount: p.discount,
          brand: p.brand,
        }))
          .slice(0, 20); // LIMITANDO A EXIBIÇÃO A NO MÁXIMO 20 PRODUTOS

        setOtherOffers(formattedOffers);

      } catch (e) {
        console.error("Failed to fetch all offers:", e);
        setError("Erro ao carregar as ofertas. Tente novamente mais tarde.");
        message.error("Erro ao carregar as ofertas. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllOffers();
  }, [dispatch, allProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Header />
      <CartSidebar />

      <main>
        {isLoading ? (
          <OffersPageSkeleton />
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <>
            {dailyOffer && (
              <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12 md:py-24">
                <div className="absolute inset-0 z-0">
                  <Image
                    src={dailyOffer.image}
                    alt={dailyOffer.title}
                    fill
                    className="object-cover opacity-20 transition-opacity duration-500"
                  />
                </div>
                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                    <Badge className="bg-emerald-500 text-white border-emerald-400 mb-4">OFERTA DO DIA</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{dailyOffer.title}</h1>
                    <p className="text-lg text-slate-200 mb-6 max-w-lg">{dailyOffer.description}</p>
                    <div className="flex items-center gap-4 mb-6">
                      {dailyOffer.originalPrice && (
                        <span className="text-xl text-slate-400 line-through">
                          R$ {dailyOffer.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-yellow-400">
                        R$ {dailyOffer.currentPrice.toFixed(2)}
                      </span>
                      {dailyOffer.discountPercentage && (
                        <span className="text-lg font-semibold bg-red-600 px-3 py-1 rounded-full">
                          {dailyOffer.discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                    <Button size="lg" asChild className="bg-emerald-500 hover:bg-emerald-600">
                      <Link href={dailyOffer.link}>
                        Ver Detalhes
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-xs aspect-square">
                      <Image
                        src={dailyOffer.image}
                        alt={dailyOffer.title}
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Seção de Outras Ofertas */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-red-500" />
                  Outras Ofertas
                </h2>
                {otherOffers.length > 0 ? (
                  <ProductGrid products={otherOffers} />
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhuma outra oferta disponível.</h3>
                    <p className="text-slate-600">Volte em breve para conferir nossas próximas promoções!</p>
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