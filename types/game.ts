export interface GameData {
  id: string
  title: string | null
  cover_image: string | null
  description: string | null
  author_id: string
  author_name: string
  author_avatar: string
  version: string
  total_chapters: number
  chapters: Chapter[]
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  title: string
  branches: Branch[]
  characters: Character[]
  dependencies?: Resource[]
}

export interface Branch {
  name: string
  commands: Command[]
}

export interface Character {
  name: string
  oss_url: string
  emotion?: string
  position?: "left" | "center" | "right"
}

export interface Resource {
  name: string
  url: string
}

export type Command =
  | { type: "narration"; name: string | null; content: string | null; is_target_protagonist: boolean | null; oss_url: string | null }
  | { type: "dialogue"; name: string; content: string; is_target_protagonist: boolean; oss_url: string | null }
  | { type: "choice"; name: string | null; content: string; is_target_protagonist: boolean | null; oss_url: string | null }
  | { type: "jump"; name: string | null; content: string; is_target_protagonist: boolean | null; oss_url: string | null }
  | { type: "bg"; name: string; content: string; is_target_protagonist: boolean | null; oss_url: string }
  | { type: "bgm"; name: string; content: string; is_target_protagonist: boolean | null; oss_url: string }
