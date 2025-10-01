import type { Note } from "../lib/types";
import { cn, formatRelativeTime } from "../lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface NoteItemProps {
  note: Note;
  onClick: (note: Note) => void;
}

export default function NoteItem({ note, onClick }: NoteItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card shadow-card rounded-xl border border-card-border p-2.5 px-3.5 space-y-2 cursor-pointer"
      onClick={() => onClick(note)}
    >
      <div className="flex justify-between items-end gap-2">
        <AnimatePresence mode="wait">
          <motion.h1
            key={note.title || 'untitled'}
            initial={{ opacity: 0 }}
            animate={{ opacity: note.title ? 1 : 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'text-xl font-medium text-foreground-primary truncate min-w-0 flex-1'
            )}
          >
            {note.title || 'Untitled Note'}
          </motion.h1>
        </AnimatePresence>
        <span className="text-xs text-foreground-muted font-light tracking-wide mb-1 whitespace-nowrap flex-shrink-0">
          {formatRelativeTime((new Date().getTime() - note.updatedAt.getTime()) / 1000)}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={note.content || 'empty'}
          initial={{ opacity: 0 }}
          animate={{ opacity: note.content ? 1 : 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'text-sm/tight mb-0.5 line-clamp-2 text-foreground-secondary',
            note.content ? '' : 'italic'
          )}
        >
          {note.content || 'No content yet...'}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}