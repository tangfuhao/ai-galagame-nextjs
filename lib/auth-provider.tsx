"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"

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
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 初始化时检查用户登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // 监听登录状态变更事件
  useEffect(() => {
    const handleAuthChange = (event: CustomEvent) => {
      if (event.detail?.user) {
        setUser(event.detail.user)
      } else {
        setUser(null)
      }
    }

    document.addEventListener("authStateChange", handleAuthChange as EventListener)
    return () => {
      document.removeEventListener("authStateChange", handleAuthChange as EventListener)
    }
  }, [])

  // 登录方法
  const signIn = async () => {
    // 在实际应用中，这里会重定向到 Google OAuth 流程
    // 这里使用模拟数据进行演示
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        const userData = await res.json()
        setUser(userData)

        // 触发全局登录状态变更事件
        document.dispatchEvent(new CustomEvent("authStateChange", { detail: { user: userData } }))
      } else {
        throw new Error("登录失败")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  // 登出方法
  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)

      // 清除本地存储
      localStorage.removeItem("auth_token")

      // 触发全局登录状态变更事件
      document.dispatchEvent(new CustomEvent("authStateChange", { detail: { user: null } }))
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}
