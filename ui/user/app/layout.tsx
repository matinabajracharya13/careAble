import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeConfigProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from '@/components/ui/toast';
import QueryProvider from '@/components/shared/QueryProvider';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <head>
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
        />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
      </head>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <QueryProvider>
          <AuthProvider>
            <ThemeConfigProvider>
              <Navbar />
              <main className='flex-1'>{children}</main>
              <Toaster />
            </ThemeConfigProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
