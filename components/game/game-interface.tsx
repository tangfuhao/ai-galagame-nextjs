"use client"

import { useState, useEffect } from "react"
import { Background } from "@/components/game/background"
import { Character } from "@/components/game/character"
import { DialogueBox } from "@/components/game/dialogue-box"
import { NarrationBox } from "@/components/game/narration-box"
import { ChoiceOptions } from "@/components/game/choice-options"
import { useGameState } from "@/hooks/game/use-game-state"
import { useResourceLoader } from "@/hooks/game/use-resource-loader"

export function GameInterface({ gameId }: { gameId: string }) {
  const {
    background,
    currentChapter,
    currentCharacter,
    dialogueText,
    narrationText,
    choices,
    isLoading,
    handleChoice,
    handleNextChapter,
    advanceStory,
  } = useGameState(gameId)


  const { loadingProgress } = useResourceLoader(currentChapter?.dependencies || [])

  // Track text completion state
  const [isDialogueComplete, setIsDialogueComplete] = useState(false)
  const [isNarrationComplete, setIsNarrationComplete] = useState(false)

  // Handle click on game area
  const handleGameAreaClick = () => {
    if (choices.length > 0) {
      // Don't advance when choices are showing
      return
    }

    // If either dialogue or narration is not complete, complete it
    if (!isDialogueComplete || !isNarrationComplete) {
      setIsDialogueComplete(true)
      setIsNarrationComplete(true)
    } else {
      // Both are complete, advance to next
      advanceStory()
    }
  }

  // Reset completion state when text changes
  useEffect(() => {
    if (dialogueText) {
      setIsDialogueComplete(false)
    }
  }, [dialogueText])

  useEffect(() => {
    if (narrationText) {
      setIsNarrationComplete(false)
    }
  }, [narrationText])

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center bg-black text-white">
        <div className="w-64 bg-gray-800 rounded-lg overflow-hidden">
          <div className="h-2 bg-white transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
          <div className="text-center p-2 text-sm">加载中... {loadingProgress}%</div>
        </div>
      </div>
    )
  }
  return (
    <div className="relative w-full h-full mx-auto cursor-pointer" onClick={handleGameAreaClick}>
      {/* Background Layer */}
      {background && (
        <Background src={background || "/backgrounds/forest.jpg"} />
      )}

      {/* Character Layer */}
      {currentCharacter && currentCharacter.oss_url && (
        <Character
          character={currentCharacter.name}
          emotion={currentCharacter.emotion}
          position={currentCharacter.position || "center"}
          oss_url={currentCharacter.oss_url}
        />
      )}

      {/* Dialogue/Narration Layer */}
      {narrationText && (
        <NarrationBox
          text={narrationText}
          isComplete={isNarrationComplete}
          onComplete={() => setIsNarrationComplete(true)}
        />
      )}

      {dialogueText && currentCharacter && (
        <DialogueBox
          text={dialogueText}
          character={currentCharacter.name}
          isComplete={isDialogueComplete}
          onComplete={() => setIsDialogueComplete(true)}
        />
      )}

      {/* Choice Options Layer - stop propagation on this layer */}
      {choices.length > 0 && (
        <div onClick={(e) => e.stopPropagation()}>
          <ChoiceOptions options={choices} onSelect={handleChoice} />
        </div>
      )}
    </div>
  )
}
