"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { useToast } from "../../hooks/use-toast"
import { toggleCart } from "../../lib/features/cart/cartSlice"
import { setSearchQuery } from "../../lib/features/products/productsSlice"
import { UserMenu } from "./user-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  const cartItems = useAppSelector((state) => state.cart.items)
  const favoritesItems = useAppSelector((state) => state.favorites.items)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { info } = useToast()

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCartClick = () => {
    dispatch(toggleCart())
    if (cartItemsCount === 0) {
      info("Carrinho vazio", "Adicione produtos ao carrinho para continuar")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput.trim()))
      router.push("/produtos")
      info("Buscando produtos", `Resultados para: "${searchInput.trim()}"`)
      setIsMenuOpen(false)
    } else {
      info("Digite algo para buscar", "Insira um termo de busca válido")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white to-slate-50 border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Logo
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
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

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/produtos" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
              Produtos
            </Link>
            <Link href="/categorias" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
              Categorias
            </Link>
            <Link href="/ofertas" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
              Ofertas
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Favorites */}
            <Button variant="ghost" size="icon" asChild className="hover:bg-emerald-50 hover:text-emerald-600">
              <Link href="/favoritos" className="relative">
                <Heart className="w-5 h-5" />
                {favoritesItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {favoritesItems.length}
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
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-emerald-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 bg-gradient-to-r from-white to-slate-50">
            {/* Mobile Search */}
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

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link
                href="/produtos"
                className="text-slate-700 hover:text-emerald-600 transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Produtos
              </Link>
              <Link
                href="/categorias"
                className="text-slate-700 hover:text-emerald-600 transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorias
              </Link>
              <Link
                href="/ofertas"
                className="text-slate-700 hover:text-emerald-600 transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Ofertas
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
