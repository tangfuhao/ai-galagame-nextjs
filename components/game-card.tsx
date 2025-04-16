"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type GameProps = {
  game: {
    id: string
    title: string
    cover_image: string
    author: {
      id: string
      username: string
    }
    play_count: number
  }
}

export function GameCard({ game }: GameProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewTimeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    setIsHovering(true)

    // 加载预览视频
    if (videoRef.current && !previewLoaded) {
      videoRef.current.src = `/api/preview/${game.id}`
      videoRef.current.load()
      setPreviewLoaded(true)
    }

    // 3秒后停止预览
    previewTimeoutRef.current = setTimeout(() => {
      setIsHovering(false)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }, 3000)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current)
    }
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {isHovering && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-10"
            autoPlay
            muted
            playsInline
          />
        )}

        <Image
          src={game.cover_image || "/placeholder.svg"}
          alt={game.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // 图片加载失败时显示占位图
            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=600&width=400"
          }}
        />
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{game.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <User className="h-3 w-3 mr-1" />
          <Link href={`/author/${game.author.id}`} className="hover:underline">
            {game.author.username}
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">游玩次数: {game.play_count}</span>
          <Link href={`/game/${game.id}`}>
            <Button size="sm" variant="outline" className="gap-1">
              <Play className="h-3 w-3" />
              游玩
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
