import { AuthGuard } from "@/components/auth-guard"
import { CartItems } from "@/components/cart-items"
import { ShoppingHeader } from "@/components/shopping-header"

export default function CartPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ShoppingHeader />
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
          <CartItems />
        </div>
      </div>
    </AuthGuard>
  )
}
