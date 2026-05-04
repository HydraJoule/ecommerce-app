import { AuthGuard } from "@/components/auth-guard"
import { ProductEditForm } from "@/components/product-edit-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  return (
    <AuthGuard requiredRole="owner">
      <div className="container mx-auto p-6">
        <ProductEditForm productId={id} />
      </div>
    </AuthGuard>
  )
}
