"use client"

import { useContext, useState } from "react"
import { AuthContext } from "@/lib/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export function useAuth() {
  const context = useContext(AuthContext)
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  const { user, loading, setUser, rememberLogin, setRememberLogin } = context

  // 修改 signIn 函数，使用环境变量构建 URL
  const signIn = async () => {
    // 获取当前页面的 URI 作为重定向目标
    const currentUri = encodeURIComponent(window.location.href)

    // 使用环境变量构建 Google 登录 URL
    const loginUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google?redirect_to=${currentUri}`

    // 重定向到登录 URL
    window.location.href = loginUrl
  }

  const signOut = async () => {
    try {
      setIsLoggingOut(true)

      // 使用环境变量构建登出 URL
      const logoutUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`

      const res = await fetch(logoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 确保包含 cookies
      })

      if (res.ok) {
        setUser(null)

        // 清除本地存储的用户数据
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_data")
        }

        // 触发全局登出状态变更事件
        document.dispatchEvent(new CustomEvent("authStateChange", { detail: { user: null } }))

        toast({
          title: "已退出登录",
          description: "您已成功退出登录",
          duration: 3000,
        })
      } else {
        throw new Error("登出失败")
      }
    } catch (error) {
      console.error("Logout failed:", error)

      toast({
        variant: "destructive",
        title: "退出登录失败",
        description: "请稍后再试",
        duration: 5000,
      })

      throw error
    } finally {
      setIsLoggingOut(false)
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isLoggingOut,
    rememberLogin,
    setRememberLogin,
  }
}
