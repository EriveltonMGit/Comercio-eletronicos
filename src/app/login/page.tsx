
import Header from "@/src/components/layout/header"
import { LoginForm } from "../../components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <LoginForm />

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Credenciais de Demonstração:</h3>
            <p className="text-sm text-muted-foreground">
              <strong>E-mail:</strong> user@example.com
              <br />
              <strong>Senha:</strong> password
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
