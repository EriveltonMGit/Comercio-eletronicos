// src/app/politicas/direitos/page.tsx
import React from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { PolicyLayout } from "../policies/policy-layout";

export default function DireitosPage() {
  return (
    <PolicyLayout title="Direitos do Consumidor">
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
          Nosso compromisso com a transparência e a ética se baseia no
          Código de Defesa do Consumidor (Lei 8.078/90). Aqui estão alguns de
          seus direitos fundamentais.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          1. Direito à Informação
        </h2>
        <p>
          Você tem o direito de receber informações claras e precisas sobre
          nossos produtos, serviços, preços, prazos e riscos.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          2. Direito de Arrependimento
        </h2>
        <p>
          Em compras feitas fora do estabelecimento comercial (como em nossa
          loja virtual), você pode desistir do contrato em até **7 dias** após o
          recebimento do produto.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          3. Direito à Proteção Contra Práticas Abusivas
        </h2>
        <p>
          Nossa loja se compromete a não adotar práticas comerciais
          enganosas ou abusivas.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          4. Direito à Reparação de Danos
        </h2>
        <p>
          Se o produto apresentar um defeito, você tem o direito de ter o
          dano reparado. O fornecedor tem até **30 dias** para consertar o
          produto.
        </p>
      </article>
    </PolicyLayout>
  );
}