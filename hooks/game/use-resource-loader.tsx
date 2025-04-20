"use client"

import { useState, useEffect } from "react"

interface Resource {
  type: "sprite" | "audio" | "background"
  name: string
  versioned_url: string
  preload_priority: number
}

export function useResourceLoader(resources: Resource[]) {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set())
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (!resources.length) {
      setLoadingProgress(100)
      return
    }

    // Sort resources by priority
    const sortedResources = [...resources].sort((a, b) => a.preload_priority - b.preload_priority)

    let loaded = 0
    const totalToLoad = sortedResources.length

    // Load resources in parallel but track them in priority order
    const loadResource = async (resource: Resource) => {
      try {
        if (resource.type === "sprite" || resource.type === "background") {
          // Preload image
          const img = new Image()
          img.src = resource.versioned_url
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })
        } else if (resource.type === "audio") {
          // Preload audio
          const audio = new Audio()
          audio.src = resource.versioned_url
          await new Promise((resolve, reject) => {
            audio.oncanplaythrough = resolve
            audio.onerror = reject
          })
        }

        // Mark as loaded
        setLoadedResources((prev) => new Set([...prev, resource.name]))
        loaded++
        setLoadingProgress(Math.floor((loaded / totalToLoad) * 100))
      } catch (error) {
        console.error(`Failed to load resource ${resource.name}:`, error)
        // Still increment counter to avoid getting stuck
        loaded++
        setLoadingProgress(Math.floor((loaded / totalToLoad) * 100))
      }
    }

    // Start loading all resources
    Promise.all(sortedResources.map(loadResource))
  }, [resources])

  return { loadedResources, loadingProgress }
}
