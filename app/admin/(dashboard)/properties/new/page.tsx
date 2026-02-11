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
import { PROPERTY_TYPES } from "@/lib/types" 
import { ArrowLeft, Save, Upload, X, Home, Star, Loader2 } from "lucide-react"

export default function NewPropertyPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false) // Fix for hydration mismatch
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
    isFeatured: false,
    agent_id: "", 
  })

  useEffect(() => {
    setMounted(true)
    async function loadData() {
      const { data: sData } = await supabase.from('sectors').select('*').order('name', { ascending: true })
      const { data: aData } = await supabase.from('agents').select('*').order('name', { ascending: true })
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
      // FIXED: Using your actual bucket name 'faisalTownListitngBucket'
      for (const file of imageFiles) {
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
        
        const { error } = await supabase.storage
          .from('faisalTownListitngBucket') 
          .upload(fileName, file)
          
        if (error) throw error
        
        const { data: publicUrlData } = supabase.storage
          .from('faisalTownListitngBucket')
          .getPublicUrl(fileName)
          
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
        is_featured: formData.isFeatured,
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

  if (!mounted) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-8">
        <Link href="/admin/properties" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
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
          
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Key details about the property listing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex flex-col gap-3">
                  <Label htmlFor="title">Property Title</Label>
                  <Input id="title" className="h-11" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
                </div>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" className="min-h-[120px] resize-y" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} required />
                </div>
                
                <div className="flex flex-col gap-3">
                  <Label>Property Images</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:border-primary/50">
                      <Label htmlFor="images" className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Upload</span>
                        <Input id="images" type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                      </Label>
                    </div>
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-xl border bg-muted overflow-hidden group">
                        <img src={src} alt="Preview" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 rounded-full bg-white p-1 text-destructive opacity-0 group-hover:opacity-100">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <Label>Listing Type</Label>
                    <Select value={formData.listingType} onValueChange={(value) => handleChange("listingType", value)}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(value) => {
                        handleChange("category", value)
                        const firstType = PROPERTY_TYPES.find((t) => t.category === value)
                        if (firstType) handleChange("propertyType", firstType.value)
                      }}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="plot">Plot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Property Sub-Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleChange("propertyType", value)}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {filteredPropertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
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
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex flex-col gap-3">
                    <Label>Price (PKR)</Label>
                    <Input type="number" className="h-11" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Area Size</Label>
                    <Input type="number" className="h-11" value={formData.area} onChange={(e) => handleChange("area", e.target.value)} required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Unit</Label>
                    <Select value={formData.areaUnit} onValueChange={(value) => handleChange("areaUnit", value)}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
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
                        <Label>Bedrooms</Label>
                        <Input type="number" className="h-11" value={formData.bedrooms} onChange={(e) => handleChange("bedrooms", e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Bathrooms</Label>
                        <Input type="number" className="h-11" value={formData.bathrooms} onChange={(e) => handleChange("bathrooms", e.target.value)} />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Label>Features</Label>
                  <Input className="h-11" value={formData.features} onChange={(e) => handleChange("features", e.target.value)} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="readyToMove" checked={formData.readyToMove} onCheckedChange={(c) => handleChange("readyToMove", c as boolean)} />
                        <label htmlFor="readyToMove" className="text-sm text-foreground">Ready to Move</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="isFeatured" checked={formData.isFeatured} onCheckedChange={(c) => handleChange("isFeatured", c as boolean)} className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"/>
                        <label htmlFor="isFeatured" className="text-sm text-foreground flex items-center gap-1">Featured <Star className="h-3 w-3 fill-amber-500 text-amber-500"/></label>
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Location</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <Label>Sector</Label>
                    <Select value={formData.sector} onValueChange={(value) => handleChange("sector", value)}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select Sector" /></SelectTrigger>
                      <SelectContent>
                        {sectorsList.map((s) => (<SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Street</Label>
                    <Input className="h-11" value={formData.street} onChange={(e) => handleChange("street", e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Full Address</Label>
                  <Input className="h-11" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} required />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-8 border-emerald-100 shadow-lg shadow-emerald-500/5">
              <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
                <CardTitle className="text-emerald-900">Publish Listing</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col gap-3 mb-4">
                    <Label>Assign Agent</Label>
                    <Select value={formData.agent_id} onValueChange={(value) => handleChange("agent_id", value)}>
                        <SelectTrigger className="h-11 bg-white"><SelectValue placeholder="Select Agent" /></SelectTrigger>
                        <SelectContent>
                        {agentsList.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id.toString()}>{agent.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                  <Save className="mr-2 h-5 w-5" /> {isSubmitting ? "Saving..." : "Save Property"}
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