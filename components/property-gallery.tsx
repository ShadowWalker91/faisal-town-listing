"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  // Always start with the first image
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  // Ensure we have at least a placeholder
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"]

  return (
    <div className="space-y-4">
      {/* MAIN CONTAINER (The large image) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-slate-100 shadow-sm">
        <Image
          src={displayImages[selectedIndex]}
          alt={`${title} - View ${selectedIndex + 1}`}
          fill
          className="object-cover transition-all duration-300"
          priority
        />
      </div>

      {/* THUMBNAIL STRIP (Scrollable) */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                selectedIndex === index 
                  ? "border-[#b800ff] ring-2 ring-[#b800ff]/20" 
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}