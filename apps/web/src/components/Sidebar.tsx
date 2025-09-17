import { PlusCircleIcon } from '@phosphor-icons/react';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
}

function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <div className='bg-card shadow-card rounded-xl border border-card-border p-2.5 px-3.5 space-y-2' onClick={() => onClick(note)}>
      <div className='flex justify-between items-end'>
        <h1 className="text-xl font-medium text-foreground-primary">{note.title}</h1>
        <span className='text-xs text-foreground-muted font-light tracking-wide mb-1'>{note.updatedAt.toLocaleDateString()}</span>
      </div>
      <p className='text-sm/tight tracking-wide text-foreground-secondary mb-0.5'>{note.content}</p>
    </div>
  )
}

interface SidebarProps {
  notes: Note[];
  onClickNote: (note: Note) => void;
}

export default function Sidebar({ notes, onClickNote }: SidebarProps) {
  return (
    <div className="w-1/5 min-w-64 max-w-84 flex flex-col gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onClick={() => onClickNote(note)} />
      ))}
      <button className="bg-card shadow-card rounded-xl border border-card-border flex items-center gap-1.5 self-end p-2 px-3 cursor-pointer">
        <PlusCircleIcon weight="bold" size={18} /> New note
      </button>
    </div>
  );
}