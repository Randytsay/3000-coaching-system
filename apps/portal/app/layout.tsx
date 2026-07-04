import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SANQ｜五力教練系統",
  description: "SANQ 團隊入口，連接天賦測驗、五力教練學院與後續教練養成系統。",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="site-header">
          <div className="nav-container">
            <a href="https://sanq.ccwu.cc" className="logo">
              <span className="logo-sparkle">✨</span> SANQ 五力教練系統
            </a>
            <nav className="nav-links">
              <a href="https://sanq.ccwu.cc" className="nav-item">🏠 首頁</a>
              <a href="https://academy.sanq.ccwu.cc" className="nav-item">📖 教練學院</a>
              <a href="https://academy.sanq.ccwu.cc#journey" className="nav-item">🚩 90天陪跑</a>
              <a href="https://quiz.sanq.ccwu.cc" className="nav-item nav-btn">🎯 開始測驗</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
