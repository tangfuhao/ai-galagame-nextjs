"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchApi } from '@/lib/api';

type Tag = {
  id: string
  name: string
}

export function TagFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTag = searchParams.get("tag")
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetchApi("/api/tags", { skipAuth: true });
        if (res.ok) {
          const data = await res.json()
          setTags(data)
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  const handleTagClick = (tagName: string) => {
    if (currentTag === tagName) {
      // 如果点击当前选中的标签，则清除筛选
      router.push("/")
    } else {
      router.push(`/?tag=${encodeURIComponent(tagName)}`)
    }
  }

  if (loading) {
    return (
      <div className="mb-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-3">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-full" />
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-3">
          <Button
            variant={!currentTag ? "default" : "outline"}
            className="rounded-full"
            onClick={() => router.push("/")}
          >
            全部
          </Button>

          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant={currentTag === tag.name ? "default" : "outline"}
              className="rounded-full"
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
