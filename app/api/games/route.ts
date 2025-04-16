import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tag = searchParams.get("tag")

  // 模拟按标签筛选游戏
  let filteredGames = []

  if (tag === "爱情") {
    filteredGames = [
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
        id: "game6",
        title: "初恋回忆录",
        cover_image: "/placeholder.svg?height=600&width=400",
        author: {
          id: "user5",
          username: "钱七",
        },
        play_count: 76,
        created_at: "2023-01-25T10:20:00Z",
      },
    ]
  } else if (tag === "悬疑") {
    filteredGames = [
      {
        id: "game5",
        title: "古城谜案",
        cover_image: "/placeholder.svg?height=600&width=400",
        author: {
          id: "user4",
          username: "赵六",
        },
        play_count: 89,
        created_at: "2023-05-01T16:45:00Z",
      },
    ]
  } else if (tag === "都市") {
    filteredGames = [
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
    ]
  } else if (tag === "奇幻") {
    filteredGames = [
      {
        id: "game4",
        title: "幻境探险",
        cover_image: "/placeholder.svg?height=600&width=400",
        author: {
          id: "user3",
          username: "王五",
        },
        play_count: 203,
        created_at: "2023-02-18T11:30:00Z",
      },
    ]
  } else {
    // 如果没有匹配的标签，返回空数组
    filteredGames = []
  }

  return NextResponse.json(filteredGames)
}
