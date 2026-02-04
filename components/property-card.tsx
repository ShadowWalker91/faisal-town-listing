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
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
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
            <span className="line-clamp-1">Sector {property.sector.toUpperCase()}, Faisal Town</span>
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
              <span>{formatArea(property.area, property.areaUnit)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
