import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './client';
import { metadata } from './metadata';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="flex flex-col min-h-screen">
        <ClientLayout>
          <div className="flex-grow">
            {children}
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
