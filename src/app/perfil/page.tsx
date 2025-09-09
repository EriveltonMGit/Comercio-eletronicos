"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "../../components/layout/header"
import { ProfileForm } from "../../components/auth/profile-form"
import { useAppSelector } from "../../lib/hooks"

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-muted-foreground">Redirecionando...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
          </div>
          <ProfileForm />
        </div>
      </main>
    </div>
  )
}
