"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface CharacterProps {
  character: string
  emotion?: string
  position: "left" | "center" | "right"
  oss_url: string
}

interface CharacterState {
  character: string
  emotion: string
  position: "left" | "center" | "right"
  oss_url: string
}

export function Character({ character, emotion = "normal", position, oss_url }: CharacterProps) {
  const [current, setCurrent] = useState<CharacterState>({
    character,
    emotion,
    position,
    oss_url,
  })

  const [previous, setPrevious] = useState<CharacterState | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle changes to character props
  useEffect(() => {
    const hasChanged = character !== current.character || emotion !== current.emotion || position !== current.position

    if (hasChanged) {
      // Store previous state for transition
      setPrevious(current)

      // Update to new state
      setCurrent({
        character,
        emotion,
        position,
        oss_url,
      })

      // Start transition
      setIsTransitioning(true)

      // Clear previous state after transition
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setPrevious(null)
      }, 300) // Match this with the CSS transition duration

      return () => clearTimeout(timer)
    }
  }, [character, emotion, position, current])

  const getPositionClasses = (pos: "left" | "center" | "right") => {
    switch (pos) {
      case "left":
        return "left-10"
      case "center":
        return "left-1/2 -translate-x-1/2"
      case "right":
        return "right-10"
    }
  }

  return (
    <>
      {/* Current character with fade-in */}
      <div
        className={`absolute bottom-32 transition-all duration-300 ease-in-out
          ${getPositionClasses(current.position)}
          ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <Image
          src={current.oss_url}
          alt={current.character}
          width={400}
          height={600}
          priority
          className="object-contain"
          crossOrigin="anonymous"
        />
      </div>

      {/* Previous character with fade-out */}
      {previous && isTransitioning && (
        <div
          className={`absolute bottom-32 transition-all duration-300 ease-in-out opacity-100
            ${getPositionClasses(previous.position)}`}
        >
          <Image
            src={`/characters/${previous.character}/${previous.emotion}.png`}
            alt={previous.character}
            width={400}
            height={600}
            priority
            className="object-contain"
          />
        </div>
      )}
    </>
  )
}
