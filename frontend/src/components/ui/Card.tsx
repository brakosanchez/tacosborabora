import { CardHTMLAttributes } from 'react';

interface CardProps extends CardHTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
}

export default function Card({
  children,
  variant = 'primary',
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-lg shadow-sm transition-all duration-200 hover:shadow-md';

  const variantStyles = {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
