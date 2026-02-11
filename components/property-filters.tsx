"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PROPERTY_TYPES } from "@/lib/types"
import { X } from "lucide-react"

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [blocks, setBlocks] = useState<any[]>([])

  const listingType = searchParams.get("listingType") || ""
  const category = searchParams.get("category") || ""
  const propertyType = searchParams.get("propertyType") || ""
  const sector = searchParams.get("sector") || ""

  useEffect(() => {
    async function fetchBlocks() {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name', { ascending: true })

      if (!error && data) {
        setBlocks(data)
      }
    }
    fetchBlocks()
  }, [])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/properties?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/properties")
  }

  const hasFilters = listingType || category || propertyType || sector

  return (
    <Card className="sticky top-20">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Filters</CardTitle>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-muted-foreground">
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Listing Type</Label>
          <div className="flex gap-2">
            <Button
              variant={listingType === "buy" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("listingType", listingType === "buy" ? "" : "buy")}
              className={listingType === "buy" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-transparent"}
            >
              Buy
            </Button>
            <Button
              variant={listingType === "rent" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("listingType", listingType === "rent" ? "" : "rent")}
              className={listingType === "rent" ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-transparent"}
            >
              Rent
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <Select value={category || "all"} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="plot">Plots</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Property Type</Label>
          <Select value={propertyType || "all"} onValueChange={(value) => updateFilter("propertyType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {PROPERTY_TYPES.filter((type) => !category || type.category === category).map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* --- FIXED BLOCK FILTER --- */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Block</Label>
          <Select value={sector || "all"} onValueChange={(value) => updateFilter("sector", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Blocks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blocks</SelectItem>
              {blocks.map((block) => (
                // Using block.name ensures the URL is readable and matches text-based searches
                <SelectItem key={block.id} value={block.name}>
                  {block.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Features</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="readyToMove" />
              <label htmlFor="readyToMove" className="text-sm text-muted-foreground">
                Ready to Move
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}