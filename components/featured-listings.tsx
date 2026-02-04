import { PropertyCard } from "@/components/property-card"
import { properties } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FeaturedListings() {
  const featuredProperties = properties.slice(0, 6)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-foreground">Featured Properties</h2>
            <p className="text-muted-foreground">Handpicked properties for you</p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="bg-transparent">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
