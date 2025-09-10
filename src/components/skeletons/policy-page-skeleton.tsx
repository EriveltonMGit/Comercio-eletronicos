// src/components/skeletons/policy-page-skeleton.tsx

import React from "react";

export function PolicyPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 lg:py-16 animate-pulse">
            {/* Seção de Hero - Esqueleto */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="h-8 w-64 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-6 w-96 max-w-full mx-auto bg-gray-200 rounded-md"></div>
                <div className="h-6 w-80 max-w-full mt-2 mx-auto bg-gray-200 rounded-md"></div>
            </div>

            <div className="my-12 h-px bg-gray-200"></div>

            {/* Cards de Políticas - Esqueletos */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Esqueleto do Card 1 */}
                <div className="p-6 h-64 bg-gray-50 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
                    <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-52 bg-gray-200 rounded-md mt-4"></div>
                    <div className="h-10 w-full mt-6 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Esqueleto do Card 2 */}
                <div className="p-6 h-64 bg-gray-50 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
                    <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-52 bg-gray-200 rounded-md mt-4"></div>
                    <div className="h-10 w-full mt-6 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Esqueleto do Card 3 */}
                <div className="p-6 h-64 bg-gray-50 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
                    <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-52 bg-gray-200 rounded-md mt-4"></div>
                    <div className="h-10 w-full mt-6 bg-gray-200 rounded-lg"></div>
                </div>
            </section>
        </div>
    );
}