import React from 'react';
import { withErrorHandling } from '../components/withErrorHandling';

const Wrapper = (Component: React.FC) => {
  const WrappedComponent = () => {
    return (
      <div className='content'>
        <Component />
      </div>
    );
  };
  
  return withErrorHandling(WrappedComponent);
};

export default Wrapper;