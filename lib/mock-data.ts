import { Property } from "./types"

export const properties: Property[] = [
  {
    id: "1",
    title: "Beautiful 5 Marla House in Sector A",
    description: "A stunning 5 marla house with modern architecture, featuring spacious rooms, imported fittings, and a beautiful garden. Perfect for families looking for a peaceful living environment.",
    price: 18500000,
    listingType: "buy",
    category: "residential",
    propertyType: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 5,
    areaUnit: "marla",
    sector: "a",
    street: "Street 12",
    address: "House #45, Street 12, Sector A, Faisal Town, Islamabad",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    ],
    features: ["Lawn", "Garage", "Servant Quarter", "Solar Panels"],
    readyToMove: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "10 Marla Modern Villa for Sale",
    description: "Luxurious 10 marla villa with contemporary design, double-height ceilings, and premium finishes throughout. Features a dedicated home office and entertainment area.",
    price: 45000000,
    listingType: "buy",
    category: "residential",
    propertyType: "house",
    bedrooms: 6,
    bathrooms: 5,
    area: 10,
    areaUnit: "marla",
    sector: "b",
    street: "Street 5",
    address: "House #23, Street 5, Sector B, Faisal Town, Islamabad",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    features: ["Swimming Pool", "Home Theater", "Smart Home System", "Double Garage"],
    readyToMove: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
  },
  {
    id: "3",
    title: "3 Bedroom Apartment for Rent",
    description: "Well-maintained 3 bedroom apartment in a secure complex. Features modern kitchen, balcony with city views, and 24/7 security.",
    price: 85000,
    listingType: "rent",
    category: "residential",
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    areaUnit: "sqft",
    sector: "c",
    address: "Apartment #12B, Al-Noor Heights, Sector C, Faisal Town, Islamabad",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    features: ["Elevator", "Parking", "Security", "Gym Access"],
    readyToMove: true,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "4",
    title: "Prime Commercial Shop in Main Market",
    description: "Ground floor commercial shop in the heart of Faisal Town main market. High foot traffic area, ideal for retail business.",
    price: 25000000,
    listingType: "buy",
    category: "commercial",
    propertyType: "shop",
    area: 400,
    areaUnit: "sqft",
    sector: "c",
    address: "Shop #7, Main Market, Sector C, Faisal Town, Islamabad",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    ],
    features: ["Main Road Facing", "Basement Storage", "Washroom", "Electricity Backup"],
    readyToMove: true,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    id: "5",
    title: "5 Marla Residential Plot - Prime Location",
    description: "Ideally located 5 marla plot in Sector D with all utilities available. Perfect for building your dream home.",
    price: 12000000,
    listingType: "buy",
    category: "plot",
    propertyType: "residential-plot",
    area: 5,
    areaUnit: "marla",
    sector: "d",
    street: "Street 8",
    address: "Plot #112, Street 8, Sector D, Faisal Town, Islamabad",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    ],
    features: ["Corner Plot", "Park Facing", "All Utilities", "Wide Street"],
    readyToMove: false,
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
  {
    id: "6",
    title: "Spacious Office Space for Rent",
    description: "Modern office space with open floor plan, conference room, and pantry area. Located in a commercial complex with parking facilities.",
    price: 150000,
    listingType: "rent",
    category: "commercial",
    propertyType: "office",
    area: 2500,
    areaUnit: "sqft",
    sector: "c",
    address: "Office #301, Business Plaza, Sector C, Faisal Town, Islamabad",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    ],
    features: ["Central AC", "Conference Room", "Parking", "24/7 Access"],
    readyToMove: true,
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
  },
  {
    id: "7",
    title: "1 Kanal Luxury House - Brand New",
    description: "Brand new 1 kanal house with premium construction, Italian marble flooring, and landscaped garden. A true masterpiece of modern architecture.",
    price: 95000000,
    listingType: "buy",
    category: "residential",
    propertyType: "house",
    bedrooms: 7,
    bathrooms: 8,
    area: 1,
    areaUnit: "kanal",
    sector: "a",
    street: "Street 1",
    address: "House #1, Street 1, Sector A, Faisal Town, Islamabad",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    ],
    features: ["Elevator", "Home Automation", "Servant Quarters", "Rooftop Terrace"],
    readyToMove: true,
    createdAt: "2024-01-28",
    updatedAt: "2024-01-28",
  },
  {
    id: "8",
    title: "Ground Floor Portion for Rent",
    description: "Spacious ground floor portion with separate entrance, 3 bedrooms, and dedicated parking. Suitable for small families.",
    price: 55000,
    listingType: "rent",
    category: "residential",
    propertyType: "portion",
    bedrooms: 3,
    bathrooms: 2,
    area: 5,
    areaUnit: "marla",
    sector: "e",
    street: "Street 15",
    address: "House #78-A, Street 15, Sector E, Faisal Town, Islamabad",
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
    ],
    features: ["Separate Entrance", "Parking", "Lawn Access", "Gas Available"],
    readyToMove: true,
    createdAt: "2024-01-30",
    updatedAt: "2024-01-30",
  },
  {
    id: "9",
    title: "10 Marla Commercial Plot - Main Boulevard",
    description: "Premium 10 marla commercial plot on main boulevard. Excellent investment opportunity with high appreciation potential.",
    price: 85000000,
    listingType: "buy",
    category: "plot",
    propertyType: "commercial-plot",
    area: 10,
    areaUnit: "marla",
    sector: "c",
    address: "Plot #5, Main Boulevard, Sector C, Faisal Town, Islamabad",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    ],
    features: ["Main Boulevard", "Corner", "Commercial Zone", "High Demand Area"],
    readyToMove: false,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
  },
]

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export function filterProperties(filters: {
  listingType?: string
  category?: string
  propertyType?: string
  sector?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}): Property[] {
  return properties.filter((property) => {
    if (filters.listingType && property.listingType !== filters.listingType) {
      return false
    }
    if (filters.category && property.category !== filters.category) {
      return false
    }
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false
    }
    if (filters.sector && property.sector !== filters.sector) {
      return false
    }
    if (filters.minPrice && property.price < filters.minPrice) {
      return false
    }
    if (filters.maxPrice && property.price > filters.maxPrice) {
      return false
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        property.title.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower)
      )
    }
    return true
  })
}
