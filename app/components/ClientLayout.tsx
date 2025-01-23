'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/context/ThemeContext';
import Sidebar from '@/components/Sidebar';
import ProfileSection from '@/components/ProfileSection';

export default function ClientLayout({ children, session }: { children: React.ReactNode, session: any }) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/register', '/'].includes(pathname);

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <div className="min-h-screen flex">
          {!isAuthPage && <Sidebar />}
          <main className="flex-1 flex">
            {children}
            {!isAuthPage && <ProfileSection />}
          </main>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
} 