"use client"

import { Button } from "@/components/ui/button"
import { Phone, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase-client" // <--- 1. CHANGED IMPORT
import { sendGAEvent } from "@next/third-parties/google"

interface ContactButtonsProps {
  propertyId: number
  agentPhone: string
  agentWhatsapp: string
  propertyTitle: string
}

export function PropertyContactButtons({ propertyId, agentPhone, agentWhatsapp, propertyTitle }: ContactButtonsProps) {
  // 2. INITIALIZE CLIENT
  const supabase = createClient()

  const handleCallClick = async () => {
    // 1. Update Database
    await supabase.rpc('increment_call', { row_id: propertyId })
    // 2. Send GA Event
    sendGAEvent('event', 'click_call', { property_id: propertyId, property_title: propertyTitle })
  }

  const handleWhatsappClick = async () => {
    // 1. Update Database
    await supabase.rpc('increment_whatsapp', { row_id: propertyId })
    // 2. Send GA Event
    sendGAEvent('event', 'click_whatsapp', { property_id: propertyId, property_title: propertyTitle })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Call Button */}
      <Button 
        className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white"
        asChild
        onClick={handleCallClick}
      >
        <a href={`tel:${agentPhone}`}>
          <Phone className="mr-2 h-4 w-4" /> Call
        </a>
      </Button>

      {/* WhatsApp Button */}
      <Button 
        className="w-full rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white"
        asChild
        onClick={handleWhatsappClick}
      >
        <a 
          href={`https://wa.me/${agentWhatsapp}?text=Hi, I am interested in ${propertyTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
        </a>
      </Button>
    </div>
  )
}