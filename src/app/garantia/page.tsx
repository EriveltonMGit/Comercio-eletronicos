// src/app/politicas/garantia/page.tsx
import React from "react";

import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { PolicyLayout } from "../politicas/policies/policy-layout";

export default function GarantiaPage() {
    return (
        <PolicyLayout title="Política de Garantia">
            <div className="mb-8">
                <Link href="/" passHref>
                    <Button variant="outline" className="flex items-center gap-2">
                        <ArrowLeft size={16} /> Voltar
                    </Button>
                </Link>
            </div>
            <article>
                <div className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-4">
                    <CheckCircle className="text-emerald-500" size={24} />
                    <h2>Garantia de Qualidade</h2>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                    Última atualização: 10 de Setembro de 2025
                </p>
                <p className="mt-4">
                    Todos os produtos vendidos em nossa loja possuem garantia contra
                    defeitos de fabricação. Nosso objetivo é assegurar que você receba
                    um produto de alta qualidade e em perfeitas condições.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                    1. Prazo de Garantia
                </h2>
                <p>
                    Oferecemos **90 (noventa) dias de garantia legal** para todos os
                    produtos, a partir da data de recebimento do item. Esta garantia
                    cobre qualquer defeito de fabricação ou vício oculto que impeça o
                    funcionamento normal do produto.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                    2. O que a Garantia Cobre
                </h2>
                <p>
                    A garantia se aplica a defeitos de fabricação, como falhas em
                    componentes, montagem inadequada, ou materiais de baixa qualidade que
                    comprometam o uso do produto.
                </p>
                <ul className="list-disc list-inside mt-4">
                    <li>Falhas de hardware.</li>
                    <li>Componentes que não funcionam como esperado.</li>
                    <li>Problemas estruturais do produto.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                    3. A Garantia Não Cobre
                </h2>
                <p>
                    A garantia não se aplica em casos de mau uso, acidentes ou danos
                    causados pelo consumidor. Isso inclui:
                </p>
                <ul className="list-disc list-inside mt-4">
                    <li>Danos causados por água, queda ou impacto.</li>
                    <li>Desgaste natural do produto.</li>
                    <li>Modificações ou reparos realizados por terceiros não
                        autorizados.</li>
                    <li>Uso do produto em desacordo com as instruções do manual.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                    4. Como Acionar a Garantia
                </h2>
                <p>
                    Para acionar a garantia, entre em contato com nosso serviço de
                    atendimento ao cliente, informando o número do seu pedido e uma
                    descrição detalhada do problema. Se possível, envie fotos ou vídeos
                    que demonstrem o defeito. Nossa equipe irá orientá-lo sobre os
                    próximos passos para análise e reparo ou substituição do produto.
                </p>
            </article>
        </PolicyLayout>
    );
}