"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Ícones
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  ChevronDown,
  Store,
  Box,
  LayoutGrid,
  HelpCircle,
  Sparkles,
  Monitor,
  Home,
  Shirt,
  Star,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { toggleCart } from "../../lib/features/cart/cartSlice";
import { setSearchQuery, setProducts, Product as ProductType } from "../../lib/features/products/productsSlice";
import { UserMenu } from "./user-menu";
import { message, notification } from "antd";
import { getAllProductsData, getCategoryCounts } from "../../services/cardService";
import { translations } from "@/src/lib/translations";

/* ----------------------
  Tipagens do MENU (unificadas)
  ---------------------- */

type MegaLink = { label: string; href: string; count?: number };
type MegaColumn = { title: string; links: MegaLink[] };
type Promo = { image: string; href: string; title: string };
type Brand = { label: string; href: string };

type MenuItem = {
  id: string;
  label: string;
  href?: string;
  megamenu?: boolean;
  columns?: MegaColumn[];
  featured?: ProductType[];
  brands?: Brand[];
  promo?: Promo;
  submenu?: { label: string; href: string }[];
};

/* ----------------------
  MENU (dados base)
  ---------------------- */
const BASE_MENU: MenuItem[] = [
  {
    id: "departamentos",
    label: "Departamentos",
    megamenu: true,
    columns: [
      {
        title: "Eletrônicos",
        links: [
          { label: "Smartphones", href: "/produtos?category=smartphones" },
          { label: "Laptops", href: "/produtos?category=laptops" },
          { label: "Acessórios para celular", href: "/produtos?category=mobile-accessories" },
          { label: "Relógios Masculinos", href: "/produtos?category=mens-watches" },
          { label: "Relógios Femininos", href: "/produtos?category=womens-watches" },
          { label: "Smartwatches", href: "/produtos?category=smartwatches" },
        ],
      },
      {
        title: "Casa & Cozinha",
        links: [
          { label: "Decoração", href: "/produtos?category=home-decoration" },
          { label: "Móveis", href: "/produtos?category=furniture" },
          { label: "Cozinha", href: "/produtos?category=kitchen-accessories" },
          { label: "Mercearia", href: "/produtos?category=groceries" },
        ],
      },
      {
        title: "Moda",
        links: [
          { label: "Camisas Masculinas", href: "/produtos?category=mens-shirts" },
          { label: "Sapatos Masculinos", href: "/produtos?category=mens-shoes" },
          { label: "Vestidos Femininos", href: "/produtos?category=womens-dresses" },
          { label: "Bolsas Femininas", href: "/produtos?category=womens-bags" },
          { label: "Sapatos Femininos", href: "/produtos?category=womens-shoes" },
          { label: "Óculos de sol", href: "/produtos?category=sunglasses" },
        ],
      },
      {
        title: "Beleza",
        links: [
          { label: "Beleza", href: "/produtos?category=beauty" },
          { label: "Cuidados com a pele", href: "/produtos?category=skin-care" },
          { label: "Perfumes", href: "/produtos?category=fragrances" },
          { label: "Joias", href: "/produtos?category=womens-jewellery" },
        ],
      },
      {
        title: "Outros",
        links: [
          { label: "Motocicletas", href: "/produtos?category=motorcycle" },
          { label: "Veículos", href: "/produtos?category=vehicle" },
          { label: "Acessórios Esportivos", href: "/produtos?category=sports-accessories" },
          { label: "Suprimentos para Pets", href: "/produtos?category=pet-supplies" },
        ],
      },
    ],
    featured: [],
    brands: [
      { label: "Apple", href: "/produtos?brand=Apple" },
      { label: "Samsung", href: "/produtos?brand=Samsung" },
      { label: "Huawei", href: "/produtos?brand=Huawei" },
      { label: "OPPO", href: "/produtos?brand=Oppo" },
      { label: "Microsoft", href: "/produtos?brand=Microsoft Surface" },
    ],
    promo: { image: "/images/promo-banner.jpg", href: "/ofertas", title: "Super Ofertas da Semana" },
  },
  { id: "produtos", label: "Produtos", href: "/produtos" },
  {
    id: "categorias",
    label: "Categorias",
    submenu: [
      { label: "Promoções", href: "/ofertas" },
      { label: "Lançamentos", href: "/lancamentos" },
      { label: "Mais vendidos", href: "/mais-vendidos" },
      { label: "Outlet", href: "/outlet" },
      { label: "Novidades", href: "/novidades" },
    ],
  },
  {
    id: "ajuda",
    label: "Atendimento",
    submenu: [
      { label: "Meus Pedidos", href: "/pedidos" },
      { label: "Central de Ajuda", href: "/ajuda" },
      { label: "Políticas", href: "/politicas" },
      { label: "Garantia & Trocas", href: "/garantia" },
    ],
  },
  { id: "novidades", label: "Novidades", href: "/novidades" },
];

const categoryIcons: { [key: string]: React.ElementType } = {
  "Eletrônicos": Monitor,
  "Casa & Cozinha": Home,
  "Moda": Shirt,
  "Beleza": Sparkles,
  "Outros": Box,
};
const mainMenuItemIcons: { [key: string]: React.ElementType } = {
  produtos: Box,
  categorias: LayoutGrid,
  ajuda: HelpCircle,
  novidades: Sparkles,
};

/* ----------------------
  Utilitários
  ---------------------- */

function computeLocalCategoryCounts(products: ProductType[]) {
  return products.reduce<Record<string, number>>((acc, p) => {
    const key = p.category ?? "uncategorized";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function normalizeSlugKey(key?: string) {
  if (!key) return undefined;
  return key.trim();
}

function getNiceLabel(key?: string) {
  if (!key) return "";
  const direct = translations[key as keyof typeof translations];
  if (direct) return direct;
  const replaced = translations[(key.replace(/-/g, " ") as keyof typeof translations)];
  if (replaced) return replaced;
  return key;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  const allProducts = useAppSelector((state) => state.products.items);
  const cartItems = useAppSelector((state) => state.cart.items);
  const favoritesItems = useAppSelector((state) => state.favorites.items);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesItemsCount = favoritesItems.length;

  // MENU com contagens injetadas
  const MENU = useMemo(() => {
    const departmentsItem = BASE_MENU.find(item => item.id === 'departamentos');
    if (!departmentsItem) return BASE_MENU;
    const newColumns = departmentsItem.columns?.map(col => ({
      ...col,
      links: col.links.map(link => {
        const parts = (link.href || "").split('category=');
        const categorySlug = parts.length > 1 ? parts[1] : undefined;
        return {
          ...link,
          count: categorySlug ? (categoryCounts[categorySlug] ?? undefined) : undefined,
        };
      }),
    }));
    return BASE_MENU.map(item => item.id === 'departamentos' ? { ...item, columns: newColumns } : item);
  }, [categoryCounts]);

  // departamentos: seleciona produtos destaque priorizando categorias importantes (ex: laptops)
  const departamentos = useMemo<MenuItem | null>(() => {
    const depMenu = MENU.find((m) => m.id === "departamentos");
    if (!depMenu) return null;

    const priorityCategories = ["laptops", "smartphones", "furniture", "beauty", "fragrances"];

    const pickFromCategory = (cat: string, limit = 2) =>
      allProducts.filter(p => p.category === cat).slice(0, limit);

    const featuredByPriority: ProductType[] = [];
    for (const cat of priorityCategories) {
      const picks = pickFromCategory(cat, 2);
      picks.forEach(p => {
        if (!featuredByPriority.find(fp => fp.id === p.id)) featuredByPriority.push(p);
      });
      if (featuredByPriority.length >= 5) break;
    }

    const fallback = allProducts.slice(0, 5).filter(p => !featuredByPriority.find(fp => fp.id === p.id));

    const featuredProducts = [...featuredByPriority, ...fallback].slice(0, 5).map(p => ({
      ...p,
      seller: { name: (p.brand || "") + " Store" },
      reviewsCount: (p as any).reviewsCount ?? Math.floor(Math.random() * 500),
      discount: (p as any).discount ?? `${Math.round(p.discountPercentage ?? 0)}%`,
      shipment: (p as any).shipment ?? 'Frete grátis',
      originalPrice: (p as any).originalPrice ?? Math.round(p.price * (1 + (p.discountPercentage ?? 0) / 100)),
    }));

    return {
      ...depMenu,
      featured: featuredProducts,
    };
  }, [allProducts, MENU]);

  const destaqueProdutos = departamentos?.featured?.slice(0, 2) || [];
  const promoProdutos = departamentos?.featured?.slice(2, 5) || [];

  useEffect(() => {
    setIsClient(true);

    const fetchInitialData = async () => {
      try {
        if (allProducts.length === 0) {
          const productsFromApi = await getAllProductsData();
          dispatch(setProducts(productsFromApi));
        }

        // tenta buscar contagens do serviço; se falhar, calcula localmente
        try {
          const counts = await getCategoryCounts();
          if (counts && Object.keys(counts).length > 0) {
            setCategoryCounts(counts as Record<string, number>);
          } else {
            setCategoryCounts(computeLocalCategoryCounts(allProducts.length ? allProducts : await getAllProductsData()));
          }
        } catch (err) {
          // fallback local
          setCategoryCounts(computeLocalCategoryCounts(allProducts.length ? allProducts : await getAllProductsData()));
        }
      } catch (e) {
        console.error("Failed to fetch products:", e);
        message.error("Erro ao carregar produtos. Tente novamente mais tarde.");
      }
    };

    fetchInitialData();

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [allProducts.length, dispatch]);

   const handleCartClick = () => {
    dispatch(toggleCart(true));
    if (cartItems.length === 0) {
      // Ajustado para usar notification
      notification.info({
        message: "Seu carrinho está vazio",
        description: "Adicione produtos ao carrinho para continuar.",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput.trim()));
      router.push("/produtos");
      message.info(`Buscando produtos: "${searchInput.trim()}"`);
      setIsMenuOpen(false);
    } else {
      message.warning("Digite algo para buscar. Insira um termo de busca válido.");
    }
  };

  const toggleMobileSection = (index: number) => {
    setMobileOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Logo
              </span>
            </Link>

            <div className="hidden lg:block">
              <nav className="flex items-center gap-2">
                <div
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown("departamentos")}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => setOpenDropdown((s) => (s === "departamentos" ? null : "departamentos"))}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === "departamentos"}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100"
                  >
                    Departamentos
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <div
                    className={`absolute left-0 top-full w-[980px] bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-150 ${openDropdown === "departamentos" ? "opacity-100 pointer-events-auto" : ""}`}
                  >
                    <div className="p-6 grid grid-cols-5 gap-6 items-start">
                      <div className="space-y-3">
                        <h5 className="text-sm font-semibold">Categorias Principais</h5>
                        <ul className="space-y-2">
                          {(departamentos?.columns ?? []).map((col) => {
                            const IconComponent = categoryIcons[col.title] || Box;
                            return (
                              <li key={col.title} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-md bg-slate-50 flex items-center justify-center text-slate-600">
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{col.title}</div>
                                  <div className="text-xs text-muted-foreground">{col.links.length} subcategorias</div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="pt-4">
                          <h6 className="text-xs font-semibold">Marcas populares</h6>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(departamentos?.brands ?? []).map((b) => (
                              <Link key={b.label} href={b.href} className="text-xs px-2 py-1 border rounded-full hover:bg-slate-50">
                                {b.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        {(departamentos?.columns ?? []).map((col) => (
                          <div key={col.title}>
                            <h4 className="font-semibold mb-2">{col.title}</h4>
                            <ul className="space-y-2">
                              {col.links.map((l) => (
                                <li key={l.label}>
                                  <Link href={l.href} className="text-sm hover:text-emerald-600 flex justify-between">
                                    <span>{l.label}</span>
                                    <span className="text-xs text-muted-foreground">{l.count ?? ""}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 col-span-2">
                        <h5 className="text-sm font-semibold">Destaques e Promoções</h5>
                        <div className="space-y-3">
                          <h6 className="text-xs font-semibold">Destaques</h6>
                          {destaqueProdutos.map((p: ProductType) => (
                            <Link key={p.id} href={`/produto/${p.id}`} className="flex gap-3 items-center hover:bg-slate-50 p-2 rounded">
                              <div className="w-16 h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                                <img src={(p as any).images?.[0] || (p as any).thumbnail || (p as any).image} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{p.name}</div>
                                <div className="text-xs text-muted-foreground">R$ {(p.price ?? 0).toFixed(2)}</div>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>{(p.rating ?? 0).toFixed(1)}</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="mt-4">
                          <h6 className="text-xs font-semibold">Promoções</h6>
                          {promoProdutos.length > 0 ? (
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              {promoProdutos.map((p: ProductType) => (
                                <Link key={p.id} href={`/produto/${p.id}`} className="flex flex-col items-center p-2 rounded hover:bg-slate-50">
                                  <div className="w-16 h-16 rounded-md overflow-hidden">
                                    <img src={(p as any).images?.[0] || (p as any).thumbnail || (p as any).image} alt={p.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="text-xs font-medium text-center mt-1 truncate w-full">{p.name}</div>
                                  <div className="text-xs font-bold text-emerald-600">R$ {(p.price ?? 0).toFixed(2)}</div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-2">Nenhuma promoção encontrada.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar produtos, marcas e categorias..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                aria-label="Buscar produtos"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-4">
                {MENU.filter((m) => m.id !== "departamentos").map((item) => {
                  const IconComponent = mainMenuItemIcons[item.id];
                  return (
                    <div
                      key={item.id}
                      className="relative group"
                      onMouseEnter={() => item.submenu && setOpenDropdown(item.id)}
                      onMouseLeave={() => item.submenu && setOpenDropdown(null)}
                    >
                      {item.submenu ? (
                        <>
                          <button
                            onClick={() => setOpenDropdown((s) => (s === item.id ? null : item.id))}
                            className="inline-flex items-center gap-1 text-sm font-medium px-2 py-2 hover:text-emerald-600"
                            aria-haspopup="true"
                            aria-expanded={openDropdown === item.id}
                          >
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {item.label}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <div
                            className={`absolute left-0 top-full w-48 bg-white border border-slate-200 rounded-md shadow-md opacity-0 pointer-events-none transition-opacity duration-150 ${openDropdown === item.id ? "opacity-100 pointer-events-auto" : ""}`}
                          >
                            <ul className="p-2">
                              {item.submenu?.map((s) => (
                                <li key={s.label}>
                                  <Link
                                    href={s.href}
                                    className="block px-3 py-2 text-sm hover:bg-slate-50"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    {s.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <Link href={item.href || "/"} className="inline-flex items-center gap-1 text-sm font-medium hover:text-emerald-600">
                          {IconComponent && <IconComponent className="w-4 h-4" />}
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Favorites */}
              <Button variant="ghost" size="icon" asChild className="hover:bg-emerald-50 hover:text-emerald-600">
                <Link href="/favoritos" className="relative">
                  <Heart className="w-5 h-5" />
                  {isClient && favoritesItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {favoritesItemsCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCartClick}
                className="relative hover:bg-emerald-50 hover:text-emerald-600"
                aria-label="Abrir carrinho"
              >
                <ShoppingCart className="w-5 h-5" />
                {isClient && cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <UserMenu />
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-emerald-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu (off-canvas) */}
        <div
          className={`fixed left-0 top-0 w-full h-[100svh] bg-white z-50 transition-transform duration-300 md:hidden ${isMenuOpen ? "transform-none" : "transform -translate-x-full"
            }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between h-16 border-b border-slate-200 px-4">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Logo
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Conteúdo do Menu */}
          <div className="p-4 overflow-y-auto h-[calc(100svh-4rem)]">
            {/* Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                />
              </form>
            </div>

            {/* Mobile nav com acordeão */}
            <nav className="space-y-2">
              {MENU.map((item, idx) => {
                const IconComponent = mainMenuItemIcons[item.id];
                return (
                  <div key={item.id} className="border-b border-slate-100 pb-2">
                    {item.megamenu || item.submenu ? (
                      <div>
                        <button
                          className="w-full flex items-center justify-between py-3 px-2"
                          onClick={() => toggleMobileSection(idx)}
                          aria-expanded={mobileOpenIndex === idx}
                        >
                          <span className="font-medium inline-flex items-center gap-2">
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {item.label}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenIndex === idx ? "-rotate-180" : ""}`} />
                        </button>

                        <div className={`overflow-hidden transition-max-height duration-300 ${mobileOpenIndex === idx ? "max-h-[800px]" : "max-h-0"}`}>
                          <div className="p-2 grid grid-cols-1 gap-2">
                            {(item.columns ?? []).map((col) => {
                              const NestedIconComponent = categoryIcons[col.title] || Box;
                              return (
                                <div key={col.title}>
                                  <h5 className="font-semibold mb-2 inline-flex items-center gap-2">
                                    <NestedIconComponent className="w-4 h-4 text-slate-600" />
                                    {col.title}
                                  </h5>
                                  <ul className="space-y-1">
                                    {col.links.map((l) => (
                                      <li key={l.label}>
                                        <Link href={l.href} className="block py-1 px-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                                          {l.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}

                            {item.submenu && (
                              <ul className="space-y-1">
                                {item.submenu.map((s) => (
                                  <li key={s.label}>
                                    <Link href={s.href} className="block py-1 px-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                                      {s.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {destaqueProdutos.length > 0 && (
                              <div className="pt-2">
                                <h5 className="font-semibold">Destaques</h5>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {destaqueProdutos.map((p: ProductType) => (
                                    <Link key={p.id} href={`/produto/${p.id}`} className="flex flex-col text-sm" onClick={() => setIsMenuOpen(false)}>
                                      <div className="w-full h-20 bg-slate-100 rounded overflow-hidden mb-1">
                                        <img src={(p as any).images?.[0] || (p as any).thumbnail || (p as any).image} alt={p.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="font-medium">{p.name}</div>
                                      <div className="text-xs text-muted-foreground">R$ {(p.price ?? 0).toFixed(2)}</div>
                                      <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>{(p.rating ?? 0).toFixed(1)}</span>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link href={item.href || "/"} className=" py-3 px-2 font-medium inline-flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}

              <div className="mt-2 px-2">
                <Link href="/favoritos" className="flex items-center gap-2 py-2 px-2" onClick={() => setIsMenuOpen(false)}>
                  <Heart className="w-5 h-5" /> Favoritos ({favoritesItemsCount})
                </Link>

                <button
                  onClick={() => { handleCartClick(); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 py-2 px-2 w-full text-left"
                >
                  <ShoppingCart className="w-5 h-5" /> Carrinho ({cartItemsCount})
                </button>

                <div className="pt-4">
                  <UserMenu />
                </div>
              </div>
            </nav>
          </div>
        </div>
        {isMenuOpen && <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
      </div>
    </header>
  );
}
