// src/components/skeletons/product-page-skeleton.tsx
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

export function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-16 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr] gap-8 lg:gap-12 bg-white p-6 rounded-lg shadow-md border border-slate-200">
        {/* Esqueleto para a área de imagem */}
        <div className="lg:order-1 flex flex-col items-center">
          <div className="w-full max-w-lg aspect-square rounded-lg bg-gray-200" />
          <div className="flex gap-2 mt-4 w-full justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-200" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-200" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Esqueleto para a área de informação do produto */}
        <div className="space-y-6 lg:order-2">
          {/* Título e preço */}
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <Separator />

          {/* Quantidade e botões */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="h-6 w-12 bg-gray-200 rounded" />
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-12 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>

      {/* Esqueleto para as seções de descrição e especificações */}
      <Separator className="my-12" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card className="shadow-md border-slate-200">
          <CardContent className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </CardContent>
        </Card>
        <Card className="shadow-md border-slate-200">
          <CardContent className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </CardContent>
        </Card>
      </div>

      {/* Esqueleto para os produtos relacionados */}
      <section className="mt-16 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="w-full h-80 bg-gray-200 rounded-lg" />
          <div className="w-full h-80 bg-gray-200 rounded-lg" />
          <div className="w-full h-80 bg-gray-200 rounded-lg" />
          <div className="w-full h-80 bg-gray-200 rounded-lg" />
        </div>
      </section>
    </div>
  );
}