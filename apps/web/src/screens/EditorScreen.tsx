import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';
import { useNotes } from '../context/NotesContext';
import { AnimatePresence, motion } from 'motion/react';

export default function EditorScreen() {
  const { selectedNote, notes, isLoading } = useNotes();

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        // Loading screen
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-screen-2xl flex min-h-screen p-6 gap-6 mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(15px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-light text-lg tracking-wide flex-1 flex items-center justify-center text-foreground-muted"
          >
            loading your notes...
          </motion.h1>
        </motion.div>
      ) : (
        // Editor screen
        <motion.div
          key="editor"
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-screen-2xl flex min-h-screen p-6 gap-6 mx-auto"
        >
          {/* Notes list */}
          <NoteList />

          {/* Note editor */}
          {selectedNote ? (
            <NoteEditor />
          ) : notes.length > 0 ? (
            <h1 className="font-light text-lg tracking-wide flex-1 flex items-center justify-center text-foreground-muted">
              select a note or create a new one to begin writing
            </h1>
          ) : (
            <AnimatePresence mode="wait">
              <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                <motion.h1
                  initial={{ opacity: 0, filter: 'blur(15px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="font-light text-lg tracking-wide text-foreground-muted"
                >
                  create a note to begin <span className="font-borel">your</span> writing journey
                </motion.h1>
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
