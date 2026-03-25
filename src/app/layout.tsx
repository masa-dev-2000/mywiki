import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MyWiki',
  description: '個人ナレッジベース',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="header">
          <h1><Link href="/">📚 MyWiki</Link></h1>
          <ThemeToggle />
        </header>
        <main>{children}</main>
        <footer className="footer">© 2026 masa</footer>
      </body>
    </html>
  );
}
