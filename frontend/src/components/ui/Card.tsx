import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function Card({
  children,
  variant = 'primary',
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-lg shadow-sm transition-all duration-200 hover:shadow-md';

  const variantStyles = {
    primary: '',
    secondary: 'bg-opacity-10',
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
