import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-provider"
import { cn } from "@/lib/utils"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI-Galgame - 小说转视觉小说平台",
  description: "基于AI技术实现小说→Galgame的自动转化平台",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


