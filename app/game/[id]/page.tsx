"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { GamePlayer } from "@/components/game-player"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

type Game = {
  id: string
  title: string
  author: {
    id: string
    username: string
  }
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

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${params.id}`, {
          signal: AbortSignal.timeout(15000), // 15秒超时
        })

        if (res.ok) {
          const data = await res.json()
          setGame(data)

          // 记录游玩次数
          fetch(`/api/games/${params.id}/play`, {
            method: "POST",
          }).catch(console.error)
        } else if (res.status === 404) {
          setError("游戏不存在或已被删除")
        } else {
          throw new Error("加载游戏失败")
        }
      } catch (error) {
        setError((error as Error).message || "请稍后再试")
        toast({
          variant: "destructive",
          title: "加载失败",
          description: (error as Error).message || "请稍后再试",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchGame()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>

          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-12" />

          <div className="aspect-video w-full max-w-4xl mx-auto">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">出错了</h2>
          <p className="text-muted-foreground mb-6">{error || "游戏加载失败"}</p>
          <Button onClick={() => router.push("/")}>返回首页</Button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>

        <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
        <p className="text-muted-foreground mb-8">
          由 <span className="font-medium">{game.author.username}</span> 创作
        </p>

        <GamePlayer game={game} />
      </main>
    </div>
  )
}
