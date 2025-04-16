import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求体
    if (!body.content || typeof body.content !== "string") {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    // 在实际应用中，这里会检查内容是否包含敏感词
    // 这里只做简单的长度检查
    if (body.content.length < 10) {
      return NextResponse.json({ message: "内容太短，请至少输入10个字符" }, { status: 400 })
    }

    // 返回验证成功响应
    return NextResponse.json({ valid: true })
  } catch (error) {
    return NextResponse.json({ message: "Failed to validate content" }, { status: 500 })
  }
}
