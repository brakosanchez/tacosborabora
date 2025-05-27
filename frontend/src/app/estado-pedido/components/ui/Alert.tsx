import React from 'react';

interface AlertProps {
  severity?: 'success' | 'info' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const Alert = ({
  severity = 'info',
  children,
  className = '',
  onClose,
  ...props
}: AlertProps) => {
  const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div
      className={`border-l-4 p-4 ${alertStyles[severity]} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex justify-between items-center">
        <div>{children}</div>
        {onClose && (
          <button
            type="button"
            className="ml-4 text-lg font-semibold opacity-50 hover:opacity-75"
            onClick={onClose}
            aria-label="Cerrar"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
