"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { RefreshCw, AlertTriangle, Edit, Play, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { fetchApi } from '@/lib/api';
import { GameCard } from "@/components/game-card";

type GameCreation = {
  id: string
  runtime_id: string | null
  title: string
  cover_image: string | null
  status: "generating" | "published" | "failed"
  progress: number
  created_at: string
  error_message?: string
  user_name?: string
  play_count?: number
}

export function GameCreationList() {
  const router = useRouter()
  const { toast } = useToast()
  const [games, setGames] = useState<GameCreation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/user/me/games');

      if (res.ok) {
        const data = await res.json()
        console.log("Games data:", data)
        setGames(data)
      } else {
        throw new Error("获取游戏列表失败")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "加载失败",
        description: (error as Error).message || "请稍后再试",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()

    // 每60秒自动刷新生成中的游戏进度
    const intervalId = setInterval(() => {
      if (games.some((game) => game.status === "generating")) {
        fetchGames()
      }
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const handleRetry = async (gameId: string) => {
    try {
      const res = await fetchApi(`/games/${gameId}/regenerate`, {
        method: 'POST'
      });

      if (res.ok) {
        toast({
          title: "重试成功",
          description: "游戏已重新开始生成",
        })

        // 更新游戏状态
        setGames((prev) =>
          prev.map((game) => (game.id === gameId ? { ...game, status: "generating" } : game)),
        )
      } else {
        throw new Error("重试失败")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "操作失败",
        description: (error as Error).message || "请稍后再试",
      })
    }
  }

  const handleDelete = async (gameId: string) => {
    if (!confirm("确定要删除这个游戏吗？")) {
      return
    }
    try {
      const res = await fetchApi(`/user/me/games/${gameId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setGames((prevGames) => prevGames.filter((game) => game.id !== gameId))
        toast({
          description: "游戏已删除",
        })
      } else {
        throw new Error("删除失败")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "删除失败，请重试",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex justify-end">
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">暂无创作</h3>
        <p className="text-muted-foreground mb-6">您还没有创建任何游戏</p>
        <Button onClick={() => document.dispatchEvent(new CustomEvent("open-create-modal"))}>创建第一个游戏</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <Card key={game.id}>
          <CardContent className="p-6 relative group">
            <button
              onClick={() => handleDelete(game.id)}
              className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{game.title || "未命名游戏"}</h3>
                <p className="text-sm text-muted-foreground">
                  创建于 {new Date(game.created_at).toLocaleDateString("zh-CN")}
                </p>
              </div>

              {game.status === "generating" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>生成中</span>
                    <span>{game.progress}%</span>
                  </div>
                  <Progress value={game.progress} className="h-2" />
                </div>
              )}

              {game.status === "failed" && (
                <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{game.error_message || "生成失败，请重试"}</span>
                </div>
              )}

              {game.status === "published" && game.cover_image && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={game.cover_image || "/placeholder.svg"}
                    alt={game.title || "游戏封面"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                    }}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                {game.status === "failed" && (
                  <Button variant="outline" size="sm" onClick={() => handleRetry(game.id)}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    重试
                  </Button>
                )}

                {game.status === "published" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/game/${game.id}/edit`)}>
                      <Edit className="h-4 w-4 mr-1" />
                      编辑
                    </Button>
                    <Button size="sm" onClick={() => router.push(`/game/${game.runtime_id}`)}>
                      <Play className="h-4 w-4 mr-1" />
                      游玩
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
