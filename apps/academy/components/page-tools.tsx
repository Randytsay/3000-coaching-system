"use client";

import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

export function PageTools() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reached = new Set<number>();
    const onScroll = () => {
      setVisible(window.scrollY > 700);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const depth = Math.round(window.scrollY / total * 100);
      [25, 50, 75, 100].forEach((mark) => {
        if (depth >= mark && !reached.has(mark)) {
          reached.add(mark);
          track("academy_scroll_depth", { depth: String(mark), path: window.location.pathname });
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <button type="button" className={`back-to-top ${visible ? "is-visible" : ""}`} aria-label="回到頁面頂端" onClick={() => { track("academy_back_to_top"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>↑<span>回頂端</span></button>;
}
