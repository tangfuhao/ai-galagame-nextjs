"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

type CreateGameModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateGameModal({ isOpen, onClose }: CreateGameModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [novelText, setNovelText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setNovelText(text)
    setCharCount(text.length)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!novelText.trim()) {
      setError("请输入小说内容")
      return
    }

    setLoading(true)
    abortControllerRef.current = new AbortController()

    try {
      const createGameUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/games/create`
      const res = await fetch(createGameUrl, {
        method: "POST",
        credentials: "include", // 确保包含 cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ novel_text: novelText, title:"" }),
        signal: abortControllerRef.current.signal,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "创建失败")
      }

      const data = await res.json()
      if (!data.task_id) {
        throw new Error("创建失败")
      }

      toast({
        title: "创建成功",
        description: "您的游戏正在生成中，请在个人中心查看进度",
      })
      onClose()
      router.push("/profile")


    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast({
          variant: "destructive",
          title: "创建失败",
          description: (error as Error).message || "请稍后再试",
        })
        alert((error as Error).message || "请稍后再试")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (loading && abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>创建新游戏</DialogTitle>
          <DialogDescription>输入您的小说内容，AI将自动转化为可交互的视觉小说游戏</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Textarea
            placeholder="在此输入您的小说内容（最多10万字）..."
            value={novelText}
            onChange={handleTextChange}
            className="min-h-[200px] resize-none"
            disabled={loading}
          />

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{charCount > 0 ? `${charCount} 字符` : "请输入内容"}</span>
            <span>{charCount > 100000 ? "超出字数限制" : "最多 100,000 字符"}</span>
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading || charCount === 0 || charCount > 100000}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              "创建游戏"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
