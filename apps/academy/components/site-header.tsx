"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "https://sanq.ccwu.cc", label: "首頁", icon: "🏠", match: "portal" },
  { href: "/", label: "教練學院", icon: "📖", match: "academy" },
  { href: "/#identity-map", label: "找我的路", icon: "🧭", match: "identity" },
  { href: "/#journey", label: "90天陪跑", icon: "🚩", match: "journey" },
  { href: "/sitemap", label: "網站地圖", icon: "🗺️", match: "sitemap" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className="site-header">
      <div className="nav-container">
        <a href="https://sanq.ccwu.cc" className="logo"><span className="logo-sparkle">✨</span><span>姍謙大C 五力教練系統</span></a>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" aria-label={open ? "關閉選單" : "開啟選單"} onClick={() => setOpen((value) => !value)}>
          <span /><span /><span />
        </button>
        <nav id="site-navigation" className={`nav-links ${open ? "is-open" : ""}`} aria-label="主要導覽">
          {links.map((item) => {
            const active = item.match === "academy" && pathname === "/" || item.match === "academy" && pathname.startsWith("/p/") || item.match === "sitemap" && pathname === "/sitemap";
            return <a key={item.label} href={item.href} className={`nav-item ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}><span>{item.icon}</span>{item.label}</a>;
          })}
          <a href="https://quiz.sanq.ccwu.cc" className="nav-item nav-btn" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>🎯 開始測驗 ↗</a>
        </nav>
      </div>
      {open ? <button className="menu-scrim" aria-label="關閉選單" onClick={() => setOpen(false)} /> : null}
    </header>
  );
}
