import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyGrid } from "@/components/property-grid"

export default function PropertiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Properties in Faisal Town</h1>
            <p className="text-muted-foreground">Browse all available properties</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
                <PropertyFilters />
              </Suspense>
            </aside>
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2"><div className="h-80 animate-pulse rounded-lg bg-muted" /><div className="h-80 animate-pulse rounded-lg bg-muted" /></div>}>
                <PropertyGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
