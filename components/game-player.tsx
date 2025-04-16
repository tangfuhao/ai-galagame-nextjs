"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

type GameProps = {
  game: {
    id: string
    title: string
    scenes: Array<{
      id: string
      background: string
      characters: Array<{
        id: string
        image: string
        position: string
      }>
      dialog: {
        text: string
        character?: string
        choices?: Array<{
          text: string
          next_scene: string
        }>
      }
    }>
  }
}

export function GamePlayer({ game }: GameProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isTextComplete, setIsTextComplete] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [textSpeed, setTextSpeed] = useState(30) // 文字显示速度（毫秒/字符）

  const currentScene = game.scenes[currentSceneIndex]

  // 文字打字机效果
  useEffect(() => {
    if (!currentScene) return

    setIsTextComplete(false)
    setDisplayedText("")

    const fullText = currentScene.dialog.text
    let index = 0

    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index))
        index++
      } else {
        clearInterval(typingInterval)
        setIsTextComplete(true)
      }
    }, textSpeed)

    return () => clearInterval(typingInterval)
  }, [currentSceneIndex, currentScene])

  // 处理点击下一步
  const handleNext = () => {
    if (!isTextComplete) {
      // 如果文字未完全显示，则立即显示全部文字
      setDisplayedText(currentScene.dialog.text)
      setIsTextComplete(true)
      return
    }

    // 如果当前场景有选项，则不自动前进
    if (currentScene.dialog.choices && currentScene.dialog.choices.length > 0) {
      return
    }

    // 前进到下一个场景
    if (currentSceneIndex < game.scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1)
    }
  }

  // 处理选项选择
  const handleChoiceSelect = (nextSceneId: string) => {
    const nextSceneIndex = game.scenes.findIndex((scene) => scene.id === nextSceneId)
    if (nextSceneIndex !== -1) {
      setCurrentSceneIndex(nextSceneIndex)
    }
  }

  if (!currentScene) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">游戏结束</h3>
        <p className="text-muted-foreground">感谢您的游玩</p>
      </div>
    )
  }

  // 根据位置获取角色样式
  const getCharacterStyle = (position: string) => {
    switch (position) {
      case "left":
        return "left-[10%] bottom-0"
      case "center":
        return "left-[50%] transform -translate-x-1/2 bottom-0"
      case "right":
        return "right-[10%] bottom-0"
      default:
        return "left-[50%] transform -translate-x-1/2 bottom-0"
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative aspect-video w-full rounded-t-lg overflow-hidden" onClick={handleNext}>
        {/* 背景 */}
        <Image
          src={currentScene.background || "/placeholder.svg"}
          alt="背景"
          fill
          className="object-cover"
          priority
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=720&width=1280"
          }}
        />

        {/* 角色 */}
        {currentScene.characters.map((character) => (
          <div key={character.id} className={`absolute h-[80%] w-auto ${getCharacterStyle(character.position)}`}>
            <Image
              src={character.image || "/placeholder.svg"}
              alt="角色"
              width={300}
              height={600}
              className="object-contain h-full w-auto"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=600&width=300"
              }}
            />
          </div>
        ))}

        {/* 对话框指示器 */}
        {isTextComplete && !currentScene.dialog.choices && (
          <div className="absolute right-4 bottom-4 animate-bounce">
            <ChevronRight className="h-6 w-6 text-white drop-shadow-md" />
          </div>
        )}
      </div>

      {/* 对话框 */}
      <Card className="p-4 rounded-t-none">
        {currentScene.dialog.character && <div className="font-bold mb-2">{currentScene.dialog.character}</div>}

        <div className="min-h-[80px] text-lg mb-4">{displayedText}</div>

        {/* 选项 */}
        {isTextComplete && currentScene.dialog.choices && currentScene.dialog.choices.length > 0 && (
          <div className="space-y-2 mt-4">
            {currentScene.dialog.choices.map((choice, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleChoiceSelect(choice.next_scene)}
              >
                {choice.text}
              </Button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
