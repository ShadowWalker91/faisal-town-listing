import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice, formatArea, PROPERTY_TYPES, SECTORS } from "@/lib/types"
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Calendar, Check } from "lucide-react"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyContactButtons } from "@/components/property-contact-buttons"
import { PropertyViewTracker } from "@/components/property-view-tracker"

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params

  // 1. Fetch Data
  const { data: dbData, error } = await supabase
    .from('properties')
    .select('*, agents(*)')
    .eq('uuid', id) 
    .single()

  if (error || !dbData) {
    notFound()
  }

  // 2. Map Fields
  const property = {
    ...dbData,
    listingType: dbData.listing_type,
    propertyType: dbData.property_type,
    readyToMove: dbData.ready_to_move,
    areaUnit: dbData.area_unit || dbData.unit || "", 
    createdAt: dbData.created_at,
    features: Array.isArray(dbData.features) ? dbData.features : [],
    images: dbData.images || [],
    agent: dbData.agents 
  }

  const propertyTypeLabel = PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label || property.propertyType
  const sectorName = SECTORS.find((s) => s.name === property.sector || s.id === property.sector)?.name || property.sector

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50">
        
        {/* TRACKER: Passes the integer ID to the database function */}
        <PropertyViewTracker propertyId={property.id} propertyTitle={property.title} />

        <div className="container mx-auto px-4 py-8">
          <Link
            href="/properties"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* --- LEFT COLUMN --- */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                 <PropertyGallery images={property.images} title={property.title} />
              </div>

              <div className="mb-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge
                    className={property.listingType === "buy" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-sky-600 hover:bg-sky-700"}
                  >
                    {property.listingType === "buy" ? "For Sale" : "For Rent"}
                  </Badge>
                  <Badge variant="outline">{propertyTypeLabel}</Badge>
                  {property.readyToMove && <Badge variant="secondary">Ready to Move</Badge>}
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
                    {property.bedrooms !== null && (
                      <div className="flex flex-col items-center rounded-lg bg-slate-50 p-4 text-center">
                        <Bed className="mb-2 h-6 w-6 text-muted-foreground" />
                        <span className="text-xl font-bold text-foreground">{property.bedrooms}</span>
                        <span className="text-sm text-muted-foreground">Bedrooms</span>
                      </div>
                    )}
                    {property.bathrooms !== null && (
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
                      <span className="text-sm text-muted-foreground">Block</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">{property.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {property.features.map((feature: string) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-1">
                      <p className="text-3xl font-bold text-[#b800ff]">
                        {formatPrice(property.price)}
                        {property.listingType === "rent" && (
                          <span className="text-base font-normal text-muted-foreground">/month</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatArea(property.area, property.areaUnit)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {property.agent && (
                  <Card className="overflow-hidden border-[#b800ff]/20 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-100">
                          {property.agent.image_url ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img 
                               src={property.agent.image_url} 
                               alt={property.agent.name} 
                               className="h-full w-full object-cover"
                             />
                          ) : (
                             <div className="flex h-full w-full items-center justify-center text-slate-400">
                               <span className="text-2xl font-bold">{property.agent.name?.[0]}</span>
                             </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-lg text-foreground">{property.agent.name}</p>
                          <p className="text-sm text-muted-foreground">{property.agent.company}</p>
                        </div>
                      </div>

                      {/* Contact Buttons */}
                      <PropertyContactButtons 
                         propertyId={property.id} 
                         agentPhone={property.agent.phone} 
                         agentWhatsapp={property.agent.whatsapp} 
                         propertyTitle={property.title}
                      />

                      <div className="mt-3">
                        <Button variant="outline" className="w-full rounded-full" asChild>
                           <a href={`mailto:?subject=Inquiry about ${property.title}&body=Hi, I am interested in this property.`}>
                             Send Message via Email
                           </a>
                        </Button>
                      </div>

                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-semibold text-foreground">Property Summary</h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Type</dt>
                        <dd className="font-medium text-foreground">{propertyTypeLabel}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Category</dt>
                        <dd className="font-medium capitalize text-foreground">{property.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Block</dt>
                        <dd className="font-medium text-foreground">{sectorName}</dd>
                      </div>
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