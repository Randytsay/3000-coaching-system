const pathways = [
  {
    title: "找到你的教練天賦",
    href: "https://quiz.sanq.ccwu.cc",
    copy: "透過五力測驗發掘你的主修與副修天賦，找到最適合你的帶人定位。",
    index: "01",
    art: (
      <svg className="path-card-art art-quiz" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
        <polyline points="12 2 12 22" />
        <line x1="12" y1="12" x2="22" y2="8.5" />
        <line x1="12" y1="12" x2="2" y2="8.5" />
        <line x1="12" y1="12" x2="22" y2="15.5" />
        <line x1="12" y1="12" x2="2" y2="15.5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
        <circle cx="20" cy="9.8" r="1.5" fill="currentColor" />
        <circle cx="20" cy="14.2" r="1.5" fill="currentColor" />
        <circle cx="4" cy="9.8" r="1.5" fill="currentColor" />
        <circle cx="4" cy="14.2" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    title: "進入五力教練學院",
    href: "https://academy.sanq.ccwu.cc",
    copy: "匯集團隊實戰 SOP 與 FAQ，打造可讀、可複製的系統化知識庫。",
    index: "02",
    art: (
      <svg className="path-card-art art-academy" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M9 6h6" strokeWidth="2" />
        <path d="M9 10h6" strokeWidth="2" />
        <path d="M9 14h4" strokeWidth="2" />
        {/* Floating magic star */}
        <path d="M19 4l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    title: "啟動 90 天陪跑",
    href: "https://academy.sanq.ccwu.cc#journey",
    copy: "從探索、啟動到節奏複製，讓熱情化為可持續的陪跑心法。",
    index: "03",
    art: (
      <svg className="path-card-art art-sop" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
];

const strengths = [
  { text: "適性發展：天賦不是標籤，而是更適合你的定位。", emoji: "🎯" },
  { text: "探索引導：用科學問卷做探索，發掘潛在優勢。", emoji: "✨" },
  { text: "系統複製：建立長期運作系統，陪跑輕鬆又簡單。", emoji: "🌸" }
];

export default function PortalHome() {
  return (
    <main className="portal-shell">
      <div className="hero-wrapper">
        <section className="hero">
          <p className="eyebrow">✨ 姍謙大C 教練系統</p>
          <h1>讓帶人與陪跑，<br/>變成輕鬆好複製的教練系統</h1>
          <p className="lede">
            專為新世代教練打造的陪跑支持系統。在這裡，你可以一鍵檢測個人天賦、翻閱實戰學院指南，用最溫柔且系統化的方式引導夥伴成長。
          </p>

          <div className="hero-actions">
            <TrackLink className="primary-link" href="https://quiz.sanq.ccwu.cc" target="_blank" rel="noopener noreferrer" eventName="portal_quiz_click" eventData={{ placement: "hero" }}>
              💖 開始天賦測驗 ↗
            </TrackLink>
            <TrackLink className="secondary-link" href="https://academy.sanq.ccwu.cc" eventName="portal_academy_click" eventData={{ placement: "hero" }}>
              📖 進入教練學院
            </TrackLink>
          </div>
        </section>
        
        <section className="hero-art">
          <div className="garden-frame floating-element">
            <img src="/five-strengths-garden.webp" alt="五位象徵不同教練天賦的小種子，一起在花園裡閱讀與成長" />
            <span className="art-caption">五種天賦，一起長成一座花園</span>
          </div>
        </section>
      </div>

      {/* Strengths / Principles Section */}
      <section className="principles">
        {strengths.map((item) => (
          <article key={item.text} className="principle-card">
            <span className="principle-mark">{item.emoji}</span>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      {/* Pathways Grid */}
      <section className="path-grid">
        {pathways.map((pathway) => (
          <TrackLink key={pathway.title} className="path-card" href={pathway.href} target={pathway.href.includes("quiz.sanq") ? "_blank" : undefined} rel={pathway.href.includes("quiz.sanq") ? "noopener noreferrer" : undefined} eventName="portal_pathway_click" eventData={{ pathway: pathway.title }}>
            <span className="path-index">{pathway.index}</span>
            {pathway.art}
            <h2>{pathway.title}</h2>
            <p>{pathway.copy}</p>
          </TrackLink>
        ))}
      </section>
    </main>
  );
}
import { TrackLink } from "../components/track-link";
