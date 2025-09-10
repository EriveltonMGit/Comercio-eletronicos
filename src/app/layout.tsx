// src/app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "../components/providers/redux-provider"
import { Suspense } from "react"
import "./globals.css"
import { AntdStyleProvider } from "../components/providers/antd-style-provider"

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
            {/* O AntdStyleProvider deve envolver o {children} */}
            <AntdStyleProvider>
              {children}
            </AntdStyleProvider>
          </ReduxProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}