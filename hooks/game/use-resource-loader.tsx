"use client"

import { useState, useEffect } from "react"
import { Resource } from "@/types/game"

export function useResourceLoader(dependencies: Resource[]) {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadResources = async () => {
      const totalResources = dependencies.length
      if (totalResources === 0) {
        setLoadingProgress(100)
        setIsLoading(false)
        return
      }

      let loadedCount = 0

      const loadPromises = dependencies.map((resource) => {
        return new Promise<void>((resolve) => {
          if (resource.url.endsWith(".mp3") || resource.url.endsWith(".wav")) {
            // Load audio
            const audio = new Audio()
            audio.src = resource.url
            audio.oncanplaythrough = () => {
              loadedCount++
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100))
              resolve()
            }
            audio.onerror = () => {
              console.error(`Failed to load audio: ${resource.url}`)
              loadedCount++
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100))
              resolve()
            }
          } else {
            // Load image
            const img = new Image()
            img.src = resource.url
            img.onload = () => {
              loadedCount++
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100))
              resolve()
            }
            img.onerror = () => {
              console.error(`Failed to load image: ${resource.url}`)
              loadedCount++
              setLoadingProgress(Math.round((loadedCount / totalResources) * 100))
              resolve()
            }
          }
        })
      })

      await Promise.all(loadPromises)
      setIsLoading(false)
    }

    loadResources()
  }, [dependencies])

  return { loadingProgress, isLoading }
}
