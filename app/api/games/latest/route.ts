import { NextResponse } from "next/server"

export async function GET() {
  // 模拟最新游戏数据
  const latestGames = [
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

  return NextResponse.json(latestGames)
}
