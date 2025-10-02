import { CheckCircleIcon, CircleNotchIcon, TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { formatRelativeTime } from '../lib/utils';
import Dialog from './DeleteDialog';
import Portal from './Portal';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';

// Note Editor Status
const NoteEditorStatus = { Saving: 'saving', Saved: 'saved' } as const;
type NoteEditorStatus = (typeof NoteEditorStatus)[keyof typeof NoteEditorStatus];

function StatusIndicator({ status }: { status: NoteEditorStatus }) {
  return (
    <div className="flex items-center gap-1">
      {status === NoteEditorStatus.Saving && (
        <>
          <CircleNotchIcon className="size-3.5 text-foreground-muted animate-spin" weight="bold" />
          <span className="text-foreground-muted">Saving...</span>
        </>
      )}
      {status === NoteEditorStatus.Saved && (
        <>
          <CheckCircleIcon className="size-3.5 text-green-600" weight="bold" />
          <span className="text-green-600">Saved</span>
        </>
      )}
    </div>
  );
}

// Note Editor
export default function NoteEditor() {
  const { selectedNote, updateNote, deleteNote } = useNotes();
  const [title, setTitle] = useState(selectedNote?.title || '');
  const [content, setContent] = useState(selectedNote?.content || '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [status, setStatus] = useState<NoteEditorStatus | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentValuesRef = useRef({ title: '', content: '' });
  const selectedNoteRef = useRef<typeof selectedNote>(null);
  const updateNoteRef = useRef(updateNote);
  const noteDataRef = useRef<typeof selectedNote>(selectedNote);
  const selectedNoteIdRef = useRef<number | null>(null);

  // Current note
  const currentNote = noteDataRef.current;

  // Updated at delta
  const updatedAtDelta = currentNote
    ? (new Date().getTime() - (currentNote.updatedAt.getTime() || 0)) / 1000
    : 0;

  // Handlers
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    debouncedSave();
  }

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    debouncedSave();
  }

  function handleDeleteNote() {
    if (!selectedNote) return;

    deleteNote(selectedNote.id);
    setIsDeleteDialogOpen(false);
  }

  const handleSaveChanges = useCallback(() => {
    const currentSelectedNote = selectedNoteRef.current;
    if (!currentSelectedNote) return;

    setStatus(NoteEditorStatus.Saving);

    const { title: currentTitle, content: currentContent } = currentValuesRef.current;

    setTimeout(() => {
      updateNoteRef.current(currentSelectedNote.id, {
        title: currentTitle,
        content: currentContent,
      });

      setStatus(NoteEditorStatus.Saved);

      // Hide the saved status after 2 seconds
      setTimeout(() => {
        setStatus(null);
      }, 2000);
    }, 100);
  }, []);

  // Debounced save changes
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSaveChanges();
    }, 3000);
  }, [handleSaveChanges]);

  // Clear save timeout on mount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Keep current values ref in sync with state
  useEffect(() => {
    currentValuesRef.current = { title, content };
  }, [title, content]);

  useEffect(() => {
    if (selectedNote?.id !== selectedNoteIdRef.current) {
      if (selectedNote) {
        const newTitle = selectedNote.title || '';
        const newContent = selectedNote.content || '';
        setTitle(newTitle);
        setContent(newContent);
        currentValuesRef.current = { title: newTitle, content: newContent };
      }
      selectedNoteIdRef.current = selectedNote?.id || null;
    }
  }, [selectedNote]);

  useEffect(() => {
    selectedNoteRef.current = selectedNote;
    updateNoteRef.current = updateNote;
    if (selectedNote)
      noteDataRef.current = selectedNote;
  });

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);

        const { title: currentTitle, content: currentContent } = currentValuesRef.current;
        const currentSelectedNote = selectedNoteRef.current;
        if (
          currentSelectedNote &&
          (currentTitle !== currentSelectedNote.title ||
            currentContent !== currentSelectedNote.content)
        ) {
          updateNoteRef.current(currentSelectedNote.id, {
            title: currentTitle,
            content: currentContent,
          });
        }
      }
    };
  }, [selectedNote]);


  return (
    <motion.div
      initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="absolute inset-0 bg-card shadow-card rounded-xl border border-card-border p-8 gap-4 flex flex-col"
    >

      {/* Delete dialog */}
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <Portal>
            <Dialog onCancel={() => setIsDeleteDialogOpen(false)} onDelete={handleDeleteNote} />
          </Portal>
        )}
      </AnimatePresence>

      {/* Title */}
      <input
        className="text-4xl font-semibold focus:outline-none"
        value={title}
        onChange={handleTitleChange}
        placeholder="Your note title..."
      />

      {/* Content */}
      <textarea
        className="text-base/snug text-foreground-secondary focus:outline-none flex-1 resize-none"
        value={content}
        onChange={handleContentChange}
        placeholder="A long note about your day..."
      />

      {/* Editor actions */}
      <button
        className="hover:scale-110 active:scale-95 absolute bottom-3 right-3 aspect-square p-1.5 flex items-center justify-center cursor-pointer text-red-500/50 hover:text-red-500/100 transition-all duration-300"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <TrashIcon weight="bold" className="transition-all duration-300" />
      </button>

      {/* Status indicator & last edited at */}
      <div className="absolute bottom-3 left-4 text-xs">
        {status ? (
          <StatusIndicator status={status} />
        ) : (
          <span className="text-foreground-muted">
            Last edited {formatRelativeTime(updatedAtDelta)} {updatedAtDelta >= 60 && 'ago'}
          </span>
        )}
      </div>
    </motion.div>
  );
}
