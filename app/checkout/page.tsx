import { AuthGuard } from "@/components/auth-guard"
import { CheckoutForm } from "@/components/checkout-form"
import { ShoppingHeader } from "@/components/shopping-header"

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ShoppingHeader />
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <CheckoutForm />
        </div>
      </div>
    </AuthGuard>
  )
}
