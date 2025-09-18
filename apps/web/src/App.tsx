import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';
import { useNotes } from './context/NotesContext';

function App() {
  const { selectedNote } = useNotes();

  return (
    <div className="w-full max-w-screen-2xl flex min-h-screen p-6 gap-6">
      {/* Sidebar */}
      <Sidebar />

      {/* Note editor */}
      {selectedNote ?
        <NoteEditor />
        :
        <h1 className="font-light text-lg tracking-wide flex-1 flex items-center justify-center text-foreground-muted">select a note or create a new one to begin writing</h1>
      }
    </div>
  );
}

export default App;
