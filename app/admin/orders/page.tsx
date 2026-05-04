import { AuthGuard } from "@/components/auth-guard"
import { AdminOrderList } from "@/components/admin-order-list"

export default function AdminOrdersPage() {
  return (
    <AuthGuard requiredRole="owner">
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Order Management</h1>
              <div className="flex items-center gap-4">
                <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                  ← Back to Dashboard
                </a>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto p-6">
          <AdminOrderList />
        </div>
      </div>
    </AuthGuard>
  )
}
