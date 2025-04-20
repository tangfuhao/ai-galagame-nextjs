"use client"

import { useState, useCallback, useEffect } from "react"
import { GameData, Chapter, Branch, Character, Command, Resource } from "@/types/game"

interface GameHistory {
  current_chapter: string
  unlocked_branches: string[]
  inventory: { items: string[]; skills: string[] }
}

interface UseGameStateProps {
  gameId: string
}

export function useGameState({ gameId }: UseGameStateProps) {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [gameHistory, setGameHistory] = useState<GameHistory>({
    current_chapter: "1", // 设置默认值为第一章
    unlocked_branches: ["main"], // 设置默认值为主分支
    inventory: { items: [], skills: [] },
  })

  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [instructionIndex, setInstructionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Current UI state
  const [background, setBackground] = useState<string | null>(null)
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null)
  const [dialogueText, setDialogueText] = useState<string | null>(null)
  const [narrationText, setNarrationText] = useState<string | null>("") // 设置默认值为空字符串
  const [choices, setChoices] = useState<{ id: string; text: string }[]>([])

  // Process chapter data and extract resources
  const processChapterData = (chapter: Chapter): Chapter => {
    const resources: Resource[] = []
    
    // Extract resources from chapter commands
    chapter.branches.forEach(branch => {
      branch.commands.forEach(command => {
        if (command.oss_url) {
          switch (command.type) {
            case "bg":
            case "bgm":
              resources.push({
                name: command.name,
                url: command.oss_url
              })
              break
          }
        }
      })
    })

    // Add character sprites
    chapter.characters?.forEach(character => {
      if (character.oss_url) {
        resources.push({
          name: character.name,
          url: character.oss_url
        })
      }
    })

    return { ...chapter, dependencies: resources }
  }

  // Load game data
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const fetchGameUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${gameId}`
        const res = await fetch(fetchGameUrl)
        if (!res.ok) {
          throw new Error("Failed to load game data")
        }
        const data = await res.json()
        console.log("Game data loaded:", data)
        
        // Process chapters and extract resources
        const processedData = {
          ...data,
          chapters: data.chapters.map(processChapterData)
        }
        
        console.log("Game data processed:", processedData)
        setGameData(processedData)
        
        // Set initial chapter and branch
        const initialChapter = processedData.chapters.find(
          (c: Chapter) => c.id === gameHistory.current_chapter
        )
        if (initialChapter) {
          setCurrentChapter(initialChapter)
          const initialBranch = initialChapter.branches.find(
            (b: Branch) => b.name === gameHistory.unlocked_branches[0]
          )
          if (initialBranch) {
            setCurrentBranch(initialBranch)
            setInstructionIndex(0)
            setIsLoading(false)
          }
        }
      } catch (error) {
        console.error("Failed to load game data:", error)
      }
    }

    loadGameData()
  }, [gameId, gameHistory])

  // Remove the old chapter loading effect since we handle it in loadGameData now
  useEffect(() => {
    if (!gameData) return

    const chapter = gameData.chapters.find((chapter: Chapter) => chapter.id === gameHistory.current_chapter)
    if (chapter && chapter.id !== currentChapter?.id) {
      setCurrentChapter(chapter)
      const branch = chapter.branches.find((branch: Branch) => branch.name === gameHistory.unlocked_branches[0])
      if (branch) {
        setCurrentBranch(branch)
        setInstructionIndex(0)
      }
    }
  }, [gameData, gameHistory, currentChapter?.id])

  // Process current instruction
  useEffect(() => {
    if (!currentBranch || instructionIndex >= currentBranch.commands.length) return

    const instruction = currentBranch.commands[instructionIndex]

    // Reset UI state for new instruction
    setDialogueText(null)
    setNarrationText(null)
    setChoices([])

    switch (instruction.type) {
      case "bg":
        setBackground(instruction.oss_url)
        break
      case "dialogue":
        setDialogueText(instruction.content || "") // 使用空字符串作为默认值
        setCurrentCharacter({
          name: instruction.name,
          oss_url: instruction.oss_url || "",
          emotion: undefined,
          position: undefined,
        })
        break
      case "narration":
        setNarrationText(instruction.content || "") // 使用空字符串作为默认值
        break
      case "choice":
        if (instruction.content) {
          try {
            const options = JSON.parse(instruction.content)
            setChoices(options.map((opt: { text: string; target: string }) => ({
              id: opt.target,
              text: opt.text
            })))
          } catch (e) {
            console.error("Failed to parse choice options:", e)
            setChoices([])
          }
        }
        break
      case "jump":
        // Handle jump to another branch
        const targetBranch = currentChapter?.branches.find((b: Branch) => b.name === instruction.content)
        if (targetBranch) {
          setCurrentBranch(targetBranch)
          setInstructionIndex(0)
        }
        break
      case "bgm":
        // Audio handling would go here
        break
    }
  }, [currentBranch, instructionIndex, currentChapter])

  // Advance to next instruction
  const advanceStory = useCallback(() => {
    if (!currentBranch) return

    // Check if current text display is complete
    const isTextComplete = (() => {
      const currentInstruction = currentBranch.commands[instructionIndex]
      if (currentInstruction.type === "dialogue" || currentInstruction.type === "narration") {
        // This is handled by the UI components now
        return true
      }
      return true
    })()

    if (isTextComplete && instructionIndex < currentBranch.commands.length - 1) {
      setInstructionIndex((prev: number) => prev + 1)
    }
  }, [currentBranch, instructionIndex])

  // Handle player choice
  const makeChoice = useCallback(
    (choiceId: string) => {
      if (!currentBranch || !currentChapter) return

      const instruction = currentBranch.commands[instructionIndex]
      if (instruction.type !== "choice") return

      const selectedOption = currentBranch.commands.find((opt: Command) => opt.name === choiceId)
      if (!selectedOption) return

      const targetBranch = currentChapter.branches.find((b: Branch) => b.name === selectedOption.content)
      if (targetBranch) {
        // Update game history
        setGameHistory((prev: GameHistory) => ({
          ...prev,
          unlocked_branches: [...prev.unlocked_branches, targetBranch.name],
        }))

        // Switch to new branch
        setCurrentBranch(targetBranch)
        setInstructionIndex(0)
      }
    },
    [currentBranch, currentChapter, instructionIndex],
  )

  return {
    background,
    currentChapter,
    currentCharacter,
    dialogueText,
    narrationText,
    choices,
    isLoading,
    makeChoice,
    advanceStory,
  }
}
