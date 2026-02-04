"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function Footer() {
  const [sectorsList, setSectorsList] = useState<any[]>([])

  // Fetch Sectors dynamically from Supabase
  useEffect(() => {
    async function fetchSectors() {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name', { ascending: true })
        .limit(6) // Limit to 6 for the footer so it doesn't get too long
      
      if (data) {
        setSectorsList(data)
      }
    }
    fetchSectors()
  }, [])

  return (
    <footer className="border-t border-border bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          
          {/* 1. BRANDING COLUMN */}
          <div>
            <Link href="/" className="mb-4 flex items-center">
              <div className="relative h-12 w-48"> 
                <Image 
                  src="/logo.png" 
                  alt="Faisal Town Logo" 
                  fill 
                  className="object-contain object-left" 
                />
              </div>
            </Link>
            <p className="text-sm text-slate-400 mt-2">
              Your trusted partner for finding the perfect property in Faisal Town, Islamabad.
            </p>
          </div>

          {/* 2. PROPERTY TYPES */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Property Types</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?category=residential" className="hover:text-white transition-colors">
                  Residential Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?category=commercial" className="hover:text-white transition-colors">
                  Commercial Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?category=plot" className="hover:text-white transition-colors">
                  Plots
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. QUICK LINKS */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?listingType=buy" className="hover:text-white transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link href="/properties?listingType=rent" className="hover:text-white transition-colors">
                  Properties for Rent
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. DYNAMIC SECTORS */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Sectors</h4>
            <ul className="space-y-2 text-sm">
              {sectorsList.length > 0 ? (
                sectorsList.map((sector) => (
                  <li key={sector.id}>
                    <Link href={`/properties?sector=${sector.name}`} className="hover:text-white transition-colors">
                      {sector.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">Loading sectors...</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Faisal Town Properties. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}