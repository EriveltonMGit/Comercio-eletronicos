// src/app/ajuda/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Componentes UI
import Header from "../../components/layout/header";
import { Footer } from "../../components/layout/footer";
import { CartSidebar } from "../../components/cart/cart-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";

// Esqueletos
import { HelpPageSkeleton } from "../../components/skeletons/help-page-skeleton";

// Ícones
import { HelpCircle, ChevronDown, Headphones, MessageSquare, Phone, MapPin, Package, Shield, CreditCard, RefreshCw } from "lucide-react";

// Dados de FAQ simulados
const faqs = [
    {
        id: 1,
        category: "Pedido e Entrega",
        question: "Como posso rastrear meu pedido?",
        answer: "Você pode rastrear seu pedido acessando a seção 'Meus Pedidos' em sua conta. Lá, você encontrará o status atual e um link direto para o rastreamento do envio, que é atualizado em tempo real pela transportadora.",
    },
    {
        id: 2,
        category: "Pagamento e Cobrança",
        question: "Quais são as formas de pagamento aceitas?",
        answer: "Aceitamos diversas formas de pagamento, incluindo cartões de crédito (Visa, Mastercard, Amex, Elo), PIX e boleto bancário. Para pagamentos com cartão, você pode parcelar sua compra em até 12x sem juros.",
    },
    {
        id: 3,
        category: "Trocas e Devoluções",
        question: "Qual é a política de troca e devolução?",
        answer: "Nossa política permite trocas e devoluções em até 30 dias corridos após o recebimento do produto, caso ele apresente defeito ou você não esteja satisfeito. O processo é simples: entre em contato conosco e nossa equipe irá orientá-lo.",
    },
    {
        id: 4,
        category: "Contato e Suporte",
        question: "Como entrar em contato com o suporte ao cliente?",
        answer: "Você pode nos contatar por telefone, e-mail ou chat online. Todas as informações de contato estão disponíveis nesta página, na seção 'Ainda precisa de ajuda?'. Nosso tempo de resposta é de até 24h úteis.",
    },
    {
        id: 5,
        category: "Pedido e Entrega",
        question: "Qual o prazo de entrega para meu endereço?",
        answer: "O prazo de entrega varia de acordo com a sua localização e o tipo de frete selecionado. Você pode calcular o prazo exato inserindo seu CEP na página do produto ou no carrinho de compras.",
    },
    {
        id: 6,
        category: "Pagamento e Cobrança",
        question: "É seguro comprar com cartão de crédito no site?",
        answer: "Sim, é totalmente seguro. Todas as transações são processadas por uma plataforma de pagamento certificada e utilizamos criptografia SSL para proteger seus dados pessoais e financeiros.",
    },
    {
        id: 7,
        category: "Trocas e Devoluções",
        question: "Posso trocar um produto que já usei?",
        answer: "Não, infelizmente. Produtos para troca ou devolução devem estar em sua embalagem original, sem sinais de uso e com todas as etiquetas intactas. Em caso de defeito, a regra pode variar. Consulte nossa política completa para mais informações.",
    },
];

export default function HelpPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const toggleFaq = (id: number) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <CartSidebar />

            {isLoading ? (
                <HelpPageSkeleton />
            ) : (
                <main className="container mx-auto px-4 py-8 lg:py-16">
                    {/* Seção de Hero */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 text-slate-800 mb-2">
                            <Image src="/icons/help.gif" alt="Ícone de Ajuda" width={40} height={40} className="w-10 h-10" />
                            <h1 className="text-2xl md:text-3xl font-bold">Central de Ajuda</h1>
                        </div>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Tire suas dúvidas rapidamente com nossa seção de perguntas frequentes e encontre a melhor forma de falar com nosso time de suporte.
                        </p>
                    </div>

                    <Separator className="my-12" />

                    {/* Seção de FAQs */}
                    <section className="max-w-4xl mx-auto mb-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Perguntas Frequentes por Tópico</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Categoria: Pedido e Entrega */}
                            <div>
                                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-emerald-600">
                                    <Package size={20} /> Pedido e Entrega
                                </h3>
                                <div className="space-y-4">
                                    {faqs.filter(faq => faq.category === "Pedido e Entrega").map((faq) => (
                                        <Card key={faq.id} className="rounded-xl shadow-sm border-slate-200">
                                            <button
                                                onClick={() => toggleFaq(faq.id)}
                                                className="w-full flex justify-between items-center p-6 text-left"
                                                aria-expanded={expandedFaq === faq.id}
                                            >
                                                <span className="font-semibold text-lg text-slate-800">{faq.question}</span>
                                                <ChevronDown className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <CardContent className="pt-0 px-6 pb-6 text-slate-600">
                                                    {faq.answer}
                                                    {faq.id === 1 && (
                                                        <div className="mt-4">
                                                            <Link href="/pedidos" passHref>
                                                                <Button variant="outline">Ir para Meus Pedidos</Button>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Categoria: Pagamento e Cobrança */}
                            <div>
                                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-blue-600">
                                    <CreditCard size={20} /> Pagamento e Cobrança
                                </h3>
                                <div className="space-y-4">
                                    {faqs.filter(faq => faq.category === "Pagamento e Cobrança").map((faq) => (
                                        <Card key={faq.id} className="rounded-xl shadow-sm border-slate-200">
                                            <button
                                                onClick={() => toggleFaq(faq.id)}
                                                className="w-full flex justify-between items-center p-6 text-left"
                                                aria-expanded={expandedFaq === faq.id}
                                            >
                                                <span className="font-semibold text-lg text-slate-800">{faq.question}</span>
                                                <ChevronDown className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <CardContent className="pt-0 px-6 pb-6 text-slate-600">
                                                    {faq.answer}
                                                </CardContent>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Categoria: Trocas e Devoluções */}
                            <div>
                                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-purple-600">
                                    <RefreshCw size={20} /> Trocas e Devoluções
                                </h3>
                                <div className="space-y-4">
                                    {faqs.filter(faq => faq.category === "Trocas e Devoluções").map((faq) => (
                                        <Card key={faq.id} className="rounded-xl shadow-sm border-slate-200">
                                            <button
                                                onClick={() => toggleFaq(faq.id)}
                                                className="w-full flex justify-between items-center p-6 text-left"
                                                aria-expanded={expandedFaq === faq.id}
                                            >
                                                <span className="font-semibold text-lg text-slate-800">{faq.question}</span>
                                                <ChevronDown className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <CardContent className="pt-0 px-6 pb-6 text-slate-600">
                                                    {faq.answer}
                                                </CardContent>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Categoria: Contato e Suporte */}
                            <div>
                                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-orange-600">
                                    <MessageSquare size={20} /> Contato e Suporte
                                </h3>
                                <div className="space-y-4">
                                    {faqs.filter(faq => faq.category === "Contato e Suporte").map((faq) => (
                                        <Card key={faq.id} className="rounded-xl shadow-sm border-slate-200">
                                            <button
                                                onClick={() => toggleFaq(faq.id)}
                                                className="w-full flex justify-between items-center p-6 text-left"
                                                aria-expanded={expandedFaq === faq.id}
                                            >
                                                <span className="font-semibold text-lg text-slate-800">{faq.question}</span>
                                                <ChevronDown className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <CardContent className="pt-0 px-6 pb-6 text-slate-600">
                                                    {faq.answer}
                                                </CardContent>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <Separator className="my-12" />

                    {/* Seção de Contato */}
                    <section className="text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Ainda precisa de ajuda?</h2>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                            Se as perguntas acima não resolveram sua questão, entre em contato diretamente com nossa equipe de suporte. Estamos prontos para ajudá-lo!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <Card className="p-6 text-left rounded-xl shadow-md border-slate-200 transition-transform duration-300 hover:scale-105">
                                <CardHeader className="p-0 mb-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
                                        <Headphones className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">Chat Online</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 text-slate-600">
                                    <p>Converse com um de nossos atendentes em tempo real. Disponível de segunda a sexta, das 9h às 18h.</p>
                                    <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">
                                        Iniciar Chat
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="p-6 text-left rounded-xl shadow-md border-slate-200 transition-transform duration-300 hover:scale-105">
                                <CardHeader className="p-0 mb-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">Envie um E-mail</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 text-slate-600">
                                    <p>Envie-nos sua dúvida e responderemos sua solicitação em até 24h úteis.</p>
                                    <Button className="mt-4 w-full" variant="outline">
                                        Enviar E-mail
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="p-6 text-left rounded-xl shadow-md border-slate-200 transition-transform duration-300 hover:scale-105">
                                <CardHeader className="p-0 mb-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-50 text-purple-600 mb-2">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">Ligue para nós</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 text-slate-600">
                                    <p>Fale diretamente com nossa equipe. Horário de atendimento: Segunda a Sexta, das 9h às 18h.</p>
                                    <Button className="mt-4 w-full" variant="outline">
                                        (11) 99999-9999
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </main>
            )}
            <Footer />
        </div>
    );
}