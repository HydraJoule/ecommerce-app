"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  stock_quantity: number
  category: string
  is_active: boolean
  created_at: string
}

interface ProductListProps {
  isAdmin?: boolean
  category?: string
}

export function ProductList({ isAdmin = false, category }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = supabase.from("products").select("*").order("created_at", { ascending: false })

        if (!isAdmin) {
          query = query.eq("is_active", true)
        }

        if (category && category !== "Other") {
          query = query.ilike("category", category)
        }

        const { data, error } = await query

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [supabase, isAdmin, category])

  const addToCart = async (productId: string) => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single()

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id)
        if (error) throw error
      } else {
        // Add new item
        const { error } = await supabase.from("cart_items").insert([
          {
            user_id: user.id,
            product_id: productId,
            quantity: 1,
          },
        ])
        if (error) throw error
      }

      // Show success feedback (you could add a toast here)
      console.log("Added to cart successfully")
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", productId)
      if (error) throw error

      setProducts(products.filter((p) => p.id !== productId))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const toggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("products").update({ is_active: !currentStatus }).eq("id", productId)

      if (error) throw error

      setProducts(products.map((p) => (p.id === productId ? { ...p, is_active: !currentStatus } : p)))
    } catch (error) {
      console.error("Error updating product status:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
        {isAdmin && (
          <Button asChild className="mt-4">
            <Link href="/admin/products/new">Add Your First Product</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          {product.image_url && (
            <div className="aspect-square relative">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <div className="flex gap-2">
                {isAdmin && (
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                )}
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
            </div>

            {isAdmin ? (
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                </Button>
                <Button
                  size="sm"
                  variant={product.is_active ? "secondary" : "default"}
                  onClick={() => toggleActive(product.id, product.is_active)}
                >
                  {product.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </div>
            ) : (
              <Button className="w-full" disabled={product.stock_quantity === 0} onClick={() => addToCart(product.id)}>
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
