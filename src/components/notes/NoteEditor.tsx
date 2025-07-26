// Copy and paste this entire file:
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import { Save, Trash2, Star, StarOff } from 'lucide-react'
import { Note } from '@/types'
import toast from 'react-hot-toast'

interface NoteEditorProps {
  note?: Note
  onSave: (title: string, content: string) => Promise<void>
  onDelete?: () => Promise<void>
  onToggleFavorite?: () => Promise<void>
}

export default function NoteEditor({ note, onSave, onDelete, onToggleFavorite }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '')
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your thoughts...',
      }),
    ],
    content: note?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none',
      },
    },
  })

  useEffect(() => {
    if (note && editor) {
      editor.commands.setContent(note.content)
      setTitle(note.title)
    }
  }, [note, editor])

  const handleSave = async () => {
    if (!editor) return
    
    setIsSaving(true)
    try {
      await onSave(title, editor.getHTML())
      toast.success('Note saved!')
    } catch (error) {
      toast.error('Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete || !confirm('Are you sure you want to delete this note?')) return
    
    try {
      await onDelete()
      toast.success('Note deleted')
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="text-2xl font-bold bg-transparent border-none outline-none flex-1"
        />
        <div className="flex items-center space-x-2">
          {note && onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {note.is_favorite ? (
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              ) : (
                <StarOff className="h-5 w-5 text-gray-400" />
              )}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
          {note && onDelete && (
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete note"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
