"use client" // <--- 1. Convert to Client Component

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Map, X } from "lucide-react"

export function AboutSection() {
  const [showMap, setShowMap] = useState(false)

  return (
    <>
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Faisal Town Phase 1
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Launched in 2014 by <strong>Zedem International (Faisal Town Group)</strong>, this project has established itself as one of the most reliable housing schemes in the Twin Cities. It is fully approved by the <strong>RDA</strong> and covers over 4,700 Kanals of developed land.
                </p>
                <p>
                  The society is positioned directly on the main <strong>Fateh Jang Road (N-80)</strong>, giving residents immediate access to the M-1 Motorway and the Islamabad International Airport. Unlike many upcoming projects, Faisal Town Phase 1 is already developed, with thousands of families residing there today.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/properties">
                  <Button size="lg" className="bg-[#b800ff] hover:bg-[#a300e6] text-white border-none">
                    Browse Properties
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                {/* 2. TRIGGER THE POP-UP */}
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-[#b800ff] text-[#b800ff] hover:bg-purple-50"
                  onClick={() => setShowMap(true)}
                >
                  View Master Map
                  <Map className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl bg-slate-200">
               <img 
                 src="/faisalTownPhase1.jpg" 
                 alt="Faisal Town Main Entrance" 
                 className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <div className="absolute bottom-6 left-6 text-white">
                 <p className="font-bold text-xl">Ideally Located</p>
                 <p className="text-white/90">Direct access from N-80 & M-1 Motorway</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PDF POP-UP MODAL */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
          <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header / Close Button */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
              <h3 className="font-bold text-lg">Master Plan Map</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowMap(false)}
                className="h-8 w-8 hover:bg-slate-200 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* PDF Viewer (Iframe) */}
            <div className="flex-1 bg-slate-100">
              <iframe 
                src="/FaisalTown-1-Master-Plan.pdf" 
                className="w-full h-full"
                title="Faisal Town Master Plan"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}