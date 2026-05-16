import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/redux/provider';
import ThemeRegistry from '@/components/common/ThemeRegistry';

const inter = Inter({ subsets: ['latin'], display: 'swap', weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Advanced Editable Data Table | Enterprise Dashboard',
  description:
    'A high-performance editable data table capable of handling 10,000+ rows with inline editing, multi-column sorting, filtering, CSV export, and virtualized scrolling.',
  keywords: ['data table', 'editable', 'react', 'next.js', 'enterprise', 'dashboard'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}
