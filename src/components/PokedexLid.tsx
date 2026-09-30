import React from 'react';
import { motion } from 'framer-motion';

// Seconds the lid takes to shut; a page leaving under it waits this long (Wrapper).
export const LID_CLOSE = 0.32;

const shut = { duration: LID_CLOSE, ease: [0.55, 0, 0.9, 0.4] } as const; // speeds up into the snap
const split = { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 } as const; // after the button pops

// The Pokédex lid: red and dark halves that shut over the page on the way to or from a Pokémon,
// stay shut (button pinging) while it loads, then split open on it. Starts shut, so the app opens too.
function PokedexLid({ closed, label }: { closed: boolean; label?: string }) {
  return (
    <div className={`lid${closed ? ' shut' : ''}`} aria-hidden>
      <motion.div className='lid-half lid-top' initial={{ y: '0%' }} animate={{ y: closed ? '0%' : '-100%' }} transition={closed ? shut : split}>
        {label && <span className='lid-label'>{label}</span>}
      </motion.div>
      <motion.div className='lid-half lid-bottom' initial={{ y: '0%' }} animate={{ y: closed ? '0%' : '100%' }} transition={closed ? shut : split}>
        <span className='lid-brand'>Pokédex</span>
      </motion.div>
      <motion.div
        className='lid-button'
        initial={{ scale: 1 }}
        animate={{ scale: closed ? 1 : 0 }}
        transition={closed ? { type: 'spring', stiffness: 520, damping: 16, delay: LID_CLOSE * 0.8 } : { duration: 0.14 }}
      />
    </div>
  );
}

export default PokedexLid;
