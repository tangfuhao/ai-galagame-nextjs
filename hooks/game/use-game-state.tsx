"use client"

import { useState, useCallback, useEffect } from "react"

// Types based on your API interface specifications
interface GameHistory {
  current_chapter: string
  unlocked_branches: string[]
  inventory: { items: string[]; skills: string[] }
}

interface GameData {
  total_chapters: number
  chapter_list: ChapterItem[]
}

interface ChapterItem {
  id: string
  branches: Branch[]
  dependencies: Resource[]
}

interface Branch {
  id: string
  instructions: Instruction[]
  requirements?: {
    items?: string[]
    skills?: string[]
  }
}

interface Resource {
  type: "sprite" | "audio" | "background"
  name: string
  versioned_url: string
  preload_priority: number
}

type Instruction =
  | { type: "narration"; text: string }
  | { type: "dialogue"; character: string; emotion?: string; text: string; position?: "left" | "center" | "right" }
  | { type: "choice"; options: { id: string; text: string; branch: string }[] }
  | { type: "jump"; target: string }
  | { type: "background"; src: string }
  | { type: "audio"; src: string; loop?: boolean }

interface Character {
  name: string
  emotion?: string
  position?: "left" | "center" | "right"
}

// // Mock data for demonstration
// const MOCK_GAME_DATA: GameData = {
//   total_chapters: 1,
//   chapter_list: [
//     {
//       id: "chapter1",
//       branches: [
//         {
//           id: "start",
//           instructions: [
//             { type: "background", src: "/backgrounds/forest.jpg" },
//             { type: "narration", text: "按照常识，羊的荷包里大概装着汗巾或黑锅，可里面却什么都没有。" },
//             {
//               type: "dialogue",
//               character: "舌头",
//               emotion: "normal",
//               text: "喂，问你呢，干嘛不说话，处理干净了吗！？",
//               position: "center",
//             },
//             {
//               type: "choice",
//               options: [
//                 { id: "choice1", text: "表示愿意接下这个话。", branch: "accept" },
//                 { id: "choice2", text: "先看小羊，再做决定。", branch: "wait" },
//               ],
//             },
//           ],
//           requirements: {},
//         },
//         {
//           id: "accept",
//           instructions: [
//             { type: "background", src: "/backgrounds/forest.jpg" },
//             {
//               type: "dialogue",
//               character: "舌头",
//               emotion: "happy",
//               text: "很好，我就知道你会同意的。这个任务很重要，请务必认真对待！",
//               position: "center",
//             },
//             { type: "narration", text: "你点了点头，表示理解。这看起来是个不小的挑战，但你已经准备好了。" },
//             { type: "background", src: "/backgrounds/village.jpg" },
//             {
//               type: "dialogue",
//               character: "舌头",
//               emotion: "normal",
//               text: "记住，一切都要小心谨慎。这不是普通的工作，而是关乎生死的任务。",
//               position: "left",
//             },
//             // More instructions...
//           ],
//         },
//         {
//           id: "wait",
//           instructions: [
//             { type: "background", src: "/backgrounds/forest.jpg" },
//             { type: "narration", text: "你决定先观察一下情况，再做决定。毕竟，贸然行动可能会带来不必要的麻烦。" },
//             {
//               type: "dialogue",
//               character: "舌头",
//               emotion: "normal",
//               text: "怎么了？有什么问题吗？时间不等人，我们必须尽快行动！",
//               position: "right",
//             },
//             { type: "background", src: "/backgrounds/village.jpg" },
//             {
//               type: "dialogue",
//               character: "舌头",
//               emotion: "happy",
//               text: "算了，既然你犹豫不决，那我们先回村子吧。",
//               position: "center",
//             },
//             // More instructions...
//           ],
//         },
//       ],
//       dependencies: [
//         { type: "background", name: "forest", versioned_url: "/backgrounds/forest.jpg", preload_priority: 1 },
//         { type: "background", name: "village", versioned_url: "/backgrounds/village.jpg", preload_priority: 2 },
//         { type: "sprite", name: "舌头_normal", versioned_url: "/characters/舌头/normal.png", preload_priority: 1 },
//         { type: "sprite", name: "舌头_happy", versioned_url: "/characters/舌头/happy.png", preload_priority: 2 },
//       ],
//     },
//   ],
// }

interface UseGameStateProps {
  gameId: string
}

export function useGameState({ gameId }: UseGameStateProps) {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [gameHistory, setGameHistory] = useState<GameHistory>({
    current_chapter: "chapter1",
    unlocked_branches: ["start"],
    inventory: { items: [], skills: [] },
  })

  const [currentChapter, setCurrentChapter] = useState<ChapterItem | null>(null)
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [instructionIndex, setInstructionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Current UI state
  const [background, setBackground] = useState<string | null>(null)
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null)
  const [dialogueText, setDialogueText] = useState<string | null>(null)
  const [narrationText, setNarrationText] = useState<string | null>(null)
  const [choices, setChoices] = useState<{ id: string; text: string }[]>([])

  // Load game data
  useEffect(() => {
    // In a real implementation, this would be an API call
    const loadGameData = async () => {
      try {
        // TODO: Fetch game data from API
        const fetchGameUrl = `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`
        const res = await fetch(fetchGameUrl)
        if (!res.ok) {
          throw new Error("Failed to load game data")
        }
        const data = await res.json()
        console.log("Game data loaded:", data)
      } catch (error) {
        console.error("Failed to load game data:", error)
      }
    }

    loadGameData()
  }, [gameId])

  // Set current chapter and branch when game data is loaded
  useEffect(() => {
    if (!gameData) return

    const chapter = gameData.chapter_list.find((c) => c.id === gameHistory.current_chapter)
    if (chapter) {
      setCurrentChapter(chapter)
      const branch = chapter.branches.find((b) => b.id === gameHistory.unlocked_branches[0])
      if (branch) {
        setCurrentBranch(branch)
        setInstructionIndex(0)
        setIsLoading(false)
      }
    }
  }, [gameData, gameHistory])

  // Process current instruction
  useEffect(() => {
    if (!currentBranch || instructionIndex >= currentBranch.instructions.length) return

    const instruction = currentBranch.instructions[instructionIndex]

    // Reset UI state for new instruction
    setDialogueText(null)
    setNarrationText(null)
    setChoices([])

    switch (instruction.type) {
      case "background":
        setBackground(instruction.src)
        break
      case "dialogue":
        setDialogueText(instruction.text)
        setCurrentCharacter({
          name: instruction.character,
          emotion: instruction.emotion,
          position: instruction.position,
        })
        break
      case "narration":
        setNarrationText(instruction.text)
        break
      case "choice":
        setChoices(instruction.options.map((opt) => ({ id: opt.id, text: opt.text })))
        break
      case "jump":
        // Handle jump to another branch
        const targetBranch = currentChapter?.branches.find((b) => b.id === instruction.target)
        if (targetBranch) {
          setCurrentBranch(targetBranch)
          setInstructionIndex(0)
        }
        break
      case "audio":
        // Audio handling would go here
        break
    }
  }, [currentBranch, instructionIndex, currentChapter])

  // Advance to next instruction
  const advanceStory = useCallback(() => {
    if (!currentBranch) return

    // Check if current text display is complete
    const isTextComplete = (() => {
      const currentInstruction = currentBranch.instructions[instructionIndex]
      if (currentInstruction.type === "dialogue" || currentInstruction.type === "narration") {
        // This is handled by the UI components now
        return true
      }
      return true
    })()

    if (isTextComplete && instructionIndex < currentBranch.instructions.length - 1) {
      setInstructionIndex((prev) => prev + 1)
    }
  }, [currentBranch, instructionIndex])

  // Handle player choice
  const makeChoice = useCallback(
    (choiceId: string) => {
      if (!currentBranch || !currentChapter) return

      const instruction = currentBranch.instructions[instructionIndex]
      if (instruction.type !== "choice") return

      const selectedOption = instruction.options.find((opt) => opt.id === choiceId)
      if (!selectedOption) return

      const targetBranch = currentChapter.branches.find((b) => b.id === selectedOption.branch)
      if (targetBranch) {
        // Update game history
        setGameHistory((prev) => ({
          ...prev,
          unlocked_branches: [...prev.unlocked_branches, targetBranch.id],
        }))

        // Switch to new branch
        setCurrentBranch(targetBranch)
        setInstructionIndex(0)
      }
    },
    [currentBranch, currentChapter, instructionIndex],
  )

  return {
    currentScene: { background },
    currentCharacter,
    dialogueText,
    narrationText,
    choices,
    isLoading,
    makeChoice,
    advanceStory,
  }
}
