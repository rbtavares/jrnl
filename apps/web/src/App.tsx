import { AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import EditorScreen from './screens/EditorScreen';
import WelcomeScreen from './screens/WelcomeScreen';

export default function App() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  // Check if this is the user's first time opening the app
  useEffect(() => {
    const hasVisited = localStorage.getItem('jrnl-has-visited');
    setIsFirstTime(!hasVisited);
  }, []);

  // Handle when user clicks "Get Started" on welcome screen
  const handleGetStarted = () => {
    setTimeout(() => {
      localStorage.setItem('jrnl-has-visited', 'true');
      setIsFirstTime(false);
    }, 800); // Increased to 1000ms to allow exit animation to complete
  };

  // Show nothing while checking localStorage
  if (isFirstTime === null) return null;

  return (
    <AnimatePresence mode="wait">
      {isFirstTime ? (
        <WelcomeScreen key="welcome" onGetStarted={handleGetStarted} />
      ) : (
        <EditorScreen key="editor" />
      )}
    </AnimatePresence>
  );
}
