import { ArrowRightIcon } from '@phosphor-icons/react';
import { cn } from '../lib/utils';
import { Loader2Icon } from 'lucide-react';
import { motion } from 'motion/react';
import SwappingWords from '../components/SwappingWords';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  isTransitioning?: boolean;
}

function WelcomeScreen({ onGetStarted, isTransitioning = false }: WelcomeScreenProps) {
  const words = ['create', 'read', 'update', 'delete'];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-screen-2xl flex min-h-screen p-6 items-center justify-center bg-background mx-auto"
    >
      {/* Hero Section */}
      <div className="flex flex-col items-center select-none gap-20">
        {/* Title */}
        <h1 className="text-xxl font-medium tracking-wide">
          {'JRNL'.split('').map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -25, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.5,
                delay: 0.75 + index * 0.075,
                ease: 'easeOut',
                type: 'spring',
                stiffness: 500,
                damping: 20,
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
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
            where you can <SwappingWords words={words} /> notes.
          </motion.span>
        </p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 3 }}
          onClick={() => {
            onGetStarted();
          }}
          disabled={isTransitioning}
          className={cn(
            `text-lg text-background flex items-center gap-2 px-4 py-2.5 rounded-lg font-light transition-all duration-300`,
            isTransitioning
              ? 'bg-black/50 cursor-default'
              : 'cursor-pointer hover:scale-110 active:scale-95 bg-black/80 hover:bg-black/90'
          )}
        >
          {isTransitioning ? 'Loading...' : 'Start writing'}
          {isTransitioning ? (
            <Loader2Icon className="size-5.5 animate-spin" />
          ) : (
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

      {/* Footer Note */}
      <motion.div
        className="absolute bottom-6 text-xs text-foreground-secondary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 5 }}
      >
        <p>
          Built with ❤️ by{' '}
          <a href="https://rbtavare.com" className="font-medium underline">
            rbtavares
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default WelcomeScreen;
