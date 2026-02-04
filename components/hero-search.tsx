"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PROPERTY_TYPES } from "@/lib/types"
import { Search } from "lucide-react"

export function HeroSearch() {
  const router = useRouter()
  const [listingType, setListingType] = useState<string>("buy")
  const [propertyType, setPropertyType] = useState<string>("")
  const [sector, setSector] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  
  const [sectorsList, setSectorsList] = useState<any[]>([])

  useEffect(() => {
    async function fetchSectors() {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name', { ascending: true })
      
      if (data) {
        setSectorsList(data)
      }
    }
    fetchSectors()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (listingType) params.set("listingType", listingType)
    if (propertyType) params.set("propertyType", propertyType)
    if (sector) params.set("sector", sector) 
    if (search) params.set("search", search)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden py-20">
      
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/S0SbSMY1_qk?autoplay=1&mute=1&controls=0&loop=1&playlist=S0SbSMY1_qk&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1"
          className="absolute top-1/2 left-1/2 min-w-[100vw] min-h-[100vh] w-[177.77vh] h-[56.25vw] -translate-x-1/2 -translate-y-1/2 scale-110"
          title="Faisal Town Background Video"
          allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
          tabIndex={-1}
        />
      </div>

      <div className="absolute inset-0 bg-black/60 z-10" />
      
      <div className="container relative z-20 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Find Your Perfect Property in <span className="text-secondary">Faisal Town</span>
          </h1>
          <p className="mb-8 text-lg text-slate-200 md:text-xl font-light">
            Discover residential, commercial properties and plots in the heart of Islamabad
          </p>

          {/* GLASS SLAB CONTAINER */}
          <div className="mx-auto max-w-4xl rounded-xl bg-white/20 p-4 shadow-2xl backdrop-blur-md border border-white/30 md:p-6">
            
            {/* TABS (Buy/Rent) */}
            <div className="mb-4 flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setListingType("buy")}
                className={`h-10 px-6 font-medium transition-all ${
                  listingType === "buy" 
                    ? "bg-[#b800ff] text-white hover:bg-[#b800ff]/90" 
                    : "bg-white/20 text-white hover:bg-white/40"
                }`}
              >
                Buy
              </Button>
              <Button
                variant="ghost"
                onClick={() => setListingType("rent")}
                className={`h-10 px-6 font-medium transition-all ${
                  listingType === "rent" 
                    ? "bg-[#b800ff] text-white hover:bg-[#b800ff]/90" 
                    : "bg-white/20 text-white hover:bg-white/40"
                }`}
              >
                Rent
              </Button>
            </div>

            {/* SEARCH FIELDS GRID */}
            <div className="grid gap-3 md:grid-cols-4 items-center">
              
              {/* 1. Location Input */}
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by location, property type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  // FIXED: h-14 and w-full for uniform size
                  className="w-full h-14 border-transparent bg-white text-foreground focus-visible:ring-[#b800ff] shadow-sm text-base px-6"
                />
              </div>

              {/* 2. Property Type Dropdown */}
              <Select value={propertyType} onValueChange={setPropertyType}>
                {/* FIXED: h-14 and w-full for uniform size */}
                <SelectTrigger className="w-full h-14 border-transparent bg-white text-foreground focus:ring-[#b800ff] shadow-sm text-base px-4">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* 3. Sector Dropdown */}
              <Select value={sector} onValueChange={setSector}>
                {/* FIXED: h-14 and w-full for uniform size */}
                <SelectTrigger className="w-full h-14 border-transparent bg-white text-foreground focus:ring-[#b800ff] shadow-sm text-base px-4">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectorsList.length > 0 ? (
                    sectorsList.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">Loading...</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* 4. Search Button */}
            <Button
              onClick={handleSearch}
              size="lg"
              // FIXED: h-14 to match fields
              className="mt-4 w-full h-14 bg-[#b800ff] text-white hover:bg-[#b800ff]/90 md:w-auto md:px-12 font-bold shadow-lg shadow-[#b800ff]/20 text-lg"
            >
              <Search className="mr-2 h-6 w-6" />
              Search Properties
            </Button>
          </div>

          {/* STATS */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-secondary">500+</span>
              <span>Properties Listed</span>
            </div>
            <div className="h-4 w-px bg-slate-500" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-secondary">{sectorsList.length > 0 ? sectorsList.length : '5'}</span>
              <span>Sectors Covered</span>
            </div>
            <div className="h-4 w-px bg-slate-500" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-secondary">100%</span>
              <span>Verified Listings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}