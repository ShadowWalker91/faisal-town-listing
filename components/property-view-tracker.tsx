"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-client" // <--- 1. Import createClient instead
import { sendGAEvent } from "@next/third-parties/google"

interface PropertyViewTrackerProps {
  propertyId: string | number
  propertyTitle: string
}

export function PropertyViewTracker({ propertyId, propertyTitle }: PropertyViewTrackerProps) {
  const hasRun = useRef(false)
  const supabase = createClient() // <--- 2. Initialize the client here

  useEffect(() => {
    if (hasRun.current) return 
    hasRun.current = true

    async function trackView() {
      // 3. Use the initialized 'supabase' client
      const { error } = await supabase.rpc('increment_view', { row_id: Number(propertyId) })
      
      if (error) console.error("Error tracking view:", error)

      sendGAEvent('event', 'property_view', {
        event_category: 'engagement',
        event_label: propertyTitle,
        value: 1,
        property_id: propertyId
      })
    }

    trackView()
  }, [propertyId, propertyTitle, supabase])

  return null
}