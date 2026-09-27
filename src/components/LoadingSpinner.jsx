import React from 'react';

const LoadingSpinner = ({ size = 'normal', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    normal: 'w-10 h-10 border-3',
    large: 'w-14 h-14 border-4',
  }[size] || 'w-10 h-10 border-3';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
      <div
        className={`${sizeClasses} border-t-transparent border-[#064C32] rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && <p className="mt-3 text-sm text-[#666666] font-medium tracking-wide">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
