import React, { useEffect, useState } from 'react';
import ErrorPage from './Error/ErrorPage';
import ErrorBoundary from './Error/ErrorBoundary';
import { useAppSelector } from '../app/hooks';

export const withErrorHandling = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const [hasTimeout, setHasTimeout] = useState(false);
    const isLoading = useAppSelector((state) => state.app.isLoading);
    
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      
      if (isLoading) {
        timeoutId = setTimeout(() => {
          setHasTimeout(true);
        }, 180000); // 3 minutes
      }
      
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [isLoading]);

    if (hasTimeout) {
      return (
        <ErrorPage 
          message="Request timed out. Please check your connection and try again."
          onRetry={() => {
            setHasTimeout(false);
            window.location.reload();
          }}
        />
      );
    }

    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}; 