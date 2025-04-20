"use client"

import { useState, useEffect, useRef } from "react"

interface NarrationBoxProps {
  text: string
  isComplete: boolean
  onComplete: () => void
}

export function NarrationBox({ text, isComplete, onComplete }: NarrationBoxProps) {
  const [displayedText, setDisplayedText] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const textRef = useRef(text)

  // Text typing effect
  useEffect(() => {
    // Reset when text changes
    textRef.current = text
    setDisplayedText("")

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Start typing animation
    let index = 0
    timerRef.current = setInterval(() => {
      if (index < text.length) {
        // Add the current character to the displayed text
        const nextChar = text.charAt(index)
        setDisplayedText((prev) => prev + nextChar)
        index++
      } else {
        // Text is fully displayed
        onComplete()
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
    }, 30)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [text, onComplete])

  // Handle forced completion
  useEffect(() => {
    if (isComplete && displayedText !== textRef.current) {
      // Force complete the text
      setDisplayedText(textRef.current)

      // Clear the typing timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isComplete, displayedText])

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 mb-4 mx-4 pointer-events-none">
      <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
        <div className="min-h-[60px]">
          {displayedText}
          {displayedText !== text && <span className="animate-pulse">|</span>}
        </div>
      </div>
    </div>
  )
}
