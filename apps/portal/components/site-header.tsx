"use client";

import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.classList.toggle("menu-open", open); return () => document.body.classList.remove("menu-open"); }, [open]);

  return (
    <header className="site-header">
      <div className="nav-container">
        <a href="/" className="logo" aria-current="page"><span className="logo-sparkle">✨</span><span>姍謙大C 五力教練系統</span></a>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" aria-label={open ? "關閉選單" : "開啟選單"} onClick={() => setOpen((value) => !value)}><span /><span /><span /></button>
        <nav id="site-navigation" className={`nav-links ${open ? "is-open" : ""}`} aria-label="主要導覽">
          <a href="/" className="nav-item is-active" aria-current="page" onClick={() => setOpen(false)}>🏠 首頁</a>
          <a href="https://academy.sanq.ccwu.cc" className="nav-item" onClick={() => setOpen(false)}>📖 教練學院</a>
          <a href="https://academy.sanq.ccwu.cc/#identity-map" className="nav-item" onClick={() => setOpen(false)}>🧭 找我的路</a>
          <a href="https://academy.sanq.ccwu.cc/#journey" className="nav-item" onClick={() => setOpen(false)}>🚩 90天陪跑</a>
          <a href="https://academy.sanq.ccwu.cc/sitemap" className="nav-item" onClick={() => setOpen(false)}>🗺️ 網站地圖</a>
          <a href="https://quiz.sanq.ccwu.cc" className="nav-item nav-btn" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>🎯 開始測驗 ↗</a>
        </nav>
      </div>
      {open ? <button className="menu-scrim" aria-label="關閉選單" onClick={() => setOpen(false)} /> : null}
    </header>
  );
}
