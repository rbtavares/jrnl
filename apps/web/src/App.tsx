import axios from 'axios';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import type { Note } from './types';
import NoteEditor from './components/NoteEditor';

function App() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/entries').then((res) => {
      console.log(res.data.entries);
      setNotes(
        res.data.entries.map((entry: any) => ({
          id: entry.id,
          title: entry.title,
          content: entry.content,
          updatedAt: new Date(entry.updatedAt),
          createdAt: new Date(entry.createdAt),
        }))
      );
    });
  }, []);

  return (
    <div className="w-full max-w-screen-2xl flex min-h-screen p-6 gap-6">
      {/* Sidebar */}
      <Sidebar notes={notes} onClickNote={(note) => setSelectedNote(note)} />

      {/* Note editor */}
      {selectedNote ?
        <NoteEditor note={selectedNote} />
        :
        <h1 className="font-light text-lg tracking-wide flex-1 flex items-center justify-center text-foreground-muted">select a note or create a new one to begin writing</h1>
      }
    </div>
  );
}

export default App;
