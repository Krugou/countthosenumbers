import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  height?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = React.memo(({
  className = '',
  count = 1,
  height = 'h-4'
}) => {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`bg-gray-600 rounded ${height} ${index < count - 1 ? 'mb-2' : ''}`}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';