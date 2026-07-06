import type { Metadata } from "next";
import { TrackLink } from "../../components/track-link";
import { coachPages, compactPageId } from "../../lib/coach-navigation";

export const metadata: Metadata = { title: "網站地圖｜五力教練學院", description: "依照身分、學習階段與教練專項找到五力教練學院內容。" };

const learnerPages = [
  { icon: "🔎", title: "天賦探索", copy: "剛加入，先認識自己的方向", id: "393716701898811caa1fe8b85e655f9f" },
  { icon: "📚", title: "基礎教練課", copy: "建立教練共同語言與界線", id: "39371670189881ea819bd50a5497d574" },
  { icon: "🧩", title: "五力專項訓練", copy: "選擇主修並練習專項能力", id: "393716701898810eae35c657c209a2a2" },
  { icon: "👣", title: "跟班與實習", copy: "進入真實情境觀察與實作", id: "393716701898810c882af8fa81e75609" },
  { icon: "🏅", title: "評量與認證", copy: "確認能力與下一階段發展", id: "39371670189881d0b4eef78a45293865" },
];

const operations = [
  { title: "90 天陪跑總覽", href: "/#journey", icon: "🚩" },
  { title: "個案啟動與分派", href: "/p/39371670189881f99fc6c5a30d5632b4", icon: "📥" },
  { title: "每週陪跑會談", href: "/p/3937167018988179be38dbb2c5da5a50", icon: "💬" },
  { title: "30／60／90 日回顧", href: "/p/393716701898814080e2e3834090f29b", icon: "📊" },
];

export default function SitemapPage() {
  return <main className="academy-shell sitemap-shell">
    <header className="sitemap-hero"><p className="eyebrow">Website Map</p><h1>你想找什麼？從這裡出發。</h1><p>依身分與任務分類，每個目的地只保留一個清楚名稱，避免在相似頁面之間繞路。</p></header>

    <section className="sitemap-section"><div className="sitemap-section-head"><span>01</span><div><h2>我是學習中的夥伴</h2><p>依照目前進度，直接進入對應階段。</p></div></div><div className="sitemap-link-grid learner-map">{learnerPages.map((item) => <TrackLink key={item.id} href={`/p/${item.id}`} eventName="sitemap_click" eventData={{ group: "learner", destination: item.title }}><span>{item.icon}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div><strong>→</strong></TrackLink>)}</div></section>

    <section className="sitemap-section"><div className="sitemap-section-head"><span>02</span><div><h2>我是五力教練</h2><p>快速切換五個專項，不必先回首頁。</p></div></div><div className="sitemap-link-grid coach-map">{coachPages.map((item) => <TrackLink key={item.pageId} href={`/p/${compactPageId(item.pageId)}`} eventName="sitemap_click" eventData={{ group: "coach", destination: item.title }}><span>{item.icon}</span><div><h3>{item.title}</h3><p>查看使命、流程、案例與轉介條件</p></div><strong>→</strong></TrackLink>)}</div></section>

    <section className="sitemap-section"><div className="sitemap-section-head"><span>03</span><div><h2>我是總教練</h2><p>掌握分派、陪跑節奏與階段回顧。</p></div></div><div className="sitemap-link-grid operations-map">{operations.map((item) => <TrackLink key={item.title} href={item.href} eventName="sitemap_click" eventData={{ group: "lead_coach", destination: item.title }}><span>{item.icon}</span><div><h3>{item.title}</h3></div><strong>→</strong></TrackLink>)}</div></section>

    <section className="sitemap-foundations"><h2>主要入口</h2><div><a href="https://sanq.ccwu.cc">🏠 團隊首頁</a><a href="/">📖 五力教練學院</a><a href="https://quiz.sanq.ccwu.cc" target="_blank" rel="noopener noreferrer">🎯 五力天賦測驗 ↗</a></div></section>
  </main>;
}
