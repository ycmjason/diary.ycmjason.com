import { motion } from 'motion/react';
import { Spinner } from './Spinner';

export const LLMLoading = () => {
  return (
    <div className="flex max-w-xl flex-col items-center gap-6 px-4">
      <Spinner />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 0.3 }}
      >
        This might take some time on mobile devices... Try this on desktop for a better experience!
      </motion.p>
    </div>
  );
};
