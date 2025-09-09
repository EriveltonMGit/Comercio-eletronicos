// src/components/ui/toast.tsx
"use client";

import React from "react";

/**
 * Tipos exportados que outros módulos (use-toast.ts, toaster.tsx) importam.
 */
export type ToastActionElement = React.ReactNode;

export interface ToastProps {
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
  // permite que você passe qualquer outra prop de HTML se precisar
  [key: string]: any;
}

/**
 * Contexto simples para permitir que <ToastClose /> invoque o onOpenChange do Toast pai.
 */
const ToastContext = React.createContext<{ onOpenChange?: (open: boolean) => void } | null>(null);

/**
 * Toast — wrapper que fornece o contexto para ToastClose e exibe o conteúdo.
 * Mantemos a API mínima para compatibilidade com seu `toaster.tsx`.
 */
export const Toast: React.FC<ToastProps> = ({ children, onOpenChange, className, ...rest }) => {
  return (
    <ToastContext.Provider value={{ onOpenChange }}>
      <div
        role="status"
        aria-live="polite"
        className={className}
        {...rest}
      >
        {children}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * ToastClose — botão que fecha o toast chamando onOpenChange(false) se existir.
 */
export const ToastClose: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  const ctx = React.useContext(ToastContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    ctx?.onOpenChange?.(false);
    if (props.onClick) props.onClick(e);
  };

  return (
    <button aria-label="fechar toast" {...props} onClick={handleClick}>
      {children ?? "×"}
    </button>
  );
};

/**
 * Títulos / descrições simples — estilize com classes conforme seu design (Tailwind).
 */
export const ToastTitle: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="font-medium">{children}</div>
);

export const ToastDescription: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="text-sm opacity-90 mt-1">{children}</div>
);

/**
 * Viewport — container onde os toasts podem ser renderizados.
 * Se você já tem um ToastProvider Redux que renderiza toasts, mantenha como wrapper neutro.
 */
export const ToastViewport: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props} className={`fixed top-4 right-4 z-50 space-y-2 max-w-sm ${props.className ?? ""}`}>
    {children}
  </div>
);

/**
 * ToastProvider — wrapper que aceita children (tipado corretamente)
 * (mantém API compatível com o que Toaster está usando)
 */
export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};
