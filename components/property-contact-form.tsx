"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Phone, MessageCircle, User, Building2, Send, Mail } from "lucide-react"

interface PropertyContactFormProps {
  property: {
    title: string
    price: number
    id: string
    address: string
    listingType: string
  }
  // New props for dynamic agent data
  agent?: {
    name: string
    company: string
    phone: string
    whatsapp: string
    imageUrl?: string | null // Optional image URL
  }
}

export function PropertyContactForm({ property, agent }: PropertyContactFormProps) {
  // --- DEFAULT VALUES (Fallback if no agent assigned) ---
  const defaultAgent = {
    name: "Anees Anjum",
    company: "Faisal Town Properties",
    phone: "+923331234567",
    whatsapp: "923331234567",
    imageUrl: null
  }

  const activeAgent = agent || defaultAgent

  // --- FORM STATE ---
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSameWhatsApp, setIsSameWhatsApp] = useState(true)
  const [whatsapp, setWhatsapp] = useState("")
  const [message, setMessage] = useState("I am interested in this property. Please provide more details.")
  const [isOpen, setIsOpen] = useState(false) // Controls the popup

  // --- HANDLERS ---
  const handleCall = () => {
    window.location.href = `tel:${activeAgent.phone}`
  }

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(`Hi, I'm interested in ${property.title} (ID: FT-${property.id}).`)
    window.open(`https://wa.me/${activeAgent.whatsapp}?text=${text}`, "_blank")
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    const finalWhatsApp = isSameWhatsApp ? phone : whatsapp
    
    // Construct Email
    const subject = encodeURIComponent(`Inquiry for: ${property.title} (FT-${property.id})`)
    const body = encodeURIComponent(
      `Hi, I am interested in the following property:\n\n` +
      `Property: ${property.title}\n` +
      `Price: PKR ${property.price.toLocaleString()}\n` +
      `Location: ${property.address}\n\n` +
      `--- MY CONTACT DETAILS ---\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `WhatsApp: ${finalWhatsApp}\n\n` +
      `Message: ${message}`
    )

    window.location.href = `mailto:aneesanjum91@gmail.com?subject=${subject}&body=${body}`
    setIsOpen(false) // Close popup after clicking send
  }

  return (
    <Card className="sticky top-20 shadow-lg border-emerald-100 overflow-hidden">
      <CardContent className="p-0">
        
        {/* 1. AGENT INFO SECTION */}
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {/* AGENT AVATAR LOGIC */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-white border-2 border-white shadow-sm">
              {activeAgent.imageUrl ? (
                <Image 
                  src={activeAgent.imageUrl} 
                  alt={activeAgent.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200">
                  <User className="h-8 w-8 text-slate-500" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-slate-900">{activeAgent.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <Building2 className="h-3 w-3" />
                <span>{activeAgent.company}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ACTION BUTTONS (Visible on Page) */}
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleCall} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              <Phone className="mr-2 h-4 w-4" /> Call
            </Button>
            <Button onClick={handleWhatsAppChat} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white border-none">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </Button>
          </div>

          {/* 3. SEND MESSAGE POPUP TRIGGER */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                <Mail className="mr-2 h-4 w-4" /> Send Message via Email
              </Button>
            </DialogTrigger>
            
            {/* 4. POPUP FORM CONTENT */}
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Contact Agent</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSendEmail} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Input 
                    placeholder="Your Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                  <Input 
                    placeholder="Contact Number" 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                  />
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="same-wa-popup"
                      checked={isSameWhatsApp}
                      onChange={(e) => setIsSameWhatsApp(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                    />
                    <label htmlFor="same-wa-popup" className="text-xs text-slate-600 cursor-pointer">
                      Same number on WhatsApp
                    </label>
                  </div>

                  {!isSameWhatsApp && (
                    <Input 
                      placeholder="WhatsApp Number" 
                      type="tel" 
                      value={whatsapp} 
                      onChange={(e) => setWhatsapp(e.target.value)} 
                    />
                  )}

                  <Textarea
                    placeholder="I am interested in..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Send className="mr-2 h-4 w-4" /> Send Email Now
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}