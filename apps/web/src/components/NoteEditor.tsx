import { CheckCircleIcon, CircleNotchIcon, TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { formatRelativeTime } from '../lib/utils';

// Editor Status

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
          <CheckCircleIcon className="size-3.5 text-green-500" weight="bold" />
          <span className="text-green-500">Saved</span>
        </>
      )}
    </div>
  );
}

// Note Editor

function NoteEditor() {
  const { selectedNote, updateNote, deleteNote } = useNotes();

  const [title, setTitle] = useState(selectedNote?.title || '');
  const [content, setContent] = useState(selectedNote?.content || '');

  const [status, setStatus] = useState<NoteEditorStatus | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentValuesRef = useRef({ title: '', content: '' });
  const selectedNoteRef = useRef<typeof selectedNote>(null);
  const updateNoteRef = useRef(updateNote);

  // Keep refs updated
  useEffect(() => {
    selectedNoteRef.current = selectedNote;
    updateNoteRef.current = updateNote;
  });

  // Save any pending changes before switching notes
  useEffect(() => {
    return () => {
      // Save any pending changes before switching notes
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        // Trigger immediate save if there were pending changes
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

  // Update local state when selectedNote changes (but not when it's just updated from our own save)
  const selectedNoteIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (selectedNote?.id !== selectedNoteIdRef.current) {
      // Only update state if we're switching to a different note
      const newTitle = selectedNote?.title || '';
      const newContent = selectedNote?.content || '';
      setTitle(newTitle);
      setContent(newContent);
      currentValuesRef.current = { title: newTitle, content: newContent };
      selectedNoteIdRef.current = selectedNote?.id || null;
    }
  }, [selectedNote]);

  // Keep ref in sync with state changes
  useEffect(() => {
    currentValuesRef.current = { title, content };
  }, [title, content]);

  const handleSaveChanges = useCallback(() => {
    const currentSelectedNote = selectedNoteRef.current;
    if (!currentSelectedNote) return;

    setStatus(NoteEditorStatus.Saving);

    // Get the most current values from the ref
    const { title: currentTitle, content: currentContent } = currentValuesRef.current;

    console.log('Saving with values:', { currentTitle, currentContent });

    // Simulate async save operation
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
  }, []); // No dependencies needed since we use refs

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSaveChanges();
    }, 3000);
  }, [handleSaveChanges]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  function handleDeleteNote() {
    if (!selectedNote) return;

    deleteNote(selectedNote.id);
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    debouncedSave();
  }

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    debouncedSave();
  }

  if (!selectedNote) return null;

  return (
    <div className="flex-1 bg-card shadow-card rounded-xl border border-card-border p-8 gap-4 relative flex flex-col">
      <input
        className="text-4xl font-semibold focus:outline-none"
        value={title}
        onChange={handleTitleChange}
        placeholder="Your note title..."
      />
      <textarea
        className="text-base/snug text-foreground-secondary focus:outline-none flex-1 resize-none"
        value={content}
        onChange={handleContentChange}
        placeholder="A long note about your day..."
      />

      {/* Editor actions */}
      <button
        className="hover:scale-110 active:scale-95 absolute bottom-3 right-3 aspect-square p-1.5 flex items-center justify-center cursor-pointer text-red-500/50 hover:text-red-500/100 transition-all duration-300"
        onClick={handleDeleteNote}
      >
        <TrashIcon weight="bold" className="transition-all duration-300" />
      </button>

      {/* Status indicator / last edited at */}
      <div className="absolute bottom-3 left-4 text-xs">
        {status ? (
          <StatusIndicator status={status} />
        ) : (
          <span className="text-foreground-muted">
            Last edited{' '}
            {formatRelativeTime(
              (new Date().getTime() - (selectedNote.updatedAt.getTime() || 0)) / 1000
            )}{' '}
            ago
          </span>
        )}
      </div>
    </div>
  );
}

export default NoteEditor;
