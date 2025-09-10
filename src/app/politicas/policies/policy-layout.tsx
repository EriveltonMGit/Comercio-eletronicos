// src/components/policies/policy-layout.tsx
"use client";

import { CartSidebar } from "@/src/components/cart/cart-sidebar";
import { Footer } from "@/src/components/layout/footer";
import Header from "@/src/components/layout/header";
import { PolicyPageSkeleton } from "@/src/components/skeletons/policy-page-skeleton";
import { Separator } from "@/src/components/ui/separator";
import React, { ReactNode, useEffect, useState } from "react";


interface PolicyLayoutProps {
  title: string;
  children: ReactNode;
}

export function PolicyLayout({ title, children }: PolicyLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula o carregamento dos dados
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

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
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              {title}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-2">
              Detalhes completos sobre {title.toLowerCase()}.
            </p>
          </div>
          <Separator className="my-8" />
          <div className="prose prose-lg mx-auto text-slate-700 leading-relaxed">
            {children}
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}