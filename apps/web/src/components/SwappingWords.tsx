import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface SwappingWordsProps {
  words: string[];
  interval?: number;
  className?: string;
}

function SwappingWords({ words, interval = 3000, className = '' }: SwappingWordsProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordWidths, setWordWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Measure all word widths on mount
  useEffect(() => {
    const measureWidths = () => {
      if (measureRef.current) {
        const widths = words.map((word) => {
          measureRef.current!.textContent = word;
          // Use getBoundingClientRect for more precise measurement
          const rect = measureRef.current!.getBoundingClientRect();
          return Math.ceil(rect.width) + 3; // Increased buffer for spacing
        });
        setWordWidths(widths);
      }
    };

    // Small delay to ensure fonts are loaded
    const timer = setTimeout(measureWidths, 100);
    return () => clearTimeout(timer);
  }, [words]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words.length, interval]);

  return (
    <>
      <motion.span
        className={`inline-block relative ${className}`}
        style={{ height: '1.2em', minHeight: '1.2em' }}
        animate={{ width: wordWidths[currentWordIndex] || 'auto' }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWordIndex}
            className="font-borel absolute left-0 top-0 whitespace-nowrap text-2xl"
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
      </motion.span>

      {/* Hidden span for measuring word widths */}
      <span
        ref={measureRef}
        className="font-borel absolute invisible pointer-events-none text-2xl"
        aria-hidden="true"
      />
    </>
  );
}

export default SwappingWords;
