import { NextResponse } from "next/server"

export async function GET() {
  // 模拟标签数据
  const tags = [
    { id: "tag1", name: "爱情" },
    { id: "tag2", name: "悬疑" },
    { id: "tag3", name: "校园" },
    { id: "tag4", name: "奇幻" },
    { id: "tag5", name: "科幻" },
    { id: "tag6", name: "历史" },
    { id: "tag7", name: "武侠" },
    { id: "tag8", name: "都市" },
  ]

  return NextResponse.json(tags)
}
