import { AuthGuard } from "@/components/auth-guard"
import { OrderDetails } from "@/components/order-details"
import { ShoppingHeader } from "@/components/shopping-header"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ShoppingHeader />
        <div className="container mx-auto p-6">
          <OrderDetails orderId={id} />
        </div>
      </div>
    </AuthGuard>
  )
}
