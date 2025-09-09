import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "../components/providers/redux-provider"
import { ToastProvider } from "../components/ui/toast"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "E-commerce Store",
  description: "Sistema completo de e-commerce com carrinho, favoritos e checkout",
  generator: "e-comerce",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ReduxProvider>
            {children}
            <ToastProvider />
          </ReduxProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
