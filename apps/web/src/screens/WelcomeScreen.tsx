import { ArrowRightIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  isTransitioning?: boolean;
}

function WelcomeScreen({ onGetStarted, isTransitioning = false }: WelcomeScreenProps) {
  const words = ['create', 'update', 'read', 'delete'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordWidths, setWordWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Measure all word widths on mount
  useEffect(() => {
    if (measureRef.current) {
      const widths = words.map((word) => {
        measureRef.current!.textContent = word;
        return measureRef.current!.offsetWidth + 5;
      });
      setWordWidths(widths);
    }
  }, [words]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="w-full max-w-screen-2xl flex min-h-screen p-6 items-center justify-center bg-background mx-auto">
        <div className="flex flex-col items-center select-none gap-20">
          <div className="flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xl font-light"
            >
              meet
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, filter: 'blur(20px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, delay: 0.75 }}
              className="text-xxl font-medium tracking-wide"
            >
              JRNL
            </motion.h1>
          </div>

          <div>
            <p className="text-2xl text-center font-light">
              {'Probably the simplest notes app ever,'.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                >
                  {word}{' '}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.25 }}
              >
                where you can{' '}
                <motion.span
                  className="inline-block relative"
                  style={{ height: '1.2em', minHeight: '1.2em' }}
                  animate={{ width: wordWidths[currentWordIndex] || 'auto' }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWordIndex}
                      className="font-borel absolute left-0 top-0 whitespace-nowrap"
                    >
                      {words[currentWordIndex].split('').map((letter, letterIndex) => (
                        <motion.span
                          key={`${currentWordIndex}-${letterIndex}`}
                          initial={{ opacity: 0, filter: 'blur(5px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, filter: 'blur(5px)' }}
                          transition={{ duration: 0.5, delay: letterIndex * 0.05 }}
                          className="inline-block"
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>{' '}
                notes.
              </motion.span>
            </p>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 3 }}
            onClick={onGetStarted}
            disabled={isTransitioning}
            className={`text-lg text-background flex items-center gap-2 px-4 py-2.5 rounded-lg font-light transition-all duration-300 ${
              isTransitioning
                ? 'bg-black/50 cursor-not-allowed'
                : 'cursor-pointer hover:scale-110 active:scale-95 bg-black/75 hover:bg-black/90'
            }`}
          >
            {isTransitioning ? 'Loading...' : 'Start writing'}
            {!isTransitioning && (
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block"
              >
                <ArrowRightIcon className="size-5.5" weight="regular" />
              </motion.div>
            )}
          </motion.button>
        </div>

        <div className="absolute bottom-6">{/* <p>Built with love</p> */}</div>

        {/* Hidden span for measuring word widths */}
        <span
          ref={measureRef}
          className="font-borel absolute invisible pointer-events-none text-2xl"
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}

export default WelcomeScreen;
