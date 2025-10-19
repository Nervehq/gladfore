import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProviderWrapper } from '@/components/providers/auth-provider-wrapper';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gladfore - Fertilizer Credit Management',
  description: 'Digital platform for fertilizer credit and order management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviderWrapper>
          {children}
          <Toaster />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
