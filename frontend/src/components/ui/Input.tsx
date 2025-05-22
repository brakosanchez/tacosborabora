import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  autoComplete?: string;
}

export default function Input({
  label,
  error,
  className = '',
  autoComplete,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
        autoComplete={autoComplete}
      />
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
