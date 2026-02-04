"use client"

import { useSearchParams } from "next/navigation"
import { PropertyCard } from "@/components/property-card"
import { filterProperties } from "@/lib/mock-data"

export function PropertyGrid() {
  const searchParams = useSearchParams()

  const filteredProperties = filterProperties({
    listingType: searchParams.get("listingType") || undefined,
    category: searchParams.get("category") || undefined,
    propertyType: searchParams.get("propertyType") || undefined,
    sector: searchParams.get("sector") || undefined,
    search: searchParams.get("search") || undefined,
  })

  if (filteredProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16 text-center">
        <div className="mb-4 text-6xl text-muted-foreground">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No properties found</h3>
        <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredProperties.length}</span> properties
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}
