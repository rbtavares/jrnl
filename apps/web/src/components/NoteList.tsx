import { PlusCircleIcon } from '@phosphor-icons/react';
import { useNotes } from '../context/NotesContext';
import NoteItem from './NoteItem';
import { AnimatePresence } from 'motion/react';

export default function NoteList() {
  const { notes, selectNote, addNote } = useNotes();
  return (
    <div className="w-1/5 min-w-64 max-w-84 flex flex-col gap-4">
      <button
        className="bg-card shadow-card rounded-xl border border-card-border flex items-center gap-1.5 self-start p-2 px-3 cursor-pointer"
        onClick={() => addNote()}
      >
        <PlusCircleIcon weight="bold" size={18} /> New note
      </button>
      <AnimatePresence>
        {notes.map((note) => (
          <NoteItem key={note.id} note={note} onClick={() => selectNote(note.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
