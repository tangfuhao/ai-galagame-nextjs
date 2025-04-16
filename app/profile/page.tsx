"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { GameCreationList } from "@/components/game-creation-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/use-auth"
import { redirect } from "next/navigation"

export default function ProfilePage() {
  const { user, loading } = useAuth()

  // 如果用户未登录且加载完成，重定向到首页
  useEffect(() => {
    if (!loading && !user) {
      redirect("/")
    }
  }, [user, loading])

  // 如果正在加载或未登录，显示加载状态
  if (loading || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">个人中心</h1>

        <Tabs defaultValue="creations" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="creations">我的创作</TabsTrigger>
            <TabsTrigger value="profile">个人资料</TabsTrigger>
          </TabsList>

          <TabsContent value="creations">
            <GameCreationList />
          </TabsContent>

          <TabsContent value="profile">
            <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">个人资料</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">用户名</h3>
                    <p className="text-lg">{user.username}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">邮箱</h3>
                    <p className="text-lg">{user.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">注册时间</h3>
                  <p className="text-lg">{new Date(user.created_at).toLocaleDateString("zh-CN")}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">创作数量</h3>
                  <p className="text-lg">{user.game_count || 0} 个游戏</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
