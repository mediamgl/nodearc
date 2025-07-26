// Copy and paste this entire file:
export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  content_plain?: string
  created_at: string
  updated_at: string
  is_archived: boolean
  is_favorite: boolean
  tags?: Tag[]
  collections?: Collection[]
}

export interface Collection {
  id: string
  user_id: string
  name: string
  description?: string
  color: string
  created_at: string
  updated_at: string
  notes?: Note[]
}

export interface Tag {
  id: string
  name: string
}

export interface AIInteraction {
  id: string
  user_id: string
  note_id?: string
  query: string
  response: string
  model: string
  created_at: string
}
