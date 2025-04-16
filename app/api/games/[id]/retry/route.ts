import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  // 在实际应用中，这里会重新触发游戏生成流程
  // 这里只返回成功响应
  return NextResponse.json({ success: true })
}
