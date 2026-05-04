import { AuthGuard } from "@/components/auth-guard"
import { ProductForm } from "@/components/product-form"

export default function NewProductPage() {
  return (
    <AuthGuard requiredRole="owner">
      <div className="container mx-auto p-6">
        <ProductForm />
      </div>
    </AuthGuard>
  )
}
