import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""

  // 模拟搜索建议
  const suggestions = {
    games: [
      { id: "game1", title: "月光下的誓言" },
      { id: "game2", title: "都市迷情" },
    ],
    authors: [
      { id: "user1", username: "张三" },
      { id: "user2", username: "李四" },
    ],
    tags: [
      { id: "tag1", name: "爱情" },
      { id: "tag8", name: "都市" },
    ],
  }

  return NextResponse.json(suggestions)
}
