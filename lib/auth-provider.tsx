"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type User = {
  id: string
  username: string
  email: string
  avatar_url: string
  created_at: string
  game_count?: number
}

type AuthContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  rememberLogin: boolean
  setRememberLogin: (remember: boolean) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [rememberLogin, setRememberLogin] = useState(() => {
    // 从本地存储中读取记住登录设置
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("remember_login")
      return saved ? JSON.parse(saved) : true
    }
    return true
  })

  // 保存记住登录设置到本地存储
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("remember_login", JSON.stringify(rememberLogin))
    }
  }, [rememberLogin])

  // 初始化时检查用户登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 使用环境变量构建获取用户信息的 URL
        const meUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`

        const res = await fetch(meUrl, {
          credentials: "include", // 确保包含 cookies
        })

        if (res.ok) {
          const userResult = await res.json()
          console.log("User data:", userResult)
          const userData = userResult.user
          setUser(userData)

          // 如果设置了记住登录，将用户信息保存到本地存储
          if (rememberLogin && typeof window !== "undefined") {
            localStorage.setItem("user_data", JSON.stringify(userData))
          }
        } else {
          // 如果API请求失败但有本地存储的用户数据，尝试使用它
          if (rememberLogin && typeof window !== "undefined") {
            const savedUser = localStorage.getItem("user_data")
            if (savedUser) {
              setUser(JSON.parse(savedUser))
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)

        // 如果API请求出错但有本地存储的用户数据，尝试使用它
        if (rememberLogin && typeof window !== "undefined") {
          const savedUser = localStorage.getItem("user_data")
          if (savedUser) {
            setUser(JSON.parse(savedUser))
          }
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [rememberLogin])

  // 检查URL参数中的登录状态和错误信息
  useEffect(() => {
    if (typeof window === "undefined") return

    const urlParams = new URLSearchParams(window.location.search)
    const loginSuccess = urlParams.get("login_success")
    const error = urlParams.get("error")
    const errorDescription = urlParams.get("error_description")

    // 处理登录成功
    if (loginSuccess === "true" && user) {
      toast({
        title: "登录成功",
        description: `欢迎回来，${user.username}！`,
        duration: 3000,
      })
    }

    // 处理登录错误
    if (error) {
      toast({
        variant: "destructive",
        title: "登录失败",
        description:
          errorDescription || (error === "access_denied" ? "您取消了登录请求" : "登录过程中出现错误，请稍后再试"),
        duration: 5000,
      })
    }

    // 清除 URL 参数
    if ((loginSuccess || error) && window.history.replaceState) {
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [user, toast])

  // 监听登录状态变更事件
  useEffect(() => {
    const handleAuthChange = (event: CustomEvent) => {
      if (event.detail?.user) {
        setUser(event.detail.user)

        // 如果设置了记住登录，将用户信息保存到本地存储
        if (rememberLogin && typeof window !== "undefined") {
          localStorage.setItem("user_data", JSON.stringify(event.detail.user))
        }
      } else {
        setUser(null)

        // 清除本地存储的用户数据
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_data")
        }
      }
    }

    document.addEventListener("authStateChange", handleAuthChange as EventListener)
    return () => {
      document.removeEventListener("authStateChange", handleAuthChange as EventListener)
    }
  }, [rememberLogin])

  // 登录方法 - 在 useAuth 中实现
  const signIn = async () => {
    // 实现在 useAuth 中
    throw new Error("Not implemented")
  }

  // 登出方法 - 在 useAuth 中实现
  const signOut = async () => {
    // 实现在 useAuth 中
    throw new Error("Not implemented")
  }

  const value = {
    user,
    loading,
    setUser,
    signIn,
    signOut,
    rememberLogin,
    setRememberLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
