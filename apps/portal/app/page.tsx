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
          <p className="eyebrow">✨ SANQ Coaching System</p>
          <h1>讓帶人與陪跑，<br/>變成輕鬆好複製的教練系統</h1>
          <p className="lede">
            專為新世代教練打造的陪跑支持系統。在這裡，你可以一鍵檢測個人天賦、翻閱實戰學院指南，用最溫柔且系統化的方式引導夥伴成長。
          </p>

          <div className="hero-actions">
            <a className="primary-link" href="https://quiz.sanq.ccwu.cc">
              💖 開始天賦測驗
            </a>
            <a className="secondary-link" href="https://academy.sanq.ccwu.cc">
              📖 進入教練學院
            </a>
          </div>
        </section>
        
        {/* Right side cute vector illustration */}
        <section className="hero-art">
          <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="floating-element">
            {/* Cute cloud background */}
            <path d="M60 170c-10 0-18-8-18-18s8-18 18-18h160c10 0 18 8 18 18s-8 18-18 18H60z" fill="#FFF0F5" opacity="0.8" />
            <path d="M100 130c-8 0-15-7-15-15s7-15 15-15h80c8 0 15 7 15 15s-7 15-15 15h-80z" fill="#F0F8FF" opacity="0.9" />

            {/* Radar polygon shape representation */}
            <polygon points="140,40 210,90 190,165 90,165 70,90" fill="rgba(184, 156, 255, 0.2)" stroke="#B89CFF" strokeWidth="4" strokeLinejoin="round" />
            <polygon points="140,70 185,100 175,150 105,150 95,100" fill="rgba(255, 111, 145, 0.25)" stroke="#FF6F91" strokeWidth="4" strokeLinejoin="round" />

            {/* Glowing dots */}
            <circle cx="140" cy="70" r="7" fill="#FF6F91" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="185" cy="100" r="7" fill="#7FD8C5" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="175" cy="150" r="7" fill="#FFB37A" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="105" cy="150" r="7" fill="#B89CFF" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="95" cy="100" r="7" fill="#5B9BD5" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Cute smiley character face sitting on the radar */}
            <g transform="translate(115, 95)" className="floating-element-delay">
              {/* Head */}
              <circle cx="25" cy="25" r="28" fill="#FFFFFF" stroke="#3D2254" strokeWidth="4" />
              {/* Happy eyes */}
              <path d="M15 22c1-2 4-2 5 0M30 22c1-2 4-2 5 0" stroke="#3D2254" strokeWidth="3" strokeLinecap="round" />
              {/* Smiling mouth */}
              <path d="M21 30c3 2 5 2 8 0" stroke="#3D2254" strokeWidth="3" strokeLinecap="round" />
              {/* Blushing cheeks */}
              <circle cx="11" cy="26" r="4" fill="#FF8AAE" opacity="0.8" />
              <circle cx="39" cy="26" r="4" fill="#FF8AAE" opacity="0.8" />
            </g>

            {/* Sparkles */}
            <path d="M40 70l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFB37A" />
            <path d="M230 160l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#7FD8C5" />
            <path d="M240 60l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="#FF6F91" />
            <path d="M50 180l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#B89CFF" />
          </svg>
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
          <a key={pathway.title} className="path-card" href={pathway.href}>
            <span className="path-index">{pathway.index}</span>
            {pathway.art}
            <h2>{pathway.title}</h2>
            <p>{pathway.copy}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
