"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PROPERTY_TYPES } from "@/lib/types"
import { Search } from "lucide-react"

// Declare global types for YouTube API to avoid TS errors
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT: any
  }
}

export function HeroSearch() {
  const router = useRouter()
  const [listingType, setListingType] = useState<string>("buy")
  const [propertyType, setPropertyType] = useState<string>("")
  const [sector, setSector] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  
  const [sectorsList, setSectorsList] = useState<any[]>([])
  const playerRef = useRef<any>(null)

  // 1. Fetch Sectors
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

  // 2. Load YouTube API & Handle Looping
  useEffect(() => {
    // Check if script is already loaded
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Initialize Player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: 'S0SbSMY1_qk',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0, // No fullscreen
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0, // No related videos
          showinfo: 0,
          mute: 1, // Mute needed for autoplay
          playlist: 'S0SbSMY1_qk', 
        },
        events: {
          onReady: (event: any) => {
            event.target.mute()
            event.target.playVideo()

            // CHECK TIME INTERVAL
            // Stop 15 seconds before end and restart
            const timer = setInterval(() => {
              const player = event.target
              if (player && player.getCurrentTime) {
                const currentTime = player.getCurrentTime()
                const duration = player.getDuration()

                // If within 15 seconds of the end, seek to 0
                if (duration > 0 && (duration - currentTime) <= 15) {
                  player.seekTo(0)
                }
              }
            }, 1000)
            
            // Clean up interval on unmount logic could go here if needed, 
            // but for a Hero component it's usually fine.
          }
        }
      })
    }

    // If API was already loaded (navigation back/forth), manually trigger initialization could be tricky,
    // but usually Next.js handles this re-mount well.
    if (window.YT && window.YT.Player) {
       window.onYouTubeIframeAPIReady()
    }

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
    <section className="relative flex flex-col justify-center overflow-hidden py-24 md:min-h-screen md:py-20">
      
      {/* Background Video Wrapper */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden">
        {/* CSS Positioning Wrapper to handle Scaling */}
        <div className="absolute top-1/2 left-1/2 min-w-[100vw] min-h-[100vh] w-[300%] h-[150%] md:w-[177.77vh] md:h-[56.25vw] -translate-x-1/2 -translate-y-1/2">
           {/* The actual div the API replaces with an Iframe */}
           <div id="youtube-player" className="w-full h-full" />
        </div>
      </div>

      <div className="absolute inset-0 bg-black/60 z-10" />
      
      <div className="container relative z-20 mx-auto px-4 mt-10 md:mt-0">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Find Your Perfect Property in <span className="text-secondary">Faisal Town</span>
          </h1>
          <p className="mb-8 text-lg text-slate-200 md:text-xl font-light">
            Discover residential, commercial properties and plots in the heart of Islamabad
          </p>

          {/* SEARCH CONTAINER */}
          <div className="mx-auto max-w-4xl rounded-xl bg-black/20 p-4 shadow-2xl border border-black/20 md:p-6">
            
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
            <div className="grid gap-3 md:grid-cols-4">
              
              {/* 1. Location Input */}
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by location, property type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full !h-14 border-transparent bg-white text-foreground focus-visible:ring-[#b800ff] shadow-sm text-base px-6"
                />
              </div>

              {/* 2. Property Type Dropdown */}
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-full !h-14 flex items-center border-transparent bg-white text-foreground focus:ring-[#b800ff] shadow-sm text-base px-4">
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
                <SelectTrigger className="w-full !h-14 flex items-center border-transparent bg-white text-foreground focus:ring-[#b800ff] shadow-sm text-base px-4">
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
              className="mt-4 w-full !h-14 bg-[#b800ff] text-white hover:bg-[#b800ff]/90 md:w-auto md:px-12 font-bold shadow-lg shadow-[#b800ff]/20 text-lg"
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