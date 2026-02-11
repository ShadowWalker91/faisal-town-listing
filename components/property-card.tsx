"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Property, formatPrice, formatArea } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Bed, Bath, Maximize, MapPin } from "lucide-react"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Ensure we have an array of images, or fallback to placeholder
  const images = property.images && property.images.length > 0 
    ? property.images 
    : ["/placeholder.svg"]

  // Auto-scroll effect on hover (Slideshow)
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }, 1000) // Change image every 1 second
    } else {
      // Optional: Reset to first image when mouse leaves. 
      // Comment this out if you want it to stay on the last viewed image.
      setCurrentImageIndex(0)
    }

    return () => clearInterval(interval)
  }, [isHovered, images.length])

  return (
    <Link 
      href={`/properties/${property.uuid}`} 
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden transition-all hover:shadow-lg p-0 border-none shadow-md">
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          
          {/* Sliding Track: Moves horizontally based on current index */}
          <div 
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={index} className="relative h-full w-full shrink-0">
                <Image
                  src={img}
                  alt={`${property.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>

          {/* Badges (Buy/Rent) */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2 z-10">
            <Badge
              variant={property.listingType === "buy" ? "default" : "secondary"}
              className={property.listingType === "buy" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-sky-600 text-white hover:bg-sky-700"}
            >
              {property.listingType === "buy" ? "For Sale" : "For Rent"}
            </Badge>
            {property.readyToMove && (
              <Badge variant="outline" className="border-white bg-white/90 text-foreground">
                Ready to Move
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <p className="text-xl font-bold text-primary">
              {formatPrice(property.price)}
              {property.listingType === "rent" && <span className="text-sm font-normal text-muted-foreground">/month</span>}
            </p>
          </div>
          <h3 className="mb-2 line-clamp-1 text-base font-semibold text-foreground group-hover:text-primary">
            {property.title}
          </h3>
          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{property.sector}, Faisal Town</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              {/* FIXED: Removed the fallback || "Marla". Now it uses the real DB value. */}
              <span>{formatArea(property.area, property.areaUnit)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}