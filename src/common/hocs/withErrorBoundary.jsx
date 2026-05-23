import React, { Component } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';

export const withErrorBoundary = (WrappedComponent, errorFallback) => {
  return class WithErrorBoundary extends Component {
    render() {
      return (
        <ErrorBoundary fallback={errorFallback}>
          <WrappedComponent {...this.props} />
        </ErrorBoundary>
      );
    }
  };
};