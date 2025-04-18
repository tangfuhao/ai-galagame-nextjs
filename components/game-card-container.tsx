"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { GameCard } from "@/components/game-card"
import { Skeleton } from "@/components/ui/skeleton"

type Game = {
  id: string
  title: string
  cover_image: string
  author: {
    id: string
    username: string
  }
  play_count: number
  created_at: string
}

export function GameCardContainer() {
  const searchParams = useSearchParams()
  const tagFilter = searchParams.get("tag")
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      try {
        const endpoint = tagFilter ? `/api/games?tag=${encodeURIComponent(tagFilter)}` : "/api/games/latest"

        const res = await fetch(endpoint, {
          signal: AbortSignal.timeout(15000), // 15秒超时
        })

        if (res.ok) {
          const data = await res.json()
          setGames(data)
        }
      } catch (error) {
        console.error("Failed to fetch games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [tagFilter])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">暂无游戏</h3>
        <p className="text-muted-foreground">
          {tagFilter ? `没有找到标签为"${tagFilter}"的游戏` : "暂时没有游戏，成为第一个创作者吧！"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
