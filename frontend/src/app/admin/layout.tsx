import { Metadata, Viewport } from 'next';
import { Sidebar } from '@/components/admin/Sidebar';

export const viewport: Viewport = {
  themeColor: '#1a120b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Administración - Tacos Bora Bora',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
