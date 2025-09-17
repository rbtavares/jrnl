import { CircleNotchIcon } from "@phosphor-icons/react";
import type { Note } from "../types";
import { CheckCircleIcon } from "lucide-react";

interface NoteEditorProps {
  note: Note;
}

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

function NoteEditor({ note }: NoteEditorProps) {

  const showStatus = false;

  return (
    <div className="flex-1 bg-card shadow-card rounded-xl border border-card-border p-7 px-7.5 space-y-4 relative">
      <h1 className="text-4xl font-semibold">{note.title}</h1>
      <p className="text-base/snug text-foreground-secondary">{note.content}</p>

      {/* Status indicator / last edited at */}
      <div className="absolute bottom-3 right-4">
        {showStatus ?
          <StatusIndicator status={NoteEditorStatus.Saved} />
          :
          <span className="text-sm text-foreground-muted">Last edited {note.updatedAt.toLocaleDateString()}</span>
        }
      </div>

    </div>
  );
}

export default NoteEditor;