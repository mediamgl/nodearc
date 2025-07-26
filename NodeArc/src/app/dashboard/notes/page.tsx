// Copy and paste this entire file:
'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Menu } from 'lucide-react'
import NotesList from '@/components/notes/NotesList'
import NoteEditor from '@/components/notes/NoteEditor'
import { Note } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

export default function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch notes')
      return
    }

    setNotes(data || [])
  }

  const createNote = async (title: string, content: string) => {
    if (!user) return

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title,
        content,
        content_plain: content.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    setNotes([data, ...notes])
    setSelectedNote(data)
    setIsCreatingNew(false)
  }

  const updateNote = async (title: string, content: string) => {
    if (!selectedNote || !user) return

    const { data, error } = await supabase
      .from('notes')
      .update({
        title,
        content,
        content_plain: content.replace(/<[^>]*>/g, ''),
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedNote.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    setNotes(notes.map(n => n.id === data.id ? data : n))
    setSelectedNote(data)
  }

  const deleteNote = async () => {
    if (!selectedNote) return

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', selectedNote.id)

    if (error) {
      throw error
    }

    setNotes(notes.filter(n => n.id !== selectedNote.id))
    setSelectedNote(null)
  }

  const toggleFavorite = async () => {
    if (!selectedNote) return

    const { data, error } = await supabase
      .from('notes')
      .update({ is_favorite: !selectedNote.is_favorite })
      .eq('id', selectedNote.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    setNotes(notes.map(n => n.id === data.id ? data : n))
    setSelectedNote(data)
  }

  const handleNewNote = () => {
    setSelectedNote(null)
    setIsCreatingNew(true)
  }

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content_plain?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-200 bg-white border-r flex flex-col`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">My Notes</h1>
            <button
              onClick={handleNewNote}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              title="Create new note"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <NotesList
          notes={filteredNotes}
          selectedNoteId={selectedNote?.id}
          onSelectNote={setSelectedNote}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium">
            {selectedNote ? 'Edit Note' : isCreatingNew ? 'New Note' : 'Select a note'}
          </h2>
        </div>
        <div className="flex-1 bg-white">
          {(selectedNote || isCreatingNew) ? (
            <NoteEditor
              note={selectedNote || undefined}
              onSave={selectedNote ? updateNote : createNote}
              onDelete={selectedNote ? deleteNote : undefined}
              onToggleFavorite={selectedNote ? toggleFavorite : undefined}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-xl mb-2">No note selected</p>
                <p className="text-sm">Select a note from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
