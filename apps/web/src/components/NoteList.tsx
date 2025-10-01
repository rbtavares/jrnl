import { PlusCircleIcon } from '@phosphor-icons/react';
import { useNotes } from '../context/NotesContext';
import NoteItem from './NoteItem';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';

export default function NoteList() {
  const { notes, selectNote, addNote, selectedNote, isLoading } = useNotes();
  const hasAnimatedInitialLoad = useRef(false);

  // Mark that initial animation has occurred when notes are first loaded
  useEffect(() => {
    if (!isLoading && !hasAnimatedInitialLoad.current) {
      hasAnimatedInitialLoad.current = true;
    }
  }, [notes]);

  return (
    <div className="w-1/5 min-w-64 max-w-84 flex flex-col gap-4">

      {/* New Note Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 400,
          damping: 25,
          delay: 0.5
        }}
        className="bg-card shadow-card rounded-xl border border-card-border flex items-center gap-1.5 self-start p-2 px-3 cursor-pointer"
        onClick={() => addNote()}
      >
        <PlusCircleIcon weight="bold" size={18} /> New note
      </motion.button>

      {/* Note List */}
      <AnimatePresence mode="popLayout">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            layout
            transition={{
              layout: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
          >
            <NoteItem 
              note={note} 
              onClick={() => {
                // If this note is already selected, unselect it; otherwise select it
                if (selectedNote?.id === note.id) {
                  selectNote(null);
                } else {
                  selectNote(note.id);
                }
              }} 
              isSelected={selectedNote ? selectedNote?.id === note.id : true}
              animationDelay={!hasAnimatedInitialLoad.current ? 0.6 + index * 0.1 : 0}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
