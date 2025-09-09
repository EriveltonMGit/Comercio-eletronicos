import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl">Store</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Sua loja online de confiança com os melhores produtos e preços do mercado. Qualidade garantida e entrega
              rápida em todo o Brasil.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-emerald-400">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/produtos" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Ofertas Especiais
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Meus Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-emerald-400">Atendimento</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ajuda" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/trocas" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/entrega" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Política de Entrega
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-emerald-400">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-sm">(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-sm">contato@estore.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-sm">São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2024 E-Store. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/termos" className="text-slate-400 hover:text-white transition-colors text-sm">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-slate-400 hover:text-white transition-colors text-sm">
                Privacidade
              </Link>
              <Link href="/cookies" className="text-slate-400 hover:text-white transition-colors text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
