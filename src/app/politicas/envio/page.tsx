// src/app/politicas/envio/page.tsx
import React from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { PolicyLayout } from "../policies/policy-layout";

export default function EnvioPage() {
  return (
    <PolicyLayout title="Política de Envio e Prazos">
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
          Nossa política de envio visa garantir que seu pedido chegue de forma
          segura e no prazo estipulado.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          1. Prazos de Envio
        </h2>
        <p>
          O prazo de envio é calculado a partir da confirmação do pagamento. O
          prazo para a entrega varia de acordo com a forma de envio escolhida e
          o CEP de destino. Você pode simular o prazo e o valor do frete no seu
          carrinho de compras.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          2. Rastreamento do Pedido
        </h2>
        <p>
          Após a postagem do seu pedido, você receberá um e-mail com o código
          de rastreamento. Você poderá acompanhar o status da entrega
          diretamente no site da transportadora.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          3. Entrega
        </h2>
        <p>
          As entregas são realizadas em horário comercial. É importante que
          haja uma pessoa responsável no local para receber o pedido. Serão
          realizadas até três tentativas de entrega.
        </p>
      </article>
    </PolicyLayout>
  );
}