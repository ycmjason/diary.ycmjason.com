import { AnimatePresence, motion } from 'motion/react';
import type { ComponentProps, ReactNode } from 'react';

export const Faded = ({
  duration = 500,
  ...props
}: { duration?: number } & ComponentProps<typeof motion.div>): ReactNode => {
  return (
    <AnimatePresence propagate>
      {props.children && (
        <motion.div
          key="child"
          initial={{ filter: 'opacity(0) blur(var(--blur-xs))' }}
          animate={{ filter: 'opacity(1) blur(0)' }}
          exit={{ filter: 'opacity(0) blur(var(--blur-xs))' }}
          transition={{ duration: duration / 1000, ease: 'easeInOut' }}
          {...props}
        />
      )}
    </AnimatePresence>
  );
};
