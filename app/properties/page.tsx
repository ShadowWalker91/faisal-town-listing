"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyCard } from "@/components/property-card" 
import { Loader2, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true)

      // 1. Start the base query
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      // 2. Read filters from URL
      const listingType = searchParams.get("listingType")
      const category = searchParams.get("category")
      const propertyType = searchParams.get("propertyType")
      const sector = searchParams.get("sector")

      // 3. Apply filters strictly (AND logic)
      if (listingType) {
        query = query.eq('listing_type', listingType)
      }
      if (category && category !== "all") {
        query = query.eq('category', category)
      }
      if (propertyType && propertyType !== "all") {
        query = query.eq('property_type', propertyType) 
      }
      if (sector && sector !== "all") {
        query = query.eq('sector', sector)
      }

      // 4. Run the query
      const { data, error } = await query

      if (error) {
        console.error("Error fetching properties:", error)
      } else {
        // 5. CRITICAL: Map Database Fields (snake_case) to UI Fields (camelCase)
        const formattedData = (data || []).map((item) => ({
          ...item,
          listingType: item.listing_type,   // Fixes the badge
          propertyType: item.property_type, // Fixes type labels
          // FIX APPLIED HERE: Checks both 'area_unit' and 'unit' columns
          areaUnit: item.area_unit || item.unit || "", 
          readyToMove: item.ready_to_move,  // Fixes ready badge
          features: Array.isArray(item.features) ? item.features : []
        }))

        setProperties(formattedData)
      }
      setLoading(false)
    }

    fetchProperties()
  }, [searchParams]) // Re-run whenever filters change

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Properties in Faisal Town</h1>
              <p className="text-muted-foreground">Browse all available properties</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full sm:w-auto lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Filter Properties"}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-20">
                <PropertyFilters />
              </div>
            </aside>

            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white py-16 text-center">
                  <p className="text-muted-foreground">No properties found matching your filters.</p>
                  <Button 
                    variant="link" 
                    onClick={() => window.location.href = '/properties'}
                    className="mt-2 text-emerald-600"
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}