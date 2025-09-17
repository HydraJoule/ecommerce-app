import { ProductList } from "@/components/product-list"
import { CategoryFilter } from "@/components/category-filter"
import { ShoppingHeader } from "@/components/shopping-header"

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { category } = await searchParams

  return (
    <div className="min-h-screen bg-background">
      <ShoppingHeader />
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64">
            <CategoryFilter selectedCategory={category} />
          </aside>
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{category ? `${category} Products` : "All Products"}</h1>
              <p className="text-muted-foreground">Discover our amazing collection</p>
            </div>
            <ProductList category={category} />
          </main>
        </div>
      </div>
    </div>
  )
}
