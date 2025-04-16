import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  // 检查cookie中是否有auth_token
  const cookieStore = cookies()
  const authToken = cookieStore.get("auth_token")

  if (authToken) {
    // 在实际应用中，这里会验证token并返回用户信息
    // 这里使用模拟数据
    return NextResponse.json({
      id: "user1",
      username: "张三",
      email: "zhangsan@example.com",
      avatar_url: "/placeholder.svg?height=40&width=40",
      created_at: "2023-01-15T08:30:00Z",
      game_count: 3,
    })
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}
