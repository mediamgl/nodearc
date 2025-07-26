// Copy and paste this entire file:
'use client'

import { Note } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { Star, Archive } from 'lucide-react'

interface NotesListProps {
  notes: Note[]
  selectedNoteId?: string
  onSelectNote: (note: Note) => void
}

export default function NotesList({ notes, selectedNoteId, onSelectNote }: NotesListProps) {
  return (
    <div className="h-full overflow-y-auto">
      {notes.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>No notes yet</p>
          <p className="text-sm mt-2">Create your first note to get started</p>
        </div>
      ) : (
        <div className="space-y-2 p-2">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedNoteId === note.id
                  ? 'bg-indigo-50 border-indigo-200 border'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {note.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {note.content_plain || 'No content'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center ml-2 space-x-1">
                  {note.is_favorite && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                  {note.is_archived && (
                    <Archive className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
