import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  // 在实际应用中，这里会更新数据库中的游玩次数
  // 这里只返回成功响应
  return NextResponse.json({ success: true })
}
