import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary-200 rounded-full border-t-primary-600 animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;