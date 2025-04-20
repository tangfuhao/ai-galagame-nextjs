"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface BackgroundProps {
  src: string
}

export function Background({ src }: BackgroundProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [previousSrc, setPreviousSrc] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // If the src changes, start a transition
    if (src !== currentSrc) {
      setPreviousSrc(currentSrc)
      setCurrentSrc(src)
      setIsTransitioning(true)

      // After transition completes, remove the old background
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setPreviousSrc(null)
      }, 500) // Match this with the CSS transition duration

      return () => clearTimeout(timer)
    }
  }, [src, currentSrc])

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Current background with fade-in */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <Image src={currentSrc || "/placeholder.svg"} alt="Background" fill priority className="object-cover" />
      </div>

      {/* Previous background with fade-out */}
      {previousSrc && isTransitioning && (
        <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100">
          <Image
            src={previousSrc || "/placeholder.svg"}
            alt="Previous Background"
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
    </div>
  )
}
