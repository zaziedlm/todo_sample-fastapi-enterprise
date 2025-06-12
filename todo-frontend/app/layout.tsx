import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToDo App - Next.js 15',
  description: 'FastAPIとNext.js 15で構築されたToDoアプリケーション',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        <div className="py-4">
          {children}
        </div>
      </body>
    </html>
  );
}
