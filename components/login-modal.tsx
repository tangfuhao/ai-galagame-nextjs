"use client"

import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type LoginModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // 修改 handleGoogleLogin 函数，添加加载状态
  const handleGoogleLogin = () => {
    setIsLoggingIn(true)

    // 获取当前页面的 URI 作为重定向目标
    const currentUri = encodeURIComponent(window.location.href)

    // 使用环境变量构建 Google 登录 URL
    const loginUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google?redirect_to=${currentUri}`

    // 重定向到登录 URL
    window.location.href = loginUrl
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // 如果正在登录中，阻止关闭弹窗
        if (isLoggingIn && open) return
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>登录到 AI-Galgame</DialogTitle>
          <DialogDescription>选择以下方式登录到平台，开始创作和体验 AI 生成的视觉小说</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 h-12"
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>正在登录...</span>
              </>
            ) : (
              <>
                <FcGoogle className="h-5 w-5" />
                <span>使用 Google 账号登录</span>
              </>
            )}
          </Button>

          {/* 未来可能添加的其他登录选项 */}
          <Button variant="outline" className="flex items-center justify-center gap-2 h-12 opacity-50" disabled={true}>
            <span>更多登录方式即将推出...</span>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-2">
          <p>
            登录即表示您同意我们的
            <a href="/terms" className="underline hover:text-primary">
              服务条款
            </a>
            和
            <a href="/privacy" className="underline hover:text-primary">
              隐私政策
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
