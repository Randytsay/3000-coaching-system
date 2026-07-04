import type { Metadata } from "next";
import { Marcellus, Noto_Sans_TC } from "next/font/google";
import "react-notion-x/styles.css";
import "./globals.css";

const display = Marcellus({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

const body = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "五力教練學院",
  description: "五力教練學院第一版，承接公開內容、90 天陪跑 SOP 與教練養成路徑。",
  icons: {
    icon: "/favicon.ico?v=2",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="site-header">
          <div className="nav-container">
            <a href="https://sanq.ccwu.cc" className="logo">
              <span className="logo-sparkle">✨</span> 姍謙大C 五力教練系統
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
