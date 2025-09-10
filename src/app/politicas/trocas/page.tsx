// src/app/politicas/trocas/page.tsx
import React from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { PolicyLayout } from "../policies/policy-layout";

export default function TrocasPage() {
  return (
    <PolicyLayout title="Política de Trocas e Devoluções">
      <div className="mb-8">
        <Link href="/politicas" passHref>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Voltar
          </Button>
        </Link>
      </div>
      <article>
        <p className="text-xl font-semibold text-gray-800">
          Última atualização: 10 de Setembro de 2025
        </p>
        <p className="mt-4">
          Nossa política de trocas e devoluções está em conformidade com o
          Código de Defesa do Consumidor. Nosso objetivo é garantir sua
          satisfação total com a compra.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          1. Direito de Arrependimento
        </h2>
        <p>
          Você pode desistir da compra em até **7 (sete) dias corridos** após o
          recebimento do produto, sem precisar justificar o motivo. O produto
          deve estar em sua embalagem original, sem sinais de uso e com todos
          os acessórios.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          2. Troca por Defeito
        </h2>
        <p>
          Caso o produto apresente defeito, você deve nos notificar em até
          **90 (noventa) dias** após a compra. O produto passará por uma análise
          técnica e, se o defeito for confirmado, você terá a opção de
          substituição por um produto novo, reembolso ou crédito na loja.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          3. Processo de Devolução
        </h2>
        <p>
          Para iniciar o processo de devolução ou troca, entre em contato conosco
          através do nosso e-mail ou formulário de contato, informando o número
          do pedido e o motivo.
        </p>
      </article>
    </PolicyLayout>
  );
}