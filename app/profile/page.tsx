import { AuthGuard } from "@/components/auth-guard"
import { UserProfile } from "@/components/user-profile"
import { ShoppingHeader } from "@/components/shopping-header"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ShoppingHeader />
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <UserProfile />
        </div>
      </div>
    </AuthGuard>
  )
}
