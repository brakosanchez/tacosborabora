export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 ${className}`} />
  );
}
