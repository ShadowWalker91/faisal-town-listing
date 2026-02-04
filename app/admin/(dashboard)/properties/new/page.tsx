"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase" 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
// CRITICAL: Only import PROPERTY_TYPES. Do NOT import SECTORS.
import { PROPERTY_TYPES } from "@/lib/types" 
import { ArrowLeft, Save, Upload, X, Home } from "lucide-react"

export default function NewPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

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
    agent_id: "", 
  })

  useEffect(() => {
    async function loadData() {
      // 1. Fetch Sectors from Supabase
      const { data: sData, error: sError } = await supabase
        .from('sectors')
        .select('*')
        .order('name', { ascending: true })
      
      if (sError) console.error("Error loading sectors:", sError)

      // 2. Fetch Agents from Supabase
      const { data: aData, error: aError } = await supabase
        .from('agents')
        .select('*')
        .order('name', { ascending: true })

      if (aError) console.error("Error loading agents:", aError)

      setSectorsList(sData || [])
      setAgentsList(aData || [])
    }
    loadData()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...files])
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const imageUrls: string[] = []
      for (const file of imageFiles) {
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
        const { error } = await supabase.storage.from('property-images').upload(fileName, file)
        if (error) throw error
        const { data: publicUrlData } = supabase.storage.from('property-images').getPublicUrl(fileName)
        imageUrls.push(publicUrlData.publicUrl)
      }

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
        images: imageUrls,
        agent_id: formData.agent_id ? Number(formData.agent_id) : null 
      }

      const { error: insertError } = await supabase.from('properties').insert([dbData])
      if (insertError) throw insertError

      alert("Property saved successfully!")
      router.push("/admin/properties")

    } catch (error: any) {
      alert("Error saving property: " + error.message)
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

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/properties"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Link>
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-foreground">Add New Property</h1>
                <p className="text-muted-foreground">Fill in the details below to publish a new listing.</p>
            </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* LEFT COLUMN - MAIN FORM */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. BASIC INFORMATION */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Key details about the property listing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex flex-col gap-3">
                  <Label htmlFor="title" className="text-base">Property Title</Label>
                  <Input
                    id="title"
                    className="h-11"
                    placeholder="e.g., Ultra Modern 5 Marla House in Sector A"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="description" className="text-base">Description</Label>
                  <Textarea
                    id="description"
                    className="min-h-[120px] resize-y"
                    placeholder="Describe the key features, condition, and surroundings..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                  />
                </div>
                
                {/* Image Upload */}
                <div className="flex flex-col gap-3">
                  <Label className="text-base">Property Images</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-primary/50 hover:bg-primary/5">
                      <Label htmlFor="images" className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3">
                        <div className="p-3 bg-background rounded-full shadow-sm">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-semibold text-foreground">Click to Upload</span>
                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP</p>
                        </div>
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
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-xl border bg-muted overflow-hidden group">
                        <img src={src} alt="Preview" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-destructive shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <Label className="text-base">Listing Type</Label>
                    <Select
                      value={formData.listingType}
                      onValueChange={(value) => handleChange("listingType", value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label className="text-base">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => {
                        handleChange("category", value)
                        const firstType = PROPERTY_TYPES.find((t) => t.category === value)
                        if (firstType) handleChange("propertyType", firstType.value)
                      }}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="plot">Plot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Label className="text-base">Property Sub-Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleChange("propertyType", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select Sub-Type" />
                    </SelectTrigger>
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

            {/* 2. PROPERTY DETAILS */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Specifications and dimensions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex flex-col gap-3">
                    <Label className="text-base">Price (PKR)</Label>
                    <Input
                      type="number"
                      className="h-11"
                      placeholder="15000000"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label className="text-base">Area Size</Label>
                    <Input
                      type="number"
                      className="h-11"
                      placeholder="5"
                      value={formData.area}
                      onChange={(e) => handleChange("area", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label className="text-base">Unit</Label>
                    <Select
                      value={formData.areaUnit}
                      onValueChange={(value) => handleChange("areaUnit", value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marla">Marla</SelectItem>
                        <SelectItem value="kanal">Kanal</SelectItem>
                        <SelectItem value="sqft">Sq.ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.category === "residential" && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <Label className="text-base">Bedrooms</Label>
                      <Input
                        type="number"
                        className="h-11"
                        placeholder="e.g. 4"
                        value={formData.bedrooms}
                        onChange={(e) => handleChange("bedrooms", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label className="text-base">Bathrooms</Label>
                      <Input
                        type="number"
                        className="h-11"
                        placeholder="e.g. 3"
                        value={formData.bathrooms}
                        onChange={(e) => handleChange("bathrooms", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Label className="text-base">Features</Label>
                  <Input
                    className="h-11"
                    placeholder="e.g. Lawn, Garage, Servant Quarter, Solar Panels (Comma separated)"
                    value={formData.features}
                    onChange={(e) => handleChange("features", e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-3 rounded-lg border p-4 bg-muted/20">
                  <Checkbox
                    id="readyToMove"
                    className="h-5 w-5"
                    checked={formData.readyToMove}
                    onCheckedChange={(checked) => handleChange("readyToMove", checked as boolean)}
                  />
                  <label htmlFor="readyToMove" className="text-sm font-medium leading-none cursor-pointer">
                    This property is Ready to Move
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* 3. LOCATION */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where is this property located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <Label className="text-base">Sector</Label>
                    <Select
                      value={formData.sector}
                      onValueChange={(value) => handleChange("sector", value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectorsList.length > 0 ? (
                            sectorsList.map((sector) => (
                            <SelectItem key={sector.id} value={sector.name}>
                                {sector.name}
                            </SelectItem>
                            ))
                        ) : (
                            <div className="p-2 text-sm text-muted-foreground text-center">No sectors found. Add one in Admin.</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label className="text-base">Street (Optional)</Label>
                    <Input
                      className="h-11"
                      placeholder="e.g. Street 12"
                      value={formData.street}
                      onChange={(e) => handleChange("street", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Label className="text-base">Full Address</Label>
                  <Input
                    className="h-11"
                    placeholder="e.g. House #45, Street 12, Sector A, Faisal Town, Islamabad"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Publish Actions */}
            <Card className="sticky top-8 border-emerald-100 shadow-lg shadow-emerald-500/5">
              <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
                <CardTitle className="text-emerald-900">Publish Listing</CardTitle>
                <CardDescription>Review and save your property.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col gap-3 mb-4">
                    <Label className="text-base">Assign Agent</Label>
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
                            {agent.name} {agent.company ? `(${agent.company})` : ''}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Saving..." : "Save Property"}
                </Button>
                
                <Button type="button" variant="outline" className="w-full h-11 border-dashed" asChild>
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