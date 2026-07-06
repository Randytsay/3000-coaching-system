import { getAcademyHomepageData, getAcademyRootPageId, getPageRecordMap, getRendererPageTitle } from "../lib/notion";
import { TrackLink } from "../components/track-link";
import { NotionSyncBadge } from "../components/notion-sync-badge";

export const revalidate = 300;

const principles = [
  { icon: "🧩", title: "找到適合的位置", copy: "五力幫你看見較自然的起點，不是把人貼上標籤。" },
  { icon: "🌱", title: "邊做邊長出能力", copy: "先從小任務開始，在實作、回饋與陪伴中慢慢變熟練。" },
  { icon: "🤝", title: "不是一個人硬撐", copy: "遇到問題有人接力，教練也有督導與團隊支持。" },
];

const journey = [
  { days: "Day 1–30", icon: "🧭", title: "探索與啟動", copy: "完成五力探索、認識自己的優勢，選一個最小任務開始練習。", action: "我現在要做：完成測驗與第一次對談" },
  { days: "Day 31–60", icon: "👟", title: "練習與陪跑", copy: "跟著專項教練實作，在真實情境中練習並取得具體回饋。", action: "我現在要做：每週實作、回報與修正" },
  { days: "Day 61–90", icon: "🏮", title: "穩定與傳承", copy: "整理自己的方法，完成一次帶領或分享，準備陪伴下一位夥伴。", action: "我現在要做：完成成果與下一階段計畫" },
];

const roleIcons = ["🌼", "🌱", "🌳", "🧭"];

const roleTargets: Record<string, { href: string; action: string }> = {
  "一般夥伴": { href: "/paths#general", action: "查看一般夥伴下一步" },
  "準教練": { href: "/paths#trainee", action: "查看準教練養成路線" },
  "正式教練": { href: "/paths#coaches", action: "進入五力教練入口" },
  "總教練": { href: "/paths#lead", action: "進入總教練工作台" },
};

export default async function AcademyHome() {
  const rootPageId = getAcademyRootPageId();

  try {
    const [recordMap, homepage] = await Promise.all([getPageRecordMap(rootPageId), getAcademyHomepageData()]);
    const title = getRendererPageTitle(recordMap);
    const publicSops = homepage.sopItems.filter((item) => item.websitePublic);
    const publicResources = homepage.resourceItems.filter((item) => item.websitePublic && !item.containsPersonalData);

    return (
      <main className="academy-shell">
        <section className="academy-hero">
          <div className="academy-hero-copy">
            <p className="eyebrow">五力教練學院 · 一起把陪跑做好</p>
            <h1>{title}</h1>
            <p className="lede">不論你是剛加入的夥伴，或正在學習帶人的教練，這裡會告訴你：現在在哪裡、下一步做什麼，以及需要誰來陪你。</p>
            <div className="hero-actions">
              <TrackLink className="primary-action" href="/paths" eventName="academy_find_path">找到我的下一步</TrackLink>
              <TrackLink className="text-action" href="https://quiz.sanq.ccwu.cc" target="_blank" rel="noopener noreferrer" eventName="academy_quiz_click" eventData={{ placement: "hero" }}>先做五力測驗 <span>↗</span></TrackLink>
            </div>
          </div>
          <figure className="academy-garden">
            <img src="/five-strengths-garden.webp" alt="五力種子夥伴在學習花園裡一起閱讀與成長" />
            <figcaption>每一力都不同，合在一起才完整。</figcaption>
          </figure>
        </section>

        <section className="principle-row" aria-label="計畫核心觀念">
          {principles.map((item) => <article key={item.title} className="principle-card"><span>{item.icon}</span><div><h2>{item.title}</h2><p>{item.copy}</p></div></article>)}
        </section>

        <section id="identity-map" className="section-block start-section">
          <div className="section-heading centered-heading">
            <p className="eyebrow">Start Here</p>
            <h2>你現在是哪一種角色？</h2>
            <p>不用一次讀完整個網站。先找到自己的身分，只看此刻真正需要的內容。</p>
            <NotionSyncBadge />
          </div>
          <div className="role-grid">
            {homepage.roles.map((role, index) => (
              <article key={role.title} className="role-card">
                <span className="role-icon">{roleIcons[index] || "✨"}</span>
                <h3>{role.title}</h3><p>{role.description}</p>
                <TrackLink href={roleTargets[role.title]?.href || "/paths"} eventName="academy_role_selected" eventData={{ role: role.title }}>{roleTargets[role.title]?.action || "看看接下來怎麼走"} <span>→</span></TrackLink>
              </article>
            ))}
          </div>
        </section>

        <section id="journey" className="section-block journey-section">
          <div className="section-heading journey-heading">
            <div><p className="eyebrow">90 天成長路線</p><h2>從認識自己，到能陪伴別人。</h2></div>
            <p>這不是 90 天衝刺，而是一條可以持續走下去的成長路。每個階段只專注一件最重要的事。</p>
          </div>
          <figure className="journey-illustration"><img src="/journey-90-days.webp" alt="五力夥伴沿著三階段道路，從探索、練習走向穩定陪伴" /></figure>
          <div className="journey-flow">
            {journey.map((stage, index) => (
              <article key={stage.days} className="journey-step">
                <div className="step-top"><span className="step-number">{index + 1}</span><span className="step-icon">{stage.icon}</span></div>
                <p className="step-days">{stage.days}</p><h3>{stage.title}</h3><p>{stage.copy}</p><strong>{stage.action}</strong>
              </article>
            ))}
          </div>
          <TrackLink className="journey-more" href="/journey" eventName="academy_journey_open">查看完整多軌陪跑安排 →</TrackLink>
        </section>

        <section id="coach-paths" className="section-block">
          <div className="section-heading split-heading"><div><p className="eyebrow">五力分工</p><h2>你不必什麼都會，團隊本來就該互相接力。</h2><NotionSyncBadge /></div><p>點進每一力，看看這類教練會如何幫助夥伴。</p></div>
          <div className="power-grid">
            {homepage.powers.map((power, index) => (
              <TrackLink key={power.pageId} className={`power-link-card power-${index % 5}`} href={power.href} eventName="academy_power_selected" eventData={{ power: power.title }}>
                <span className="power-flower" aria-hidden="true">✿</span><h3>{power.title}</h3><p>{power.description}</p><strong>認識這一力 →</strong>
              </TrackLink>
            ))}
          </div>
        </section>

        <section className="section-block action-panel">
          <div><p className="eyebrow">今天就能開始</p><h2>不知道從哪裡開始？先完成五力測驗。</h2><p>測驗不是考試，而是一場認識自己的對話。完成後，再和帶領人一起確認最適合你的第一步。</p></div>
          <TrackLink className="primary-action" href="https://quiz.sanq.ccwu.cc" target="_blank" rel="noopener noreferrer" eventName="academy_quiz_click" eventData={{ placement: "mid_page" }}>開始五力測驗 ↗</TrackLink>
        </section>

        {publicSops.length > 0 ? <section className="section-block"><div className="section-heading"><p className="eyebrow">可使用的陪跑指南</p><h2>需要時再打開，照著一步一步做。</h2></div><div className="sop-grid">{publicSops.map((item) => <a key={item.href} className="sop-card" href={item.href}><div className="sop-meta"><span>{item.phase}</span></div><h3>{item.title}</h3><p>{item.powers.join("・") || "所有教練適用"}</p><small>打開指南 →</small></a>)}</div></section> : null}

        {publicResources.length > 0 ? <section className="section-block"><div className="section-heading"><p className="eyebrow">實用工具</p><h2>把常用表單與工具放在伸手可及的地方。</h2></div><div className="resource-grid">{publicResources.map((item) => <article key={item.href} className="resource-card"><span className="resource-icon">🧰</span><h3>{item.title}</h3><p>{item.purpose}</p><div className="resource-actions"><a href={item.href}>查看使用方式</a>{item.officialUrl ? <a href={item.officialUrl} target="_blank" rel="noreferrer">開啟工具</a> : null}</div></article>)}</div></section> : null}

        <section className="section-block faq-section">
          <div className="section-heading"><p className="eyebrow">常見問題</p><h2>你可能正在想這些事。</h2></div>
          <div className="faq-list">{homepage.faq.map((item) => <details key={item.question} className="faq-item"><summary>{item.question}<span>＋</span></summary><p>{item.answer}</p></details>)}</div>
        </section>
      </main>
    );
  } catch {
    return <main className="academy-shell"><section className="academy-hero"><div className="academy-hero-copy"><p className="eyebrow">五力教練學院</p><h1>一起找到適合你的成長方式</h1><p className="lede">內容正在整理中。你可以先完成五力測驗，從認識自己的優勢開始。</p><a className="primary-action" href="https://quiz.sanq.ccwu.cc" target="_blank" rel="noopener noreferrer">開始五力測驗 ↗</a></div><figure className="academy-garden"><img src="/five-strengths-garden.webp" alt="五力種子夥伴一起學習與成長" /></figure></section></main>;
  }
}
