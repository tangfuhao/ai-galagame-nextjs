"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type GameProps = {
  id: string
  title: string
  coverImage?: string
  userName: string
  playCount: number
}

export function GameCard({ id, title, coverImage, userName, playCount }: GameProps) {
  const [isHovering, setIsHovering] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <Link href={`/game/${id}`}>
      <Card
        className="relative overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-video">
            {coverImage ? (
              <Image
                ref={imageRef}
                src={coverImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
            {isHovering && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Button variant="secondary" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2 line-clamp-1">{title}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="w-4 h-4 mr-1" />
              <span className="mr-4">{userName}</span>
              <Play className="w-4 h-4 mr-1" />
              <span>{playCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
