// src/components/PromoCards.tsx
import {
  User,
  MapPin,
  Wallet,
  Coins,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface PromoCardData {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const promoCardsData: PromoCardData[] = [
  {
    title: "Conta",
    description: "Aproveite ofertas e gerencie seus pedidos com facilidade.",
    icon: User,
    href: "/login",
  },
  {
    title: "Perto",
    description: "Confira custos e prazos de entrega para sua localização.",
    icon: MapPin,
    href: "/location",
  },
  {
    title: "Pagamento",
    description: "Pague suas compras com rapidez e total segurança.",
    icon: Wallet,
    href: "/payment-methods",
  },
  {
    title: "Menos R$100",
    description: "Descubra produtos incríveis com preços abaixo de R$100.",
    icon: Coins,
    href: "/products/less-than-100",
  },
  {
    title: "Desejados",
    description: "Explore os produtos que são tendência e se destaque.",
    icon: ShoppingBag,
    href: "/best-sellers",
  },
];

export const PromoCards = () => {
  return (
    <div
      className="
        mx-auto px-2 py-2 z-80 absolute
        mt-[-10vh] sm:mt-[-10vh] md:mt-[-20vh] lg:mt-[-25vh] xl:mt-[-20vh]
        w-full
      "
    >
      {/* Grid sempre 5 colunas no mobile, ocupando largura total */}
      <div className="grid grid-cols-5 w-full gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {promoCardsData.map((card, index) => (
          <div
            key={index}
            className="
              group flex flex-col items-center justify-center text-center
              rounded-lg border border-gray-200 bg-white 
              transition-all duration-300 hover:border-yellow-400 hover:shadow-md
              h-20 sm:h-auto sm:p-6 w-full
            "
          >
            {/* Ícone */}
            <div className="rounded-full bg-gray-100 p-1.5 sm:p-3 transition-colors duration-300 group-hover:bg-yellow-100">
              <card.icon className="h-5 w-5 text-gray-700 transition-colors duration-300 group-hover:text-yellow-600" />
            </div>

            {/* Título */}
            <h3 className="mt-1 text-[9px] font-semibold text-gray-800 sm:text-base">
              {card.title}
            </h3>

            {/* Descrição + botão só aparecem >= sm */}
            <div className="hidden sm:block flex-1 space-y-2">
              <p className="text-sm leading-snug text-gray-500">
                {card.description}
              </p>
              <Button
                asChild
                variant="link"
                className="p-0 text-yellow-500 hover:text-yellow-600"
              >
                <Link href={card.href} className="flex items-center space-x-1">
                  <span>Saiba mais</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
