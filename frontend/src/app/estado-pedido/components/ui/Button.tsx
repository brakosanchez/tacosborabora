import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
}

const Button = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'rounded font-medium transition-colors duration-200';
  const sizeStyles = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };
  const variantStyles = {
    contained: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      error: 'bg-red-600 text-white hover:bg-red-700',
    },
    outlined: {
      primary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
      secondary: 'border border-gray-600 text-gray-600 hover:bg-gray-50',
      error: 'border border-red-600 text-red-600 hover:bg-red-50',
    },
    text: {
      primary: 'text-blue-600 hover:bg-blue-50',
      secondary: 'text-gray-600 hover:bg-gray-50',
      error: 'text-red-600 hover:bg-red-50',
    },
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant][color]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
