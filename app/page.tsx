import { Navbar } from "@/components/navbar"
import { GameCardContainer } from "@/components/game-card-container"
import { TagFilter } from "@/components/tag-filter"
import { Suspense } from "react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">AI-Galgame 平台</h1>
        <p className="text-muted-foreground mb-8">
          基于AI技术实现小说→Galgame的自动转化平台，让您的文字故事变成可交互的视觉小说
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">探索游戏</h2>
          <Suspense>
            <TagFilter />
            <GameCardContainer />
          </Suspense>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          {new Date().getFullYear()} AI-Galgame 
        </div>
      </footer>
    </div>
  )
}
