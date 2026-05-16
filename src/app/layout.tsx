import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/redux/provider';
import ThemeRegistry from '@/components/common/ThemeRegistry';

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
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReduxProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}
