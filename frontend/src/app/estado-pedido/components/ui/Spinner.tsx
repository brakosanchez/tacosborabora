import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const Spinner = ({
  size = 'medium',
  color = 'primary',
  className = '',
}: SpinnerProps) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-4',
  };

  const colorClasses = {
    primary: 'border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent',
    secondary: 'border-t-gray-500 border-r-gray-500 border-b-transparent border-l-transparent',
    white: 'border-t-white border-r-white border-b-transparent border-l-transparent',
  };

  return (
    <div className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default Spinner;
