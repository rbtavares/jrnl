import { CircleNotchIcon } from "@phosphor-icons/react";
import { CheckCircleIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNotes } from "../context/NotesContext";

// Editor Status

const NoteEditorStatus = {
  Saving: 'saving',
  Saved: 'saved',
} as const;

type NoteEditorStatus = typeof NoteEditorStatus[keyof typeof NoteEditorStatus];

function StatusIndicator({ status }: { status: NoteEditorStatus }) {
  return (
    <div className="flex items-center gap-1.5">
      {status === NoteEditorStatus.Saving && (
        <>
          <CircleNotchIcon className="w-4 h-4 text-foreground-muted animate-spin" weight="bold" />
          <span className="text-sm text-foreground-muted">Saving...</span>
        </>
      )}
      {status === NoteEditorStatus.Saved && (
        <>
          <CheckCircleIcon className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-500">Saved</span>
        </>
      )}
    </div>
  );
}

// Note Editor

function NoteEditor() {

  const { selectedNote, updateNote } = useNotes();

  const [title, setTitle] = useState(selectedNote?.title);
  const [content, setContent] = useState(selectedNote?.content);

  const [status, setStatus] = useState<NoteEditorStatus | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleSaveChanges() {
    setStatus(NoteEditorStatus.Saving);

    // Simulate async save operation
    setTimeout(() => {

      if (!selectedNote) return;

      updateNote(selectedNote.id , { title, content });

      setStatus(NoteEditorStatus.Saved);

      // Hide the saved status after 2 seconds
      setTimeout(() => {
        setStatus(null);
      }, 2000);
    }, 100);
  }

  function debouncedSave() {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSaveChanges();
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    debouncedSave();
  }

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    debouncedSave();
  }

  return (
    <div className="flex-1 bg-card shadow-card rounded-xl border border-card-border p-8 gap-4 relative flex flex-col">
      <input className="text-4xl font-semibold focus:outline-none" value={title} onChange={handleTitleChange} />
      <textarea className="text-base/snug text-foreground-secondary focus:outline-none flex-1 resize-none" value={content} onChange={handleContentChange} />

      {/* Status indicator / last edited at */}
      <div className="absolute bottom-3 right-4">
        {status ?
          <StatusIndicator status={status} />
          :
          <span className="text-sm text-foreground-muted">Last edited {selectedNote?.updatedAt.toLocaleDateString()}</span>
        }
      </div>

    </div>
  );
}

export default NoteEditor;