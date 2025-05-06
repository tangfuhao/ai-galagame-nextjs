"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { GameData, Chapter, Branch, Character, Command, Resource } from "@/types/game"
import { useAudioManager } from "@/lib/audio-manager-provider"
import { fetchApi } from '@/lib/api';

interface GameHistory {
  current_chapter: number
  current_branch: number
  choices: string[]
  inventory: { items: string[]; skills: string[] }
}


export function useGameState(gameId: string) {
  const { playBg, playDialogue } = useAudioManager()  
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [gameHistory, setGameHistory] = useState<GameHistory>({
    current_chapter: 0, // 设置默认值为第一章（索引0）
    current_branch: 0,
    choices: [],
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

  const charactersCache = useRef<Map<string, string>>(new Map())

  // Process chapter data and extract resources
  const processChapterData = (chapter: Chapter): Chapter => {
    const resources: Resource[] = []

    charactersCache.current = new Map()

    // Extract resources from chapter commands
    chapter.branches.forEach(branch => {
      branch.commands.forEach(command => {
        if (command.type === "dialogue") {
          //如果是对话，提取角色信息
          const character_name = command.name
          if (!charactersCache.current.has(character_name)) {
            //从chapter.characters匹配
            const character = chapter.characters?.find(c => {
              // 完全相等
              if (c.name === character_name) return true
              // character_name 包含于 c.name
              if (c.name.includes(character_name)) return true
              // c.name 包含于 character_name
              if (character_name.includes(c.name)) return true
              return false
            })
            if (character) {
              resources.push({
                name: character_name,
                url: character.oss_url
              })
              charactersCache.current.set(character_name, character.oss_url)
            }else{
              charactersCache.current.set(character_name, "")
            }
          }
        }

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


    return { ...chapter, dependencies: resources }
  }

  // Load game data
  useEffect(() => {
    const loadGameData = async (abortSignal: AbortSignal) => {
      try {
        const res = await fetchApi(`/games/${gameId}`, { signal: abortSignal });
        if (!res.ok) {
          throw new Error("Failed to load game data")
        }
        const data = await res.json()
        // console.log("Game data loaded:", data)
        
        // Process chapters and extract resources
        const processedData = {
          ...data,
          chapters: data.chapters.map(processChapterData)
        }
        
        console.log("Game data processed:", processedData)
        setGameData(processedData)
        
        // Set initial chapter and branch
        const initialChapter = processedData.chapters[gameHistory.current_chapter]
        
        if (initialChapter) {
          setCurrentChapter(initialChapter)
          const initialBranch = initialChapter.branches[gameHistory.current_branch]
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
    const abortController = new AbortController()

    loadGameData(abortController.signal)

    return () => {
      abortController.abort("Game unmounted")
    }
  }, [gameId])

  // Remove the old chapter loading effect since we handle it in loadGameData now
  useEffect(() => {
    if (!gameData) return

    const chapter = gameData.chapters[gameHistory.current_chapter]
    if (chapter && chapter.id !== currentChapter?.id) {
      setCurrentChapter(chapter)
      const branch = chapter.branches[gameHistory.current_branch]
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


    switch (instruction.type) {
      case "bg":
        setBackground(instruction.oss_url)
        //直接跳到下一条指令
        setInstructionIndex(instructionIndex + 1)
        break
      case "dialogue":
        // Reset UI state for new instruction
        if (instruction.oss_url) {
          playDialogue(instruction.oss_url)
        }
        setNarrationText(null)
        setChoices([])
        setCurrentCharacter(null)
        setDialogueText(instruction.content || "") // 使用空字符串作为默认值

        const characterImage = charactersCache.current.get(instruction.name)
        setCurrentCharacter({
          name: instruction.name,
          oss_url: characterImage || "",
          emotion: undefined,
          position: undefined,
        })
        break
      case "narration":
        // Reset UI state for new instruction
        setDialogueText(null)
        setChoices([])
        setCurrentCharacter(null)
        setNarrationText(instruction.content || "") // 使用空字符串作为默认值
        break
      case "choice":
        // Reset UI state for new instruction
        setDialogueText(null)
        setNarrationText(null)
        setCurrentCharacter(null)
        setChoices([])
        console.log("choice instruction", instruction)
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
        if (instruction.oss_url) {
          playBg(instruction.oss_url)
        }
        //直接跳到下一条指令
        setInstructionIndex(instructionIndex + 1)
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


    if (isTextComplete ) {
      if (instructionIndex < currentBranch.commands.length - 1) {
        setInstructionIndex((prev: number) => prev + 1)
      }else{
        if (!currentChapter) return
        //如果没有下一条指令，前进到下一个Branch
        const currentIndex = currentChapter.branches.indexOf(currentBranch)
        const nextBranch = currentChapter.branches[currentIndex + 1]
        if (nextBranch) {
          setCurrentBranch(nextBranch)
          setInstructionIndex(0)
        }else{
          //如果没有下一个Branch，前进到下一个Chapter
          handleNextChapter()
        }
      }
    }
  }, [currentBranch, instructionIndex])

  const handleNextChapter = useCallback(() => {
    if (!gameData || !currentChapter) return

    const currentIndex = gameData.chapters.indexOf(currentChapter)
    const nextChapter = gameData.chapters[currentIndex + 1]

    if (nextChapter) {
      setGameHistory((prev) => ({
        ...prev,
        current_chapter: currentIndex + 1,
        current_branch: 0
      }))
      setCurrentChapter(nextChapter)
      setCurrentBranch(nextChapter.branches[0])
      setInstructionIndex(0)
    }
  }, [gameData, currentChapter])

  const handleChoice = useCallback((choice: string) => {
    if (!currentChapter || !currentBranch) return

    const targetBranch = currentChapter.branches.find((b) => b.name === choice)
    if (targetBranch) {
      // Update game history
      setGameHistory((prev) => ({
        ...prev,
        current_branch: currentChapter.branches.indexOf(targetBranch),
        choices: [...prev.choices, choice]
      }))

      // Switch to new branch
      setCurrentBranch(targetBranch)
      setInstructionIndex(0)
    }
  }, [currentChapter, currentBranch])

  return {
    background,
    currentChapter,
    currentCharacter,
    dialogueText,
    narrationText,
    choices,
    isLoading,
    handleNextChapter,
    handleChoice,
    advanceStory,
  }
}
