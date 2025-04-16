// 这个文件是为了模拟API响应，在实际项目中应该连接到真实的后端服务

import { NextResponse } from "next/server"

// 模拟数据库
const mockDatabase = {
  users: [
    {
      id: "user1",
      username: "张三",
      email: "zhangsan@example.com",
      avatar_url: "/placeholder.svg?height=40&width=40",
      created_at: "2023-01-15T08:30:00Z",
      game_count: 3,
    },
  ],
  games: [
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
      status: "published",
    },
    {
      id: "game2",
      title: "都市迷情",
      cover_image: "/placeholder.svg?height=600&width=400",
      author: {
        id: "user1",
        username: "张三",
      },
      play_count: 56,
      created_at: "2023-04-05T09:15:00Z",
      status: "published",
    },
    {
      id: "game3",
      title: "未完成的故事",
      cover_image: null,
      author: {
        id: "user1",
        username: "张三",
      },
      play_count: 0,
      created_at: "2023-05-20T16:40:00Z",
      status: "generating",
      progress: 45,
    },
  ],
  tags: [
    { id: "tag1", name: "爱情" },
    { id: "tag2", name: "悬疑" },
    { id: "tag3", name: "校园" },
    { id: "tag4", name: "奇幻" },
    { id: "tag5", name: "科幻" },
    { id: "tag6", name: "历史" },
    { id: "tag7", name: "武侠" },
    { id: "tag8", name: "都市" },
  ],
  gameDetails: {
    game1: {
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
    },
  },
}

// API路由处理函数
export async function GET() {
  return NextResponse.json({ message: "API is working" })
}
