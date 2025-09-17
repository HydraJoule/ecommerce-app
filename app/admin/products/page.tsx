import { AuthGuard } from "@/components/auth-guard"
import { ProductList } from "@/components/product-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminProductsPage() {
  return (
    <AuthGuard requiredRole="owner">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Button asChild>
            <Link href="/admin/products/new">Add New Product</Link>
          </Button>
        </div>
        <ProductList isAdmin={true} />
      </div>
    </AuthGuard>
  )
}
