import type { Metadata } from "next";
import { TrackLink } from "../../components/track-link";

export const metadata: Metadata = { title: "90 天多軌陪跑｜五力教練學院", description: "共同主線、當期主軌與支援軌組成的 90 天多軌陪跑方式。" };

const phases = [
  { days: "Day 1–30", title: "安定與啟動", copy: "完成探索、建立主要窗口與第一個可完成行動。", main: "常見主軌：關係／工具", support: "可體驗：零售或內容" },
  { days: "Day 31–60", title: "建立個人節奏", copy: "依目標選定主軌，讓其他專項只在需要時支援。", main: "主軌：零售／招募／IP 自媒體", support: "支援：關係／工具" },
  { days: "Day 61–90", title: "整合與傳承", copy: "保留有效軌道，完成一次服務、分享或陪伴。", main: "主軌：深化有效能力", support: "支援：成果整理與轉介" },
];

export default function JourneyPage() {
  return <main className="academy-shell multi-journey-shell">
    <header className="multi-journey-hero"><div><p className="eyebrow">90-Day Multi-Track Journey</p><h1>不是五門課一起上，而是一群人適時接力。</h1><p>每位夥伴沿著同一條 90 天主線前進，同一時間只有一個重點主軌，再依卡點加入一至兩個支援軌。</p><div className="hero-actions"><TrackLink className="primary-action" href="/paths" eventName="journey_find_path">先確認我的身分</TrackLink><a className="text-action" href="#rules">查看多軌規則 ↓</a></div></div><figure><img src="/journey-90-days.webp" alt="夥伴在三階段路線上互相接力前進" /></figure></header>

    <section className="track-model" aria-label="多軌陪跑模型"><article><span>共同主線</span><h2>目標與節奏</h2><p>由主要窗口整合 90 天目標、每週行動與階段回顧。</p></article><div className="track-connector">＋</div><article><span>當期主軌</span><h2>現在最重要的一力</h2><p>一位主教練負責當期最重要的能力成長。</p></article><div className="track-connector">＋</div><article><span>支援軌</span><h2>遇到卡點才加入</h2><p>其他教練處理指定問題，完成後退出，不另派一套作業。</p></article></section>

    <section className="multi-phase-section"><div className="section-heading split-heading"><div><p className="eyebrow">三階段安排</p><h2>主軌會變，主線不會斷。</h2></div><p>每 30 天重新檢查一次適配度與負荷，決定保留、加入或退出哪一條軌道。</p></div><div className="multi-phase-grid">{phases.map((phase, index) => <article key={phase.days}><span className="phase-index">0{index + 1}</span><p className="step-days">{phase.days}</p><h3>{phase.title}</h3><p>{phase.copy}</p><dl><div><dt>{phase.main}</dt></div><div><dt>{phase.support}</dt></div></dl></article>)}</div></section>

    <section id="rules" className="journey-rules"><div><p className="eyebrow">不混亂的七條規則</p><h2>多軌，不等於多頭馬車。</h2></div><ol><li><strong>一位主要窗口</strong><span>夥伴只需對接一位整合者。</span></li><li><strong>同時一個主軌</strong><span>當期只設定一個最重要能力。</span></li><li><strong>最多兩個支援軌</strong><span>避免任務與訊息超載。</span></li><li><strong>每週一份行動清單</strong><span>由主要窗口整合，不讓五位教練各派作業。</span></li><li><strong>共用同一份進度</strong><span>所有教練看見相同目標與卡點。</span></li><li><strong>30 天檢查轉軌</strong><span>確認主軌是否仍適合。</span></li><li><strong>推薦人回到關係支持</strong><span>不必自己教完所有專項。</span></li></ol></section>

    <section className="weekly-rhythm"><div><p className="eyebrow">每週節奏</p><h2>一次主會談，必要時才加專項門診。</h2></div><div className="rhythm-flow"><article><span>1</span><h3>回顧</h3><p>看上週承諾、成功與卡點。</p></article><b>→</b><article><span>2</span><h3>判斷</h3><p>確認由主軌處理或借力支援軌。</p></article><b>→</b><article><span>3</span><h3>整合</h3><p>只留下本週一至三個行動。</p></article><b>→</b><article><span>4</span><h3>回報</h3><p>更新同一份進度與責任人。</p></article></div></section>

    <section className="journey-final-cta"><div><p className="eyebrow">開始安排</p><h2>先確認身分，再選擇目前的主軌。</h2></div><TrackLink className="primary-action" href="/paths" eventName="journey_find_path" eventData={{ placement: "bottom" }}>前往身分導覽 →</TrackLink></section>
  </main>;
}
