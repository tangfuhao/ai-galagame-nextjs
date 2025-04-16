import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  // 模拟游戏详情数据
  if (id === "game1") {
    return NextResponse.json({
      id: "game1",
      title: "月光下的誓言",
      author: {
        id: "user1",
        username: "张三",
      },
      scenes: [
        {
          id: "scene1",
          background: "/placeholder.svg?height=720&width=1280",
          characters: [
            {
              id: "char1",
              image: "/placeholder.svg?height=600&width=300",
              position: "center",
            },
          ],
          dialog: {
            text: "这是一个美丽的夜晚，月光如水般洒在湖面上。",
            character: "旁白",
          },
        },
        {
          id: "scene2",
          background: "/placeholder.svg?height=720&width=1280",
          characters: [
            {
              id: "char1",
              image: "/placeholder.svg?height=600&width=300",
              position: "left",
            },
            {
              id: "char2",
              image: "/placeholder.svg?height=600&width=300",
              position: "right",
            },
          ],
          dialog: {
            text: "你愿意和我一起看这美丽的月光吗？",
            character: "李明",
          },
        },
        {
          id: "scene3",
          background: "/placeholder.svg?height=720&width=1280",
          characters: [
            {
              id: "char2",
              image: "/placeholder.svg?height=600&width=300",
              position: "right",
            },
          ],
          dialog: {
            text: "我很乐意，这是我见过最美的月光。",
            character: "小红",
            choices: [
              {
                text: "牵起她的手",
                next_scene: "scene4",
              },
              {
                text: "继续欣赏月光",
                next_scene: "scene5",
              },
            ],
          },
        },
        {
          id: "scene4",
          background: "/placeholder.svg?height=720&width=1280",
          characters: [
            {
              id: "char1",
              image: "/placeholder.svg?height=600&width=300",
              position: "left",
            },
            {
              id: "char2",
              image: "/placeholder.svg?height=600&width=300",
              position: "right",
            },
          ],
          dialog: {
            text: "你的手好温暖...",
            character: "小红",
          },
        },
        {
          id: "scene5",
          background: "/placeholder.svg?height=720&width=1280",
          characters: [
            {
              id: "char1",
              image: "/placeholder.svg?height=600&width=300",
              position: "left",
            },
            {
              id: "char2",
              image: "/placeholder.svg?height=600&width=300",
              position: "right",
            },
          ],
          dialog: {
            text: "这样的夜晚，真希望能永远持续下去。",
            character: "李明",
          },
        },
      ],
    })
  }

  // 如果没有找到游戏，返回404
  return NextResponse.json({ message: "Game not found" }, { status: 404 })
}
