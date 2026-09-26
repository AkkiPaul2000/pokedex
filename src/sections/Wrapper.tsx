import React from 'react';
import { motion } from 'framer-motion';
import { withErrorHandling } from '../components/withErrorHandling';

// Page transition: opacity + a short slide only, both GPU-composited (the old one animated a blur).
const Wrapper = (Component: React.FC) => {
  const WrappedComponent = () => {
    return (
      <motion.div
        className='content'
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Component />
      </motion.div>
    );
  };

  return withErrorHandling(WrappedComponent);
};

export default Wrapper;
