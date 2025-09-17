"use client"

import { ProductForm } from "@/components/product-form"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

interface ProductEditFormProps {
  productId: string
}

export function ProductEditForm({ productId }: ProductEditFormProps) {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").eq("id", productId).single()

        if (error) throw error
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId, supabase])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return <div className="text-center">Product not found</div>
  }

  return <ProductForm product={product} />
}
