import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPropertyById } from "@/lib/mock-data"
import { formatPrice, formatArea, PROPERTY_TYPES, SECTORS } from "@/lib/types"
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Calendar, Check, Phone, Mail } from "lucide-react"

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const property = getPropertyById(id)

  if (!property) {
    notFound()
  }

  const propertyTypeLabel = PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label || property.propertyType
  const sectorName = SECTORS.find((s) => s.id === property.sector)?.name || `Sector ${property.sector.toUpperCase()}`

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/properties"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 overflow-hidden rounded-xl">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
                {property.images.length > 1 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {property.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${property.title} - Image ${index + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 25vw, 16vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge
                    className={property.listingType === "buy" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-sky-600 text-white hover:bg-sky-700"}
                  >
                    {property.listingType === "buy" ? "For Sale" : "For Rent"}
                  </Badge>
                  <Badge variant="outline">{propertyTypeLabel}</Badge>
                  {property.readyToMove && (
                    <Badge variant="secondary">Ready to Move</Badge>
                  )}
                </div>
                <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">{property.title}</h1>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address}</span>
                </div>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {property.bedrooms !== undefined && (
                      <div className="flex flex-col items-center rounded-lg bg-slate-50 p-4 text-center">
                        <Bed className="mb-2 h-6 w-6 text-muted-foreground" />
                        <span className="text-xl font-bold text-foreground">{property.bedrooms}</span>
                        <span className="text-sm text-muted-foreground">Bedrooms</span>
                      </div>
                    )}
                    {property.bathrooms !== undefined && (
                      <div className="flex flex-col items-center rounded-lg bg-slate-50 p-4 text-center">
                        <Bath className="mb-2 h-6 w-6 text-muted-foreground" />
                        <span className="text-xl font-bold text-foreground">{property.bathrooms}</span>
                        <span className="text-sm text-muted-foreground">Bathrooms</span>
                      </div>
                    )}
                    <div className="flex flex-col items-center rounded-lg bg-slate-50 p-4 text-center">
                      <Maximize className="mb-2 h-6 w-6 text-muted-foreground" />
                      <span className="text-xl font-bold text-foreground">{property.area}</span>
                      <span className="text-sm text-muted-foreground">{property.areaUnit}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-slate-50 p-4 text-center">
                      <MapPin className="mb-2 h-6 w-6 text-muted-foreground" />
                      <span className="text-xl font-bold text-foreground">{sectorName}</span>
                      <span className="text-sm text-muted-foreground">Location</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{property.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {property.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-primary">
                        {formatPrice(property.price)}
                        {property.listingType === "rent" && (
                          <span className="text-base font-normal text-muted-foreground">/month</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatArea(property.area, property.areaUnit)}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                        <Phone className="mr-2 h-4 w-4" />
                        Contact Agent
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Inquiry
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-semibold text-foreground">Property Summary</h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Property ID</dt>
                        <dd className="font-medium text-foreground">FT-{property.id.padStart(4, "0")}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Type</dt>
                        <dd className="font-medium text-foreground">{propertyTypeLabel}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Category</dt>
                        <dd className="font-medium capitalize text-foreground">{property.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Sector</dt>
                        <dd className="font-medium text-foreground">{sectorName}</dd>
                      </div>
                      {property.street && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Street</dt>
                          <dd className="font-medium text-foreground">{property.street}</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Listed On</dt>
                        <dd className="flex items-center gap-1 font-medium text-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(property.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
