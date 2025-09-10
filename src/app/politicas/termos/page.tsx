// src/app/politicas/termos/page.tsx
import React from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { PolicyLayout } from "../policies/policy-layout";

export default function TermosPage() {
  return (
    <PolicyLayout title="Termos e Condições">
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
          Bem-vindo à nossa loja online. Ao acessar e usar este site, você
          concorda em cumprir e estar vinculado aos seguintes termos e
          condições de uso.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          1. Aceitação dos Termos
        </h2>
        <p>
          Ao utilizar este site, você declara que tem idade legal para comprar e
          que leu, entendeu e aceita os termos e condições aqui descritos.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          2. Direitos Autorais e Propriedade Intelectual
        </h2>
        <p>
          Todo o conteúdo presente no site, incluindo textos, gráficos, logos,
          ícones, imagens, clipes de áudio, downloads digitais e compilações de
          dados, é propriedade da nossa empresa ou de seus fornecedores de
          conteúdo e protegido pelas leis de direitos autorais.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          3. Limitação de Responsabilidade
        </h2>
        <p>
          Não seremos responsáveis por quaisquer danos diretos, indiretos,
          incidentais, punitivos e consequenciais que resultem do uso ou da
          incapacidade de usar este site.
        </p>
      </article>
    </PolicyLayout>
  );
}