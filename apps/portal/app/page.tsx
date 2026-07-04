const pathways = [
  {
    title: "找到你的教練天賦",
    href: "https://quiz.sanq.ccwu.cc",
    copy: "先透過五力測驗找到傾向，再決定後續的培養方向。",
    index: "01",
  },
  {
    title: "進入五力教練學院",
    href: "https://academy.sanq.ccwu.cc",
    copy: "公開版學院承接共編內容，整理成可讀、可學、可複製的知識庫。",
    index: "02",
  },
  {
    title: "啟動 90 天陪跑",
    href: "https://academy.sanq.ccwu.cc#journey",
    copy: "從探索、啟動、節奏到複製，讓熱情變成可持續的方法。",
    index: "03",
  },
];

const strengths = [
  "五力不是標籤，而是更適合投入的位置。",
  "問卷只做探索，不直接當成認證判準。",
  "教練系統要能長期運作，不依賴少數人的熱血。",
];

export default function PortalHome() {
  return (
    <main className="portal-shell">
      <section className="hero">
        <p className="eyebrow">SANQ Coaching System</p>
        <h1>把陪跑做成一套能長久運作的教練系統。</h1>
        <p className="lede">
          SANQ 不是再多做一個網站，而是先把測驗、學院、90 天 SOP 與教練角色放進同一套可擴充架構。
        </p>

        <div className="hero-actions">
          <a className="primary-link" href="https://quiz.sanq.ccwu.cc">
            先做五力測驗
          </a>
          <a className="secondary-link" href="https://academy.sanq.ccwu.cc">
            查看學院第一版
          </a>
        </div>
      </section>

      <section className="principles">
        {strengths.map((item) => (
          <article key={item} className="principle-card">
            <span className="principle-mark" />
            <p>{item}</p>
          </article>
        ))}
      </section>

      <section className="path-grid">
        {pathways.map((pathway) => (
          <a key={pathway.title} className="path-card" href={pathway.href}>
            <span className="path-index">{pathway.index}</span>
            <h2>{pathway.title}</h2>
            <p>{pathway.copy}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
