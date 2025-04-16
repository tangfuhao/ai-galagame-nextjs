import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""

  // 模拟搜索结果
  const searchResults = {
    games: [
      {
        id: "game1",
        title: "月光下的誓言",
        cover_image: "/placeholder.svg?height=600&width=400",
        author: {
          id: "user1",
          username: "张三",
        },
        play_count: 128,
        created_at: "2023-03-10T14:22:00Z",
      },
      {
        id: "game2",
        title: "都市迷情",
        cover_image: "/placeholder.svg?height=600&width=400",
        author: {
          id: "user2",
          username: "李四",
        },
        play_count: 56,
        created_at: "2023-04-05T09:15:00Z",
      },
    ],
    authors: [
      {
        id: "user1",
        username: "张三",
        avatar_url: "/placeholder.svg?height=100&width=100",
        game_count: 3,
      },
    ],
  }

  return NextResponse.json(searchResults)
}
