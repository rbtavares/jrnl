import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import { useNotes } from './context/NotesContext';

function App() {
  const { selectedNote } = useNotes();
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check if this is the user's first time opening the app
  useEffect(() => {
    // const hasVisited = localStorage.getItem('jrnl-has-visited');
    // setIsFirstTime(!hasVisited);
    setIsFirstTime(true);
  }, []);

  // Handle when user clicks "Get Started" on welcome screen
  const handleGetStarted = () => {
    setIsTransitioning(true);
    // Wait for fade out animation to complete before switching screens
    setTimeout(() => {
      localStorage.setItem('jrnl-has-visited', 'true');
      setIsFirstTime(false);
      setIsTransitioning(false);
    }, 800); // Match the exit animation duration
  };

  // Show loading state while checking localStorage
  if (isFirstTime === null) {
    return (
      <div className="w-full max-w-screen-2xl flex min-h-screen p-6 items-center justify-center">
        <div className="text-foreground-muted">Loading...</div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isFirstTime ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)'
          }}
          transition={{ 
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <WelcomeScreen onGetStarted={handleGetStarted} isTransitioning={isTransitioning} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ 
            opacity: 0,
            scale: 0.98,
            filter: 'blur(10px)'
          }}
          animate={{ 
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)'
          }}
          transition={{ 
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="w-full max-w-screen-2xl flex min-h-screen p-6 gap-6 mx-auto"
        >
          {/* Sidebar */}
          <Sidebar />

          {/* Note editor */}
          {selectedNote ? (
            <NoteEditor />
          ) : (
            <h1 className="font-light text-lg tracking-wide flex-1 flex items-center justify-center text-foreground-muted">
              select a note or create a new one to begin writing
            </h1>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
