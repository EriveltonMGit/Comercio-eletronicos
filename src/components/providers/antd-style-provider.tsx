// src/components/providers/antd-style-provider.tsx
"use client"

import React from "react"
import { App } from "antd"

export function AntdStyleProvider({ children }: { children: React.ReactNode }) {
  return (
    // O componente App agora lida com a injeção de estilo.
    // Nada mais precisa ser importado aqui.
    <App>
      {children}
    </App>
  )
}