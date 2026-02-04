export type ListingType = "buy" | "rent"

export type PropertyCategory = "residential" | "commercial" | "plot"

export type PropertyType =
  | "house"
  | "apartment"
  | "portion"
  | "shop"
  | "office"
  | "warehouse"
  | "residential-plot"
  | "commercial-plot"

export interface Property {
  id: string
  title: string
  description: string
  price: number
  listingType: ListingType
  category: PropertyCategory
  propertyType: PropertyType
  bedrooms?: number
  bathrooms?: number
  area: number
  areaUnit: "marla" | "kanal" | "sqft"
  sector: string
  street?: string
  address: string
  images: string[]
  features: string[]
  readyToMove: boolean
  createdAt: string
  updatedAt: string
}

export interface Sector {
  id: string
  name: string
  description: string
}

export const SECTORS: Sector[] = [
  { id: "a", name: "Sector A", description: "Premium residential sector" },
  { id: "b", name: "Sector B", description: "Mixed residential area" },
  { id: "c", name: "Sector C", description: "Commercial hub" },
  { id: "d", name: "Sector D", description: "New development" },
  { id: "e", name: "Sector E", description: "Residential sector" },
]

export const PROPERTY_TYPES: { value: PropertyType; label: string; category: PropertyCategory }[] = [
  { value: "house", label: "House", category: "residential" },
  { value: "apartment", label: "Apartment", category: "residential" },
  { value: "portion", label: "Portion", category: "residential" },
  { value: "shop", label: "Shop", category: "commercial" },
  { value: "office", label: "Office", category: "commercial" },
  { value: "warehouse", label: "Warehouse", category: "commercial" },
  { value: "residential-plot", label: "Residential Plot", category: "plot" },
  { value: "commercial-plot", label: "Commercial Plot", category: "plot" },
]

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)} Crore`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)} Lac`
  }
  return `PKR ${price.toLocaleString()}`
}

export function formatArea(area: number, unit: "marla" | "kanal" | "sqft"): string {
  return `${area} ${unit === "sqft" ? "sq.ft" : unit}`
}
