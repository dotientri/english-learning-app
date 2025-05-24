// src/app/layout.jsx
import '@/app/globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'English Mastery',
  description: 'Learn English with fun and interactive tools',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container mx-auto px-4 sm:px-6 py-3 text-center">
            <nav className="flex justify-center items-center gap-3 sm:gap-5 mt-2">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/chapters" className="nav-link">
                Chapters
              </Link>
              <Link href="/learn" className="nav-link">
                Learn
              </Link>
              <Link href="/review" className="nav-link">
                Review
              </Link>
            </nav>
          </div>
        </header>
        <div className="layout-container max-w-screen-xl mx-auto">
          <aside className="menu">
            <div className="container mx-auto px-4 py-4">
              {/* Nội dung menu (có thể để trống hoặc thêm sau) */}
            </div>
          </aside>
          <main className="content">{children}</main>
          <aside className="ad"></aside>
        </div>
        <footer className="footer">
          <div className="container mx-auto px-4 sm:px-6 py-3 text-center">
            <p className="text-sm text-gray-600">© 2025 English Mastery. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}