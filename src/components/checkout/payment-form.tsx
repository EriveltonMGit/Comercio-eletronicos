"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { setPaymentMethod, setCurrentStep } from "../../lib/features/checkout/checkoutSlice"
import { CreditCard, Smartphone, FileText, DollarSign } from "lucide-react"

export function PaymentForm() {
  const dispatch = useAppDispatch()
  const { paymentMethod } = useAppSelector((state) => state.checkout)
  const cartTotal = useAppSelector((state) => state.cart.total)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePaymentTypeChange = (type: "credit" | "debit" | "pix" | "boleto") => {
    dispatch(setPaymentMethod({ type, installments: type === "credit" ? 1 : undefined }))
    setErrors({})
  }

  const handleInputChange = (field: string, value: string) => {
    dispatch(setPaymentMethod({ [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateCardForm = () => {
    const newErrors: Record<string, string> = {}

    if (!paymentMethod.cardNumber?.trim()) newErrors.cardNumber = "Número do cartão é obrigatório"
    if (!paymentMethod.cardName?.trim()) newErrors.cardName = "Nome no cartão é obrigatório"
    if (!paymentMethod.expiryDate?.trim()) newErrors.expiryDate = "Data de validade é obrigatória"
    if (!paymentMethod.cvv?.trim()) newErrors.cvv = "CVV é obrigatório"

    // Card number validation (basic)
    if (paymentMethod.cardNumber && paymentMethod.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Número do cartão deve ter 16 dígitos"
    }

    // Expiry date validation
    if (paymentMethod.expiryDate && !/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) {
      newErrors.expiryDate = "Data deve estar no formato MM/AA"
    }

    // CVV validation
    if (paymentMethod.cvv && !/^\d{3,4}$/.test(paymentMethod.cvv)) {
      newErrors.cvv = "CVV deve ter 3 ou 4 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (paymentMethod.type === "credit" || paymentMethod.type === "debit") {
      if (validateCardForm()) {
        dispatch(setCurrentStep(4))
      }
    } else {
      dispatch(setCurrentStep(4))
    }
  }

  const handleBack = () => {
    dispatch(setCurrentStep(2))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const installmentOptions = []
  for (let i = 1; i <= 12; i++) {
    const installmentValue = cartTotal / i
    installmentOptions.push({
      value: i,
      label:
        i === 1
          ? `À vista - R$ ${cartTotal.toFixed(2)}`
          : `${i}x de R$ ${installmentValue.toFixed(2)} ${i <= 6 ? "sem juros" : "com juros"}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Forma de Pagamento
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <RadioGroup
          value={paymentMethod.type}
          onValueChange={handlePaymentTypeChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Cartão de Crédito</span>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="debit" id="debit" />
            <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer">
              <DollarSign className="w-4 h-4 text-primary" />
              <span>Cartão de Débito</span>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="pix" id="pix" />
            <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>PIX</span>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="boleto" id="boleto" />
            <Label htmlFor="boleto" className="flex items-center gap-2 cursor-pointer">
              <FileText className="w-4 h-4 text-primary" />
              <span>Boleto Bancário</span>
            </Label>
          </div>
        </RadioGroup>

        {(paymentMethod.type === "credit" || paymentMethod.type === "debit") && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <h3 className="font-semibold text-foreground">Dados do Cartão</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão *</Label>
                <Input
                  id="cardNumber"
                  value={paymentMethod.cardNumber || ""}
                  onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                  className={errors.cardNumber ? "border-destructive" : ""}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
                {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Nome no Cartão *</Label>
                <Input
                  id="cardName"
                  value={paymentMethod.cardName || ""}
                  onChange={(e) => handleInputChange("cardName", e.target.value.toUpperCase())}
                  className={errors.cardName ? "border-destructive" : ""}
                  placeholder="NOME COMO NO CARTÃO"
                />
                {errors.cardName && <p className="text-sm text-destructive">{errors.cardName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Validade *</Label>
                  <Input
                    id="expiryDate"
                    value={paymentMethod.expiryDate || ""}
                    onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                    className={errors.expiryDate ? "border-destructive" : ""}
                    placeholder="MM/AA"
                    maxLength={5}
                  />
                  {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    value={paymentMethod.cvv || ""}
                    onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                    className={errors.cvv ? "border-destructive" : ""}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                </div>
              </div>

              {paymentMethod.type === "credit" && (
                <div className="space-y-2">
                  <Label htmlFor="installments">Parcelamento</Label>
                  <Select
                    value={paymentMethod.installments?.toString() || "1"}
                    onValueChange={(value) => handleInputChange("installments", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {installmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}

        {paymentMethod.type === "pix" && (
          <div className="p-4 border rounded-lg bg-muted/20">
            <h3 className="font-semibold text-foreground mb-2">PIX</h3>
            <p className="text-sm text-muted-foreground">
              Após confirmar o pedido, você receberá um código PIX para pagamento. O pagamento deve ser realizado em até
              30 minutos.
            </p>
          </div>
        )}

        {paymentMethod.type === "boleto" && (
          <div className="p-4 border rounded-lg bg-muted/20">
            <h3 className="font-semibold text-foreground mb-2">Boleto Bancário</h3>
            <p className="text-sm text-muted-foreground">
              Após confirmar o pedido, você receberá um boleto para pagamento. O prazo de vencimento é de 3 dias úteis.
            </p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            Voltar
          </Button>
          <Button onClick={handleContinue}>Revisar Pedido</Button>
        </div>
      </CardContent>
    </Card>
  )
}
