import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'TradeBoard — Service Request Board',
  description: 'Post and browse home service job requests. Connect homeowners with skilled tradespeople.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                background: '#0f172a',
                color: '#f8fafc',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#f8fafc' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
