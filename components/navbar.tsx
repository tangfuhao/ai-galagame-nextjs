"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, LogOut, PlusCircle, UserCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/use-auth"
import { CreateGameModal } from "@/components/create-game-modal"
import { LoginModal } from "@/components/login-modal"

type SearchSuggestion = {
  games: Array<{ id: string; title: string }>
  authors: Array<{ id: string; username: string }>
  tags: Array<{ id: string; name: string }>
}

export function Navbar() {
  const router = useRouter()
  const { user, signOut, isLoggingOut, rememberLogin, setRememberLogin } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // 获取用户积分
  useEffect(() => {
    const fetchCredits = async () => {
      if (user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/credits`, {
            credentials: "include", // 确保包含 cookies
          })
          if (res.ok) {
            const data = await res.json()
            setCredits(data.credits)
          }
        } catch (error) {
          console.error('Failed to fetch credits:', error)
        }
      }
    }

    fetchCredits()
  }, [user])

  // 处理搜索建议
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        try {
          const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(searchQuery)}`)
          if (res.ok) {
            const data = await res.json()
            setSuggestions(data)
            setShowSuggestions(true)
          }
        } catch (error) {
          console.error("Failed to fetch suggestions:", error)
        }
      } else {
        setSuggestions(null)
        setShowSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSuggestions(false)
    }
  }

  const openCreateModal = () => {
    setIsModalOpen(true)
  }


  //打印user
  // console.log("User:", user)
  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl mr-8">
            AI-Galgame
          </Link>

          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="搜索游戏、创作者或标签..."
                className="w-[300px] pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </form>

            {showSuggestions && suggestions && (
              <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50">
                {suggestions.games.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-muted-foreground mb-1">游戏</h3>
                    <ul>
                      {suggestions.games.slice(0, 5).map((game) => (
                        <li key={game.id}>
                          <Link
                            href={`/game/${game.id}`}
                            className="block px-2 py-1 hover:bg-accent rounded text-sm"
                            onClick={() => setShowSuggestions(false)}
                          >
                            {game.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {suggestions.authors.length > 0 && (
                  <div className="p-2 border-t">
                    <h3 className="text-xs font-medium text-muted-foreground mb-1">创作者</h3>
                    <ul>
                      {suggestions.authors.slice(0, 3).map((author) => (
                        <li key={author.id}>
                          <Link
                            href={`/author/${author.id}`}
                            className="block px-2 py-1 hover:bg-accent rounded text-sm"
                            onClick={() => setShowSuggestions(false)}
                          >
                            {author.username}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {suggestions.tags.length > 0 && (
                  <div className="p-2 border-t">
                    <h3 className="text-xs font-medium text-muted-foreground mb-1">标签</h3>
                    <ul>
                      {suggestions.tags.slice(0, 2).map((tag) => (
                        <li key={tag.id}>
                          <Link
                            href={`/?tag=${encodeURIComponent(tag.name)}`}
                            className="block px-2 py-1 hover:bg-accent rounded text-sm"
                            onClick={() => setShowSuggestions(false)}
                          >
                            {tag.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openCreateModal}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>创建游戏</span>
                </DropdownMenuItem>


                <DropdownMenuItem>
                  <span>剩余积分: {credits ?? '加载中...'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />


                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>个人中心</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={rememberLogin} onCheckedChange={setRememberLogin}>
                  记住登录状态
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} disabled={isLoggingOut}>
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>退出中...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>退出登录</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setLoginModalOpen(true)} variant="default">
              <User className="mr-2 h-4 w-4" />
              登录
            </Button>
          )}
        </div>
      </div>

      <CreateGameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </header>
  )
}
