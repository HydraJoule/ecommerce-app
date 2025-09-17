import { AuthGuard } from "@/components/auth-guard"
import { OrderList } from "@/components/order-list"
import { ShoppingHeader } from "@/components/shopping-header"

export default function OrdersPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ShoppingHeader />
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>
          <OrderList />
        </div>
      </div>
    </AuthGuard>
  )
}
