"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"

export function FeaturedListings() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      // Fetch properties where is_featured is TRUE
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (data) {
        // --- FIX ADDED HERE ---
        // Map database fields (snake_case) to UI fields (camelCase)
        const formattedData = data.map((item) => ({
          ...item,
          listingType: item.listing_type,   // Fixes badge
          propertyType: item.property_type, // Fixes type label
          // Fixes "undefined" unit issue
          areaUnit: item.area_unit || item.unit || "", 
          readyToMove: item.ready_to_move,
          features: Array.isArray(item.features) ? item.features : []
        }))

        setFeaturedProperties(formattedData)
      } else {
        console.error("Error fetching featured:", error)
      }
      setLoading(false)
    }

    fetchFeatured()
  }, [])

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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                <p>No featured properties found.</p>
                <p className="text-sm mt-1">Go to Admin Dashboard to mark properties as featured.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}