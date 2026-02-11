"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
// NOTE: Removed SECTORS import to use dynamic DB data instead
import { PROPERTY_TYPES } from "@/lib/types"
import { ArrowLeft, Save, Upload, X, Loader2, Star } from "lucide-react"

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Image State
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  // Dynamic Lists State
  const [sectorsList, setSectorsList] = useState<any[]>([])
  const [agentsList, setAgentsList] = useState<any[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    listingType: "buy",
    category: "residential",
    propertyType: "house",
    bedrooms: "",
    bathrooms: "",
    area: "",
    areaUnit: "marla",
    sector: "",
    street: "",
    address: "",
    features: "",
    readyToMove: false,
    isFeatured: false, // Ensure this exists in initial state
    agent_id: "",
  })

  // 1. Fetch Data on Load
  useEffect(() => {
    async function fetchData() {
      if (!id) return

      try {
        // A. Load Select Options (Sectors & Agents)
        const { data: sData } = await supabase.from('sectors').select('*').order('name', { ascending: true })
        setSectorsList(sData || [])

        const { data: aData } = await supabase.from('agents').select('*').order('name', { ascending: true })
        setAgentsList(aData || [])

        // B. Load Property Data
        const { data: property, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        // C. Populate Form
        setFormData({
          title: property.title,
          description: property.description || "",
          price: property.price,
          listingType: property.listing_type,
          category: property.category,
          propertyType: property.property_type,
          bedrooms: property.bedrooms || "",
          bathrooms: property.bathrooms || "",
          area: property.area,
          areaUnit: property.area_unit,
          sector: property.sector, // This matches s.name from DB
          street: property.street || "",
          address: property.address,
          features: property.features ? property.features.join(", ") : "",
          readyToMove: property.ready_to_move,
          isFeatured: property.is_featured || false, // Correctly mapped
          agent_id: property.agent_id ? property.agent_id.toString() : "",
        })

        if (property.images) setExistingImages(property.images)
      } catch (error: any) {
        alert("Error loading data: " + error.message)
        router.push('/admin/properties')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  // Handle New Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...files])
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (urlToRemove: string) => {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Upload NEW Images
      const newImageUrls: string[] = []
      for (const file of imageFiles) {
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
        const { error } = await supabase.storage
          .from('property-images')
          .upload(fileName, file)

        if (error) throw error
        
        const { data: publicUrlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName)
          
        newImageUrls.push(publicUrlData.publicUrl)
      }

      // Combine Old + New Images
      const finalImages = [...existingImages, ...newImageUrls]

      // 2. Prepare Data
      const dbData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        listing_type: formData.listingType,
        category: formData.category,
        property_type: formData.propertyType,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        area: Number(formData.area),
        area_unit: formData.areaUnit,
        sector: formData.sector,
        street: formData.street,
        address: formData.address,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
        ready_to_move: formData.readyToMove,
        is_featured: formData.isFeatured, // Sending TRUE/FALSE correctly
        images: finalImages,
        agent_id: formData.agent_id ? Number(formData.agent_id) : null
      }

      // 3. Update
      const { error: updateError } = await supabase
        .from('properties')
        .update(dbData)
        .eq('id', id)

      if (updateError) throw updateError

      alert("Property Updated Successfully!")
      router.push("/admin/properties")

    } catch (error: any) {
      alert("Error updating: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const filteredPropertyTypes = PROPERTY_TYPES.filter(
    (type) => type.category === formData.category
  )

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-2">Loading Property Data...</span>
        </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/properties"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Edit Property</h1>
        <p className="text-muted-foreground">Update the details of your listing</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                  />
                </div>
                
                {/* IMAGE MANAGEMENT */}
                <div>
                  <Label>Property Images</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {/* Uploader */}
                    <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50">
                      <Label htmlFor="images" className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add New</span>
                        <Input 
                          id="images" 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </Label>
                    </div>

                    {/* Existing Images */}
                    {existingImages.map((src, index) => (
                      <div key={`old-${index}`} className="relative aspect-square rounded-lg border border-border bg-muted">
                        <img src={src} alt="Existing" className="h-full w-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(src)}
                          className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-[10px] text-white">Saved</span>
                      </div>
                    ))}

                    {/* New Images Preview */}
                    {imagePreviews.map((src, index) => (
                      <div key={`new-${index}`} className="relative aspect-square rounded-lg border border-border bg-muted">
                        <img src={src} alt="New Preview" className="h-full w-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 rounded bg-emerald-600 px-1 text-[10px] text-white">New</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Listing Type</Label>
                    <Select
                      value={formData.listingType}
                      onValueChange={(value) => handleChange("listingType", value)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => {
                        handleChange("category", value)
                        const firstType = PROPERTY_TYPES.find((t) => t.category === value)
                        if (firstType) handleChange("propertyType", firstType.value)
                      }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="plot">Plot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleChange("propertyType", value)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {filteredPropertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Area</Label>
                    <Input
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleChange("area", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Area Unit</Label>
                    <Select
                      value={formData.areaUnit}
                      onValueChange={(value) => handleChange("areaUnit", value)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marla">Marla</SelectItem>
                        <SelectItem value="kanal">Kanal</SelectItem>
                        <SelectItem value="sqft">Sq.ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {formData.category === "residential" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Bedrooms</Label>
                      <Input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleChange("bedrooms", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <Input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => handleChange("bathrooms", e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <Label>Features (comma separated)</Label>
                  <Input
                    value={formData.features}
                    onChange={(e) => handleChange("features", e.target.value)}
                  />
                </div>

                {/* FEATURED & READY TO MOVE CHECKBOXES */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 rounded-lg border p-4 bg-muted/20">
                        <Checkbox
                            id="readyToMove"
                            checked={formData.readyToMove}
                            onCheckedChange={(checked) => handleChange("readyToMove", checked as boolean)}
                        />
                        <label htmlFor="readyToMove" className="text-sm font-medium cursor-pointer">
                            Ready to Move
                        </label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border p-4 bg-amber-50/50 border-amber-100">
                        <Checkbox
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onCheckedChange={(checked) => handleChange("isFeatured", checked as boolean)}
                            className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
                        <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                            Mark as Featured <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        </label>
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Sector</Label>
                    <Select
                      value={formData.sector}
                      onValueChange={(value) => handleChange("sector", value)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select Sector" /></SelectTrigger>
                      <SelectContent>
                        {sectorsList.length > 0 ? (
                            sectorsList.map((sector) => (
                            <SelectItem key={sector.id} value={sector.name}>
                                {sector.name}
                            </SelectItem>
                            ))
                        ) : (
                            <div className="p-2 text-sm text-center text-muted-foreground">Loading sectors...</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Street</Label>
                    <Input
                      value={formData.street}
                      onChange={(e) => handleChange("street", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Full Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-8 border-emerald-100 shadow-lg shadow-emerald-500/5">
              <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
                <CardTitle className="text-emerald-900">Update Property</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Agent Selection */}
                <div className="flex flex-col gap-3 mb-4">
                    <Label>Assign Agent</Label>
                    <Select 
                        value={formData.agent_id} 
                        onValueChange={(value) => handleChange("agent_id", value)}
                    >
                        <SelectTrigger className="h-11 bg-white">
                            <SelectValue placeholder="Select Agent" />
                        </SelectTrigger>
                        <SelectContent>
                        {agentsList.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id.toString()}>
                                {agent.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-12"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Updating..." : "Update Property"}
                </Button>
                <Button type="button" variant="outline" className="w-full h-11" asChild>
                  <Link href="/admin/properties">Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}