import { AuthGuard } from "@/components/auth-guard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <AuthGuard requiredRole="owner">
      <AdminDashboard />
    </AuthGuard>
  )
}
