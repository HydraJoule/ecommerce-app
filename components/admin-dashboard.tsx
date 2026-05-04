"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Package, ShoppingCart, DollarSign, Users, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

interface RecentOrder {
  id: string
  total_amount: number
  status: string
  created_at: string
  customer: {
    full_name: string
    email: string
  }
}

const statusColors = {
  pending: "default",
  processing: "secondary",
  shipped: "outline",
  delivered: "default",
  cancelled: "destructive",
} as const

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null)
        console.log("[v0] Starting dashboard data fetch")

        // Fetch products count
        const { count: productsCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        if (productsError) {
          console.log("[v0] Products count error:", productsError)
          throw productsError
        }

        console.log("[v0] Products count:", productsCount)

        // Fetch orders data
        const { data: orders, error: ordersError } = await supabase.from("orders").select("total_amount, status")

        if (ordersError) {
          console.log("[v0] Orders error:", ordersError)
          throw ordersError
        }

        console.log("[v0] Orders data:", orders)

        const totalOrders = orders?.length || 0
        const totalRevenue =
          orders?.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.total_amount, 0) ||
          0
        const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0

        setStats({
          totalProducts: productsCount || 0,
          totalOrders,
          totalRevenue,
          pendingOrders,
        })

        // Fetch recent orders with customer data
        const { data: recentOrdersData, error: recentOrdersError } = await supabase
          .from("orders")
          .select(`
            id,
            total_amount,
            status,
            created_at,
            customer_id,
            profiles!customer_id (
              full_name,
              email
            )
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        if (recentOrdersError) {
          console.log("[v0] Recent orders error:", recentOrdersError)
          throw recentOrdersError
        }

        const transformedOrders = (recentOrdersData || []).map((order) => {
          const profileData = order.profiles
          const customerData = Array.isArray(profileData) ? profileData[0] : profileData

          return {
            id: order.id,
            total_amount: order.total_amount,
            status: order.status,
            created_at: order.created_at,
            customer: {
              full_name: customerData?.full_name || "Unknown Customer",
              email: customerData?.email || "No email",
            },
          }
        })

        setRecentOrders(transformedOrders)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(error instanceof Error ? error.message : "Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  const handleSignOut = async () => {
  await fetch("/api/auth/signout", { method: "POST" })
  router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading dashboard: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                {/* <Link href="/shop">View Store</Link> */}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button asChild size="lg" className="h-20">
            <Link href="/admin/products" className="flex flex-col gap-2">
              <Package className="h-6 w-6" />
              Manage Products
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-20 bg-transparent">
            <Link href="/admin/orders" className="flex flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              View Orders
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="h-20">
            <Link href="/admin/products/new" className="flex flex-col gap-2">
              <Package className="h-6 w-6" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Orders</CardTitle>
              <Button asChild variant="outline" size="sm" className="bg-transparent">
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer?.full_name || "Unknown Customer"} ({order.customer?.email || "No email"})
                      </p>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total_amount.toFixed(2)}</p>
                      <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
