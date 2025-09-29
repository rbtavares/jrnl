import { PlusCircleIcon } from '@phosphor-icons/react';
import type { Note } from '../lib/types';
import { useNotes } from '../context/NotesContext';
import { cn, formatRelativeTime } from '../lib/utils';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
}

function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <div
      className="bg-card shadow-card rounded-xl border border-card-border p-2.5 px-3.5 space-y-2 cursor-pointer"
      onClick={() => onClick(note)}
    >
      <div className="flex justify-between items-end">
        <h1 className={cn("text-xl font-medium text-foreground-primary", note.title ? '' : 'opacity-40')}>{note.title || 'Untitled Note'}</h1>
        <span className="text-xs text-foreground-muted font-light tracking-wide mb-1">
          {formatRelativeTime((new Date().getTime() - note.updatedAt.getTime()) / 1000)}
        </span>
      </div>
      <p className={cn("text-sm/tight mb-0.5 line-clamp-2 text-foreground-secondary", note.content ? '' : 'opacity-35 italic')}>{note.content || 'No content yet...'}</p>
    </div>
  );
}

export default function Sidebar() {
  const { notes, selectNote, addNote } = useNotes();
  return (
    <div className="w-1/5 min-w-64 max-w-84 flex flex-col gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onClick={() => selectNote(note.id)} />
      ))}
      <button
        className="bg-card shadow-card rounded-xl border border-card-border flex items-center gap-1.5 self-end p-2 px-3 cursor-pointer"
        onClick={() => addNote()}
      >
        <PlusCircleIcon weight="bold" size={18} /> New note
      </button>
    </div>
  );
}
