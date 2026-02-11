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
  uuid: string
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

export function formatPrice(price: number | string): string {
  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice === 0) return "Rs. 0";

  // Helper function to build the string recursively
  function formatRecursive(amount: number): string {
    if (amount === 0) return "";

    if (amount >= 10000000) {
      // Crore (1,00,00,000)
      const crore = Math.floor(amount / 10000000);
      const remainder = amount % 10000000;
      return `${crore} Crore ${formatRecursive(remainder)}`;
    } 
    
    if (amount >= 100000) {
      // Lac (1,00,000)
      const lac = Math.floor(amount / 100000);
      const remainder = amount % 100000;
      return `${lac} Lac ${formatRecursive(remainder)}`;
    } 
    
    if (amount >= 1000) {
      // Thousand (1,000)
      const thousand = Math.floor(amount / 1000);
      const remainder = amount % 1000;
      return `${thousand} Thousand ${formatRecursive(remainder)}`;
    } 
    
    if (amount >= 100) {
      // Hundred (100)
      const hundred = Math.floor(amount / 100);
      const remainder = amount % 100;
      return `${hundred} Hundred ${formatRecursive(remainder)}`;
    }

    // Less than 100, just return the number
    return amount.toString();
  }

  // Get the formatted string and trim extra spaces
  const result = formatRecursive(numericPrice).trim();
  
  return `Rs. ${result}`;
}

export function formatArea(area: number, unit: "marla" | "kanal" | "sqft"): string {
  return `${area} ${unit === "sqft" ? "sq.ft" : unit}`
}
