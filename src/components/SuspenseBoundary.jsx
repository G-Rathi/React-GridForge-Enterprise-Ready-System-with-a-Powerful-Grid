import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

const SuspenseBoundary = ({ 
  children, 
  fallback = <LoadingSpinner />,
  onError,
}) => {
  const handleError = (error) => {
    if (onError) {
      onError(error);
    } else {
      console.error('Error in suspended component:', error);
    }
  };

  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary onError={handleError}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};

export default SuspenseBoundary;