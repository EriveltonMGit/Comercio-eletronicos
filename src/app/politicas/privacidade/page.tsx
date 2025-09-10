// src/app/politicas/privacidade/page.tsx
import React from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { PolicyLayout } from "../policies/policy-layout";

export default function PrivacidadePage() {
  return (
    <PolicyLayout title="Política de Privacidade">
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
          Esta Política de Privacidade descreve como coletamos, usamos e
          compartilhamos suas informações pessoais quando você visita ou faz uma
          compra em nosso site.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          1. Coleta de Informações Pessoais
        </h2>
        <p>
          Quando você visita o Site, coletamos automaticamente certas
          informações sobre o seu dispositivo, incluindo informações sobre seu
          navegador, endereço IP, fuso horário e alguns dos cookies instalados
          em seu dispositivo.
        </p>
        <p>
          Além disso, quando você realiza ou tenta realizar uma compra através do
          Site, coletamos certas informações suas, como seu nome, endereço de
          cobrança, endereço de entrega, informações de pagamento (incluindo
          números de cartão de crédito), endereço de e-mail e número de
          telefone.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          2. Como Usamos Suas Informações
        </h2>
        <p>
          Utilizamos as informações que coletamos para processar e gerenciar
          suas compras, comunicar-nos com você, e para prevenir fraudes. As
          informações do dispositivo são usadas para nos ajudar a identificar
          possíveis riscos e fraudes, e para melhorar e otimizar nosso Site.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          3. Compartilhamento de Informações
        </h2>
        <p>
          Não compartilhamos suas informações pessoais com terceiros, exceto
          conforme necessário para processar sua compra (por exemplo, com a
          transportadora) ou quando exigido por lei.
        </p>
      </article>
    </PolicyLayout>
  );
}