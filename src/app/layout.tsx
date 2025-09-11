// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';
import ChatWidget from '@/app/components/chatbot/ChatWidget';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Amogh\'s Portfolio',
  description: 'Portfolio of Amogh G. Ramagiri - Data Scientist, Developer, Analyst',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}