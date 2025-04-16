import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // 在实际应用中，这里会处理OAuth回调并验证用户身份
  // 这里使用模拟数据

  // 设置cookie
  cookies().set({
    name: "auth_token",
    value: "mock_token_123",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7天
  })

  return NextResponse.json({
    id: "user1",
    username: "张三",
    email: "zhangsan@example.com",
    avatar_url: "/placeholder.svg?height=40&width=40",
    created_at: "2023-01-15T08:30:00Z",
    game_count: 3,
  })
}
