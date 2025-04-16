"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { GameCard } from "@/components/game-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

type SearchResults = {
  games: Array<{
    id: string
    title: string
    cover_image: string
    author: {
      id: string
      username: string
    }
    play_count: number
  }>
  authors: Array<{
    id: string
    username: string
    avatar_url: string
    game_count: number
  }>
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: AbortSignal.timeout(15000), // 15秒超时
        })

        if (res.ok) {
          const data = await res.json()
          console.log("Search results:", data)
          setResults(data)
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error)
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchSearchResults()
    } else {
      setResults(null)
      setLoading(false)
    }
  }, [query])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">搜索结果: {query}</h1>

        {loading ? (
          <div className="space-y-8">
            <div>
              <Skeleton className="h-10 w-40 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-[300px] w-full rounded-md" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-10 w-40 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {!results || (results.games.length === 0 && results.authors.length === 0) ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">未找到结果</h3>
                <p className="text-muted-foreground">没有找到与 "{query}" 相关的游戏或创作者</p>
              </div>
            ) : (
              <Tabs defaultValue="games" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="games">游戏 ({results.games.length})</TabsTrigger>
                  <TabsTrigger value="authors">创作者 ({results.authors.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="games">
                  {results.games.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">没有找到相关游戏</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {results.games.map((game) => (
                        <GameCard key={game.id} game={game} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="authors">
                  {results.authors.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">没有找到相关创作者</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.authors.map((author) => (
                        <Link
                          key={author.id}
                          href={`/author/${author.id}`}
                          className="flex items-center p-4 space-x-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={author.avatar_url || "/placeholder.svg"} alt={author.username} />
                            <AvatarFallback>{author.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{author.username}</h3>
                            <p className="text-sm text-muted-foreground">{author.game_count} 个游戏</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </main>
    </div>
  )
}
