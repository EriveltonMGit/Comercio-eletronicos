"use client"

import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { CheckCircle, Heart, ShoppingCart } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  type: "cart" | "favorites"
  productName: string
}

export function ConfirmationModal({ isOpen, onClose, type, productName }: ConfirmationModalProps) {
  const router = useRouter()

  const handleContinueShopping = () => {
    onClose()
  }

  const handleGoToDestination = () => {
    onClose()
    if (type === "cart") {
      // Cart will be opened via Redux state
    } else {
      router.push("/favoritos")
    }
  }

  const isCart = type === "cart"
  const Icon = isCart ? ShoppingCart : Heart
  const title = isCart ? "Produto Adicionado ao Carrinho!" : "Produto Adicionado aos Favoritos!"
  const description = isCart
    ? `"${productName}" foi adicionado ao seu carrinho.`
    : `"${productName}" foi adicionado aos seus favoritos.`
  const actionText = isCart ? "Ver Carrinho" : "Ver Favoritos"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center ">
          <div className="mx-auto  mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleContinueShopping} className="flex-1 bg-transparent">
            Continuar Comprando
          </Button>
          <Button onClick={handleGoToDestination} className="flex-1">
            <Icon className="w-4 h-4 mr-2" />
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
