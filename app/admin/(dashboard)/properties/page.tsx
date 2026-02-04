"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatPrice, SECTORS } from "@/lib/types" // Ensure these exist or helpers are present
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Loader2 } from "lucide-react"

// Define the type based on your Supabase Table
type Property = {
  id: number
  title: string
  address: string
  price: number
  listing_type: 'buy' | 'rent'
  category: string
  property_type: string
  sector: string
  street?: string
  images: string[]
  status?: string
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch Data from Supabase
  const fetchProperties = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
    } else {
      setProperties(data || [])
    }
    setLoading(false)
  }

  // Delete Function
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      alert("Error deleting: " + error.message)
    } else {
      // Remove from UI instantly
      setProperties(prev => prev.filter(p => p.id !== id))
    }
  }

  // Initial Load
  useEffect(() => {
    fetchProperties()
  }, [])

  // Filter Logic
  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground">Manage all property listings</p>
        </div>
        <Link href="/admin/properties/new">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Properties ({properties.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
                            <img
                              src={property.images?.[0] || "/placeholder.jpg"}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">{property.title}</p>
                            <p className="text-xs text-muted-foreground">ID: FT-{property.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge
                            className={
                              property.listing_type === "buy"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-sky-100 text-sky-700 hover:bg-sky-200"
                            }
                          >
                            {property.listing_type === "buy" ? "For Sale" : "For Rent"}
                          </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground">
                           {SECTORS.find((s) => s.id === property.sector)?.name || `Sector ${property.sector}`}
                        </p>
                        {property.street && (
                          <p className="text-xs text-muted-foreground">{property.street}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">
                            {/* Simple formatter in case import fails */}
                            {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(property.price)}
                        </p>
                        {property.listing_type === "rent" && (
                          <p className="text-xs text-muted-foreground">/month</p>
                        )}
                      </TableCell>
                      <TableCell>
                         <span className="capitalize text-sm">{property.category}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/properties/${property.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View Public
                              </Link>
                            </DropdownMenuItem>
                            {/* We haven't built the Edit page yet, so this link might 404 for now */}
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/properties/${property.id}/edit`} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-destructive focus:bg-destructive/10"
                                onClick={() => handleDelete(property.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!loading && filteredProperties.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No properties found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}