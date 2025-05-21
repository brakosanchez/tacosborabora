import { useEffect, useState } from 'react';
import { Alert } from './Alert';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export function Toast({ message, type, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Alert type={type} message={message} />
    </div>
  );
}
