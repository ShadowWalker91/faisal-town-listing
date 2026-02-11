"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, Trash, User, Pencil, X } from "lucide-react"
import { toast } from "sonner" // Optional: Use if you have a toast library, otherwise use alert

export default function ManageAgentsPage() {
  const supabase = createClient()
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // --- EDIT STATE ---
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null)

  // --- FORM STATE ---
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null) 
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const BUCKET_NAME = "faisalTownListitngBucket" 

  useEffect(() => {
    fetchAgents()
  }, [])

  async function fetchAgents() {
    const { data } = await supabase.from("agents").select("*").order("created_at", { ascending: false })
    if (data) setAgents(data)
  }

  // --- HANDLE IMAGE SELECTION ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file)) 
    }
  }

  // --- RESET FORM ---
  const resetForm = () => {
    setName("")
    setCompany("")
    setPhone("")
    setWhatsapp("")
    setImageFile(null)
    setImagePreview(null)
    setIsEditing(false)
    setEditId(null)
    setOldImageUrl(null)
  }

  // --- LOAD AGENT INTO FORM (EDIT MODE) ---
  const handleEditClick = (agent: any) => {
    setIsEditing(true)
    setEditId(agent.id)
    setName(agent.name)
    setCompany(agent.company)
    setPhone(agent.phone)
    setWhatsapp(agent.whatsapp)
    setOldImageUrl(agent.image_url)
    setImagePreview(agent.image_url) // Show current image
    setImageFile(null) // Reset file input
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- SUBMIT (CREATE OR UPDATE) ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = oldImageUrl // Default to existing image

      // 1. If New Image Selected -> Upload It
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME) 
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName)

        finalImageUrl = publicUrl

        // If editing, delete the OLD image to save space
        if (isEditing && oldImageUrl) {
           const oldFileName = oldImageUrl.split('/').pop()?.split('?')[0]
           if (oldFileName) {
             await supabase.storage.from(BUCKET_NAME).remove([oldFileName])
           }
        }
      }

      const agentData = {
        name,
        company,
        phone,
        whatsapp,
        image_url: finalImageUrl,
      }

      if (isEditing && editId) {
        // --- UPDATE EXISTING ---
        const { error } = await supabase
          .from("agents")
          .update(agentData)
          .eq("id", editId)
        
        if (error) throw error
        alert("Agent updated successfully!")
      } else {
        // --- CREATE NEW ---
        const { error } = await supabase
          .from("agents")
          .insert([agentData])
        
        if (error) throw error
        alert("Agent created successfully!")
      }

      resetForm()
      fetchAgents()

    } catch (error: any) {
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // --- DELETE LOGIC ---
  async function handleDelete(id: string, imageUrl: string | null) {
    if (!confirm("Are you sure? This action cannot be undone.")) return
    setDeletingId(id)

    try {
      // 1. Attempt DB Delete
      const { error: dbError } = await supabase.from("agents").delete().eq("id", id)

      if (dbError) {
        if (dbError.code === '23503') {
           alert("Cannot delete: This agent is assigned to a property. Please reassign the property first.")
        } else {
           alert("Database Error: " + dbError.message)
        }
        return
      }

      // 2. If DB delete worked, try to delete image (Don't crash if this fails)
      if (imageUrl) {
        const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('?')[0]
        if (fileName) {
          await supabase.storage.from(BUCKET_NAME).remove([fileName])
        }
      }

      fetchAgents()
      // If we deleted the agent currently being edited, reset form
      if (isEditing && editId === id) resetForm()

    } catch (error: any) {
      alert("Unexpected Error: " + error.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Agents</h1>
        {isEditing && (
          <Button variant="outline" onClick={resetForm} className="border-red-200 text-red-600 hover:bg-red-50">
            <X className="mr-2 h-4 w-4" /> Cancel Editing
          </Button>
        )}
      </div>

      {/* --- FORM SECTION --- */}
      <Card className={`transition-all duration-300 ${isEditing ? 'border-[#b800ff] ring-1 ring-[#b800ff]' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isEditing ? <Pencil className="h-5 w-5 text-[#b800ff]" /> : <User className="h-5 w-5" />}
            {isEditing ? "Edit Agent Details" : "Add New Agent"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Ali Khan" />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="e.g. Sky High Properties" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+923001234567" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required placeholder="923001234567" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Agent Picture {isEditing && "(Leave empty to keep current)"}</Label>
              <div className="flex items-center gap-4 rounded-md border border-dashed border-slate-300 p-4">
                <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer bg-white" />
                {imagePreview ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 shadow-sm">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <User className="h-8 w-8" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-[#b800ff] hover:bg-[#b800ff]/90 text-white" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? <Pencil className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />)}
                {loading ? "Processing..." : (isEditing ? "Update Agent" : "Save Agent")}
              </Button>
              
              {isEditing && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- AGENTS LIST --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className={`overflow-hidden transition-all ${isEditing && editId === agent.id ? 'opacity-50 pointer-events-none' : 'hover:shadow-md'}`}>
            <CardContent className="flex items-center gap-4 p-4">
              {/* Agent Image */}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-100 shadow-sm bg-slate-100">
                {agent.image_url ? (
                  <Image src={agent.image_url} alt={agent.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 overflow-hidden">
                <p className="font-bold truncate text-base">{agent.name}</p>
                <p className="text-xs text-muted-foreground truncate">{agent.company}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-blue-600 hover:bg-blue-50"
                  onClick={() => handleEditClick(agent)}
                  title="Edit Agent"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50" 
                  onClick={() => handleDelete(agent.id, agent.image_url)}
                  disabled={deletingId === agent.id}
                  title="Delete Agent"
                >
                  {deletingId === agent.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}