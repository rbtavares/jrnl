import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import type { ReactNode } from 'react';
import type { Note } from '../lib/types';
import { NoteSchema } from '../lib/types';
import axios from 'axios';
import { z } from 'zod';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error('VITE_API_URL is not set');
}

// Actions for the notes reducer
type NotesAction =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Partial<Pick<Note, 'title' | 'content'>> & { id: number } }
  | { type: 'DELETE_NOTE'; payload: number };

// Context interface
interface NotesContextType {
  // Status
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Notes
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  fetchNotes: () => void;

  selectNote: (id: number | null) => void;
  selectedNote: Note | null;
  addNote: (noteData?: Pick<Note, 'title' | 'content'>) => void;
  updateNote: (id: number, updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
  deleteNote: (id: number) => void;
}

// Reducer function
function notesReducer(state: Note[], action: NotesAction): Note[] {
  switch (action.type) {
    case 'SET_NOTES':
      return action.payload;
    case 'ADD_NOTE':
      return state.concat(action.payload);
    case 'UPDATE_NOTE':
      return state.map((note) =>
        note.id === action.payload.id ? { ...note, ...action.payload, updatedAt: new Date() } : note
      );
    case 'DELETE_NOTE':
      return state.filter((note) => note.id !== action.payload);
    default:
      return state;
  }
}

// Create context
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Provider component
interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notes, dispatch] = useReducer(notesReducer, [] as Note[]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Update selectedNote when the corresponding note in notes array changes
  useEffect(() => {
    if (selectedNote) {
      const updatedSelectedNote = notes.find((note) => note.id === selectedNote.id);
      if (updatedSelectedNote && updatedSelectedNote !== selectedNote) {
        setSelectedNote(updatedSelectedNote);
      }
    }
  }, [notes, selectedNote]);

  useEffect(() => {
    fetchNotes();
  }, []);

  /**
   * Fetch the notes from the server
   */
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/entries`);

      const notesArray = z
        .array(NoteSchema)
        .parse(
          response.data.entries.map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.createdAt),
            updatedAt: new Date(entry.updatedAt),
          }))
        );

      dispatch({ type: 'SET_NOTES', payload: notesArray });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('Invalid data format received from server');
        console.error('Zod validation error:', error.issues);
      } else {
        setError('Failed to fetch notes');
        console.error('Fetch error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a new note to the notes array
   * @param noteData - The note data to add
   */
  const addNote = async (noteData?: Pick<Note, 'title' | 'content'>) => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_URL}/entries`,
        noteData || { title: '', content: '' }
      );

      const note = NoteSchema.parse({
        ...response.data.entry,
        createdAt: new Date(response.data.entry.createdAt),
        updatedAt: new Date(response.data.entry.updatedAt),
      });

      dispatch({ type: 'ADD_NOTE', payload: note });
      setSelectedNote(note);
      return;
    } catch (error) {
      setError('Failed to add note');
      console.error('Add note error:', error);
      throw error;
    }
  };

  /**
   * Update a note in the notes array
   * @param id - The id of the note to update
   * @param updates - The updates to apply to the note
   */
  const updateNote = async (id: number, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    try {
      setError(null);
      await axios.put(`${API_URL}/entries/${id}`, updates);

      dispatch({ type: 'UPDATE_NOTE', payload: { id, ...updates } });
      return;
    } catch (error) {
      setError('Failed to update note');
      console.error('Update note error:', error);
      throw error;
    }
  };

  /**
   * Delete a note in the notes array
   * @param id - The id of the note to delete
   */
  const deleteNote = async (id: number) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/entries/${id}`);
      dispatch({ type: 'DELETE_NOTE', payload: id });
      setSelectedNote(null);
    } catch (error) {
      setError('Failed to delete note');
      console.error('Delete note error:', error);
      throw error;
    }
  };

  /**
   * Set the notes array
   * @param notes - The notes to set
   */
  const setNotes = async (notes: Note[]) => {
    dispatch({ type: 'SET_NOTES', payload: notes });
  };

  /**
   * Select a note
   * @param id - The id of the note to select
   */
  const selectNote = async (id: number | null) => {
    setSelectedNote(id ? notes.find((note) => note.id === id) || null : null);
  };

  const contextValue: NotesContextType = {
    notes,
    fetchNotes,
    selectNote,
    selectedNote,
    isLoading,
    setIsLoading,
    error,
    setError,
    addNote,
    updateNote,
    deleteNote,
    setNotes,
  };

  return <NotesContext.Provider value={contextValue}>{children}</NotesContext.Provider>;
}

// Custom hook to use the notes context
export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
