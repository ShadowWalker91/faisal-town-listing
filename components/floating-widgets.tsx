"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, Send, CheckSquare } from "lucide-react" // Removed MessageCircle
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function FloatingWidgets() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    sameAsPhone: false,
    category: "Sale",
    propertyType: "Residential",
    block: "Block A",
    price: "", // New field for Price or Rent
    details: ""
  })

  // Sync WhatsApp with Phone if checked
  useEffect(() => {
    if (formData.sameAsPhone) {
      setFormData(prev => ({ ...prev, whatsapp: prev.phone }))
    }
  }, [formData.phone, formData.sameAsPhone])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Construct the Email Body
    const subject = `New Property Submission: ${formData.category} - ${formData.propertyType}`
    
    let priceFieldLabel = formData.category === 'Sale' ? 'Price' : 'Rent per month';
    
    const body = `
Name: ${formData.name}
Contact: ${formData.phone}
WhatsApp: ${formData.whatsapp}

Category: ${formData.category}
Property Type: ${formData.propertyType}
Block: ${formData.block}
${priceFieldLabel}: ${formData.price}

Details:
${formData.details}
    `.trim()

    // 2. Open Mail Client
    window.open(`mailto:aneesanjum91@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    
    // 3. Show Success Message and then Close
    setIsSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsSubmitted(false)
      setFormData({
        name: "",
        phone: "",
        whatsapp: "",
        sameAsPhone: false,
        category: "Sale",
        propertyType: "Residential",
        block: "Block A",
        price: "",
        details: ""
      })
    }, 3000) // Close after 3 seconds
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
      
      {/* 1. WHATSAPP BUTTON (Direct Chat) */}
      <a 
        href="https://wa.me/923438900590"
        target="_blank" 
        rel="noopener noreferrer"
        className="group flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300"
        title="Chat on WhatsApp"
      >
        {/* Custom SVG for official WhatsApp Icon */}
        <svg 
          viewBox="0 0 24 24" 
          className="h-8 w-8 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      {/* 2. SUBMIT PROPERTY BUTTON */}
      <Button 
        onClick={() => setIsOpen(true)}
        className="h-14 w-auto px-6 rounded-full bg-[#b800ff] text-white shadow-lg hover:bg-[#a300e6] hover:scale-105 transition-all duration-300"
      >
        <Plus className="h-5 w-5 mr-2" />
        Submit Property
      </Button>

      {/* 3. POP-UP FORM MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-[#b800ff] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Submit Your Property</h3>
              <button onClick={() => { setIsOpen(false); setIsSubmitted(false); }} className="hover:bg-white/20 p-1 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conditional Rendering: Success Message or Form */}
            {isSubmitted ? (
              <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <CheckSquare className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                <p className="text-gray-600">Your property details have been submitted. We will reach out to you soon.</p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                
                {/* Name */}
                <div>
                  <Label className="mb-1">Full Name</Label>
                  <Input 
                    required 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <Label className="mb-1">Contact (Phone)</Label>
                  <Input 
                    required 
                    type="tel" 
                    placeholder="0300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                {/* WhatsApp Logic */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                     <Checkbox 
                        id="sameAsPhone" 
                        checked={formData.sameAsPhone}
                        onCheckedChange={(checked) => setFormData({...formData, sameAsPhone: checked as boolean})}
                     />
                     <label htmlFor="sameAsPhone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                       WhatsApp same as Phone Number?
                     </label>
                  </div>
                  
                  {!formData.sameAsPhone && (
                    <Input 
                      type="tel" 
                      placeholder="WhatsApp Number"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  )}
                </div>

                {/* Category & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <Label className="mb-1">Category</Label>
                     <Select 
                       value={formData.category} 
                       onValueChange={(val) => setFormData({...formData, category: val})}
                     >
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Sale">Sale</SelectItem>
                         <SelectItem value="Rent">Rent</SelectItem>
                       </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label className="mb-1">Property Type</Label>
                     <Select 
                       value={formData.propertyType} 
                       onValueChange={(val) => setFormData({...formData, propertyType: val})}
                     >
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Residential">Residential</SelectItem>
                         <SelectItem value="Commercial">Commercial</SelectItem>
                         <SelectItem value="Plot">Plot</SelectItem>
                         <SelectItem value="House">House</SelectItem>
                         <SelectItem value="Apartment">Apartment</SelectItem>
                       </SelectContent>
                     </Select>
                  </div>
                </div>

                {/* Price or Rent - Conditional Field */}
                <div>
                  <Label className="mb-1">{formData.category === 'Sale' ? 'Price (PKR)' : 'Rent per month (PKR)'}</Label>
                  <Input
                    required
                    type="text"
                    placeholder={formData.category === 'Sale' ? 'e.g. 1 Crore' : 'e.g. 50,000'}
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                {/* Blocks */}
                <div>
                  <Label className="mb-1">Block (Faisal Town)</Label>
                  <Select 
                    value={formData.block} 
                    onValueChange={(val) => setFormData({...formData, block: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Block A">Block A</SelectItem>
                      <SelectItem value="Block B">Block B</SelectItem>
                      <SelectItem value="Block B1">Block B1</SelectItem>
                      <SelectItem value="Block C">Block C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Details */}
                <div>
                  <Label className="mb-1">Property Details</Label>
                  <Textarea 
                    placeholder="Size, Location features, Demand..."
                    className="h-24"
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#b800ff] hover:bg-[#a300e6]" 
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Property
                </Button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  )
}