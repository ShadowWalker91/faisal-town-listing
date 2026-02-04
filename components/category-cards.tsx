import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Building2, LandPlot, Key, ShoppingBag, MapPin } from "lucide-react"

const categories = [
  {
    title: "Houses for Sale",
    description: "Find your dream home in Faisal Town",
    icon: Home,
    href: "/properties?listingType=buy&category=residential&propertyType=house",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Houses for Rent",
    description: "Rental homes for every budget",
    icon: Key,
    href: "/properties?listingType=rent&category=residential&propertyType=house",
    color: "bg-sky-50 text-sky-600",
  },
  {
    title: "Commercial Properties",
    description: "Shops, offices & warehouses",
    icon: Building2,
    href: "/properties?category=commercial",
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Plots for Sale",
    description: "Residential & commercial plots",
    icon: LandPlot,
    href: "/properties?category=plot",
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Ready to Move",
    description: "Immediate possession available",
    icon: ShoppingBag,
    href: "/properties?readyToMove=true",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Explore Sectors",
    description: "Browse by sector location",
    icon: MapPin,
    href: "/properties",
    color: "bg-slate-100 text-slate-600",
  },
]

export function CategoryCards() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground">Explore properties based on your needs</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.title} href={category.href}>
              <Card className="group h-full transition-all hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${category.color}`}>
                    <category.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
