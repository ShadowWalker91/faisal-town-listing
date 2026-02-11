"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState, Suspense } from "react"
import { useSearchParams, usePathname } from "next/navigation"

function HeaderContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const isHomePage = pathname === "/"

  const getLinkClass = (key: string, value: string) => {
    const isActive = searchParams?.get(key) === value
    return `text-sm font-medium transition-colors ${
      isActive 
        ? "text-[#b800ff] font-bold" 
        : "text-white hover:text-[#b800ff]"
    }`
  }

  // Simple class for static pages (like About)
  const getStaticLinkClass = (path: string) => {
    const isActive = pathname === path
    return `text-sm font-medium transition-colors ${
      isActive 
        ? "text-[#b800ff] font-bold" 
        : "text-white hover:text-[#b800ff]"
    }`
  }

  return (
    <header 
      className={`z-50 w-full border-b border-white/10 transition-colors ${
        isHomePage 
          ? "absolute top-0 bg-transparent" 
          : "relative bg-black/40"          
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-48"> 
            <Image 
              src="/logo.png" 
              alt="Faisal Town Logo" 
              fill 
              className="object-contain object-left" 
              priority
            />
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className={getStaticLinkClass("/")}>
             Home
          </Link>
          {/* NEW ABOUT LINK */}
          <Link href="/about" className={getStaticLinkClass("/about")}>
             About
          </Link>
          <Link href="/properties?listingType=buy" className={getLinkClass("listingType", "buy")}>
            Buy
          </Link>
          <Link href="/properties?listingType=rent" className={getLinkClass("listingType", "rent")}>
            Rent
          </Link>
          <Link href="/properties?category=residential" className={getLinkClass("category", "residential")}>
            Residential
          </Link>
          <Link href="/properties?category=commercial" className={getLinkClass("category", "commercial")}>
            Commercial
          </Link>
          <Link href="/properties?category=plot" className={getLinkClass("category", "plot")}>
            Plots
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white hover:border-[#b800ff] hover:text-[#b800ff] md:hidden transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-slate-900/95 backdrop-blur-md md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            <Link
               href="/about"
               className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 ${pathname === "/about" ? "text-[#b800ff]" : "text-white"}`}
               onClick={() => setMobileMenuOpen(false)}
            >
               About
            </Link>
            <Link
              href="/properties?listingType=buy"
              className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 ${
                searchParams?.get("listingType") === "buy" ? "text-[#b800ff]" : "text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Buy
            </Link>
            <Link
              href="/properties?listingType=rent"
              className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 ${
                searchParams?.get("listingType") === "rent" ? "text-[#b800ff]" : "text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Rent
            </Link>
            <Link
              href="/properties?category=residential"
              className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 ${
                searchParams?.get("category") === "residential" ? "text-[#b800ff]" : "text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Residential
            </Link>
            <Link
              href="/properties?category=commercial"
              className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 ${
                searchParams?.get("category") === "commercial" ? "text-[#b800ff]" : "text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Commercial
            </Link>
            <Link
              href="/properties?category=plot"
              className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 ${
                searchParams?.get("category") === "plot" ? "text-[#b800ff]" : "text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Plots
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={<header className="h-16 w-full bg-transparent" />}>
      <HeaderContent />
    </Suspense>
  )
}