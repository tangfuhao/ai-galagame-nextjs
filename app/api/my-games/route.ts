import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  // 检查用户是否已登录
  const cookieStore = cookies()
  const authToken = cookieStore.get("auth_token")

  if (!authToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // 模拟用户游戏数据
  const userGames = [
    {
      id: "game1",
      title: "月光下的誓言",
      cover_image: "/placeholder.svg?height=600&width=400",
      status: "published",
      progress: 100,
      created_at: "2023-03-10T14:22:00Z",
    },
    {
      id: "game2",
      title: "都市迷情",
      cover_image: "/placeholder.svg?height=600&width=400",
      status: "published",
      progress: 100,
      created_at: "2023-04-05T09:15:00Z",
    },
    {
      id: "game3",
      title: "未完成的故事",
      cover_image: null,
      status: "generating",
      progress: 45,
      created_at: "2023-05-20T16:40:00Z",
    },
    {
      id: "game7",
      title: "生成失败的游戏",
      cover_image: null,
      status: "failed",
      progress: 0,
      created_at: "2023-06-01T10:30:00Z",
      error_message: "AI生成过程中出现错误，请重试",
    },
  ]

  return NextResponse.json(userGames)
}
