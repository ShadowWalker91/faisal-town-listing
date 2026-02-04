"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Home, LandPlot, TrendingUp, Plus, Loader2, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SECTORS } from "@/lib/types" 

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  
  // State for the stats
  const [stats, setStats] = useState({
    total: 0,
    forSale: 0,
    forRent: 0,
    residential: 0,
    commercial: 0,
    plots: 0
  })

  // State for the list
  const [recentProperties, setRecentProperties] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)

      // 1. Fetch All Properties (to calculate stats)
      // Note: In a huge app, we would use .count() queries, but for <1000 items, this is faster.
      const { data: allProperties, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error loading dashboard:", error)
        setLoading(false)
        return
      }

      const data = allProperties || []

      // 2. Calculate Stats in Javascript
      setStats({
        total: data.length,
        forSale: data.filter(p => p.listing_type === 'buy').length,
        forRent: data.filter(p => p.listing_type === 'rent').length,
        residential: data.filter(p => p.category === 'residential').length,
        commercial: data.filter(p => p.category === 'commercial').length,
        plots: data.filter(p => p.category === 'plot').length
      })

      // 3. Get the 5 most recent for the list
      setRecentProperties(data.slice(0, 5))
      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Faisal Town Properties Admin Panel</p>
        </div>
        <Link href="/admin/properties/new">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.forSale} for sale, {stats.forRent} for rent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Residential</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.residential}</div>
            <p className="text-xs text-muted-foreground">Houses, apartments, portions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Commercial</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.commercial}</div>
            <p className="text-xs text-muted-foreground">Shops, offices, warehouses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plots</CardTitle>
            <LandPlot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.plots}</div>
            <p className="text-xs text-muted-foreground">Residential & commercial plots</p>
          </CardContent>
        </Card>
      </div>

      {/* RECENT PROPERTIES LIST */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Properties</CardTitle>
          <Link href="/admin/properties">
            <Button variant="outline" size="sm" className="bg-transparent">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Thumbnail Image */}
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted relative">
                    <img
                      src={property.images?.[0] || "/placeholder.jpg"}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Title & Location */}
                  <div>
                    <p className="font-medium text-foreground line-clamp-1">{property.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {SECTORS.find((s) => s.id === property.sector)?.name || `Sector ${property.sector}`} 
                      <span className="mx-2 text-slate-300">|</span> 
                      <span className="capitalize">{property.category}</span>
                    </p>
                  </div>
                </div>

                {/* Price & Tag */}
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-semibold text-foreground text-sm">
                    {new Intl.NumberFormat('en-PK', { 
                        style: 'currency', 
                        currency: 'PKR', 
                        maximumSignificantDigits: 3 
                    }).format(property.price)}
                    {property.listing_type === "rent" && <span className="text-xs font-normal text-muted-foreground">/mo</span>}
                  </p>
                  <Badge
                    className={
                      property.listing_type === "buy"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-sky-100 text-sky-700 hover:bg-sky-100"
                    }
                  >
                    {property.listing_type === "buy" ? "For Sale" : "For Rent"}
                  </Badge>
                </div>
              </div>
            ))}

            {recentProperties.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                    No properties added yet.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}