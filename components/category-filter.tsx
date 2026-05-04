"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const categories = [
<<<<<<< HEAD
  "Dairy",
  "Snacks",
  "Oil",
  "Grains",
  "Pulses",
  "Fruits",
  "Beverages",
  "Essentials",
  "Vegetables",
  "Bakery",
  "Fashion",
=======
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Health & Beauty",
  "Toys & Games",
  "Food & Beverages",
  "Other",
>>>>>>> b4f24ad9ee535c08f90292ce3005d54529d8c72f
]

interface CategoryFilterProps {
  selectedCategory?: string
}

export function CategoryFilter({ selectedCategory }: CategoryFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild variant={!selectedCategory ? "default" : "ghost"} className="w-full justify-start">
          <Link href="/shop">All Products</Link>
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            asChild
            variant={selectedCategory === category ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Link href={`/shop?category=${encodeURIComponent(category)}`}>{category}</Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
