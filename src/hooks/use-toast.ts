"use client"

import { useAppDispatch } from "../lib/hooks"
import { addToast, type Toast } from "../lib/features/toast/toastSlice"

export function useToast() {
  const dispatch = useAppDispatch()

  const toast = (toastData: Omit<Toast, "id">) => {
    dispatch(addToast(toastData))
  }

  const success = (title: string, description?: string) => {
    toast({ type: "success", title, description })
  }

  const error = (title: string, description?: string) => {
    toast({ type: "error", title, description })
  }

  const warning = (title: string, description?: string) => {
    toast({ type: "warning", title, description })
  }

  const info = (title: string, description?: string) => {
    toast({ type: "info", title, description })
  }

  return { toast, success, error, warning, info }
}
