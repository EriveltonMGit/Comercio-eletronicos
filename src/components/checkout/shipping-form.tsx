// src/components/checkout/shipping-form.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useAppSelector, useAppDispatch } from "../../lib/hooks"
import { setShippingAddress, setCurrentStep } from "../../lib/features/checkout/checkoutSlice"
import { User, Mail, Phone, MapPin, ArrowRight } from "lucide-react"

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]

export function ShippingForm() {
  const dispatch = useAppDispatch()
  const { shippingAddress } = useAppSelector((state) => state.checkout)
  const user = useAppSelector((state) => state.auth.user)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof typeof shippingAddress, value: string) => {
    dispatch(setShippingAddress({ [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!shippingAddress.firstName?.trim()) newErrors.firstName = "Nome é obrigatório"
    if (!shippingAddress.lastName?.trim()) newErrors.lastName = "Sobrenome é obrigatório"
    if (!shippingAddress.email?.trim()) newErrors.email = "E-mail é obrigatório"
    if (!shippingAddress.phone?.trim()) newErrors.phone = "Telefone é obrigatório"
    if (!shippingAddress.address?.trim()) newErrors.address = "Endereço é obrigatório"
    if (!shippingAddress.city?.trim()) newErrors.city = "Cidade é obrigatória"
    if (!shippingAddress.state) newErrors.state = "Estado é obrigatório"
    if (!shippingAddress.zipCode?.trim()) newErrors.zipCode = "CEP é obrigatório"

    if (shippingAddress.email && !/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      newErrors.email = "E-mail inválido"
    }
    if (shippingAddress.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(shippingAddress.phone)) {
      newErrors.phone = "Telefone deve estar no formato (11) 99999-9999"
    }
    if (shippingAddress.zipCode && !/^\d{5}-?\d{3}$/.test(shippingAddress.zipCode)) {
      newErrors.zipCode = "CEP deve estar no formato 00000-000"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      dispatch(setCurrentStep(2))
    }
  }

  const handleFillUserData = () => {
    if (user) {
      dispatch(
        setShippingAddress({
          firstName: user.name.split(" ")[0] || "",
          lastName: user.name.split(" ").slice(1).join(" ") || "",
          email: user.email,
        }),
      )
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <CardHeader className="p-0 mb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Endereço de Entrega
          </CardTitle>
          {user && (
            <Button variant="outline" size="sm" onClick={handleFillUserData} className="bg-white">
              Usar dados da conta
            </Button>
          )}
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                value={shippingAddress.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`bg-white ${errors.firstName ? "border-destructive" : ""}`}
                placeholder="Seu nome"
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome *</Label>
              <Input
                id="lastName"
                value={shippingAddress.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`bg-white ${errors.lastName ? "border-destructive" : ""}`}
                placeholder="Seu sobrenome"
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={shippingAddress.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`bg-white ${errors.email ? "border-destructive" : ""}`}
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={shippingAddress.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`bg-white ${errors.phone ? "border-destructive" : ""}`}
                placeholder="(11) 99999-9999"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo *</Label>
            <Input
              id="address"
              value={shippingAddress.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={`bg-white ${errors.address ? "border-destructive" : ""}`}
              placeholder="Rua, número, complemento"
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={shippingAddress.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`bg-white ${errors.city ? "border-destructive" : ""}`}
                placeholder="Sua cidade"
              />
              {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Select value={shippingAddress.state} onValueChange={(value) => handleInputChange("state", value)}>
                <SelectTrigger className={`bg-white ${errors.state ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {brazilianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                value={shippingAddress.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className={`bg-white ${errors.zipCode ? "border-destructive" : ""}`}
                placeholder="00000-000"
              />
              {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-6">
          <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Continuar para Entrega
          </Button>
        </div>
      </form>
    </div>
  )
}