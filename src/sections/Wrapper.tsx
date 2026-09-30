import React from 'react';
import { motion, usePresenceData } from 'framer-motion';
import { withErrorHandling } from '../components/withErrorHandling';
import { LID_CLOSE } from '../components/PokedexLid';

// Page transition: opacity + a short slide only, both GPU-composited (the old one animated a blur).
// Leaving to or from a Pokémon (App's AnimatePresence `custom`), the Pokédex lid shuts over the page
// instead: it stays put, receding a little, until the lid has closed and held shut for a beat (so the
// lid's button has popped in before the next page can open it).
const Wrapper = (Component: React.FC) => {
  const WrappedComponent = () => {
    const underLid = usePresenceData();
    return (
      <motion.div
        className='content'
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={underLid ? { scale: 0.96, transition: { duration: LID_CLOSE + 0.22, ease: 'easeIn' } } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Component />
      </motion.div>
    );
  };

  return withErrorHandling(WrappedComponent);
};

export default Wrapper;
