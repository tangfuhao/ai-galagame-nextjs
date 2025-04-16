import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  // 在实际应用中，这里会返回游戏预览视频
  // 这里只返回一个空响应，因为前端会使用占位图
  return new NextResponse(null, { status: 204 })
}
