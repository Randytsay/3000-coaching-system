import type { Metadata } from "next";
import { TrackLink } from "../../components/track-link";
import { coachPages, compactPageId } from "../../lib/coach-navigation";

export const metadata: Metadata = { title: "找我的路｜五力教練學院", description: "依一般夥伴、準教練、正式教練與總教練身分找到下一步。" };

const stages = [
  { icon: "🔎", title: "天賦探索", note: "我還不確定適合從哪裡開始", href: "/p/393716701898811caa1fe8b85e655f9f" },
  { icon: "📚", title: "基礎教練課", note: "我想先學會傾聽、提問與界線", href: "/p/39371670189881ea819bd50a5497d574" },
  { icon: "🧩", title: "五力專項訓練", note: "我已找到方向，準備練習專項", href: "/p/393716701898810eae35c657c209a2a2" },
  { icon: "👣", title: "跟班與實習", note: "我準備進入真實情境觀察與實作", href: "/p/393716701898810c882af8fa81e75609" },
  { icon: "🏅", title: "評量與認證", note: "我想確認自己是否能穩定陪伴別人", href: "/p/39371670189881d0b4eef78a45293865" },
];

export default function PathsPage() {
  return <main className="academy-shell paths-shell">
    <header className="paths-hero"><p className="eyebrow">Choose Your Path</p><h1>不用把全部看完，先找到此刻的你。</h1><p>這裡不是另一份內容總覽，而是一個分流入口。選擇身分後，直接前往現在真正需要的下一步。</p></header>

    <section id="general" className="path-role-panel path-role-general"><div className="path-role-intro"><span>🌼</span><div><p className="eyebrow">一般夥伴</p><h2>我剛加入，或還在了解五力。</h2><p>先認識自己，不需要現在就決定要成為哪一種教練。</p></div></div><div className="path-role-actions"><TrackLink href="https://quiz.sanq.ccwu.cc" target="_blank" rel="noopener noreferrer" eventName="path_action" eventData={{ role: "general", action: "quiz" }}>完成五力測驗 ↗</TrackLink><TrackLink href="/journey" eventName="path_action" eventData={{ role: "general", action: "journey" }}>了解 90 天如何陪跑 →</TrackLink></div></section>

    <section id="trainee" className="path-role-panel"><div className="path-role-intro"><span>🌱</span><div><p className="eyebrow">準教練</p><h2>我正在學習成為教練。</h2><p>找到你目前所在階段，不必從第一頁重新讀起。</p></div></div><div className="path-stage-list">{stages.map((stage, index) => <TrackLink key={stage.title} href={stage.href} eventName="path_stage_open" eventData={{ stage: stage.title }}><span>{stage.icon}</span><small>階段 {index + 1}</small><h3>{stage.title}</h3><p>{stage.note}</p><strong>進入這個階段 →</strong></TrackLink>)}</div></section>

    <section id="coaches" className="path-role-panel"><div className="path-role-intro"><span>🌳</span><div><p className="eyebrow">正式教練</p><h2>我要執行陪跑或借力其他專項。</h2><p>先進入自己的主修頁；遇到跨域卡點，再快速切換到支援教練。</p></div></div><div className="path-coach-list">{coachPages.map((coach) => <TrackLink key={coach.pageId} href={`/p/${compactPageId(coach.pageId)}`} eventName="path_coach_open" eventData={{ coach: coach.title }}><span>{coach.icon}</span><strong>{coach.title}</strong><small>查看流程與轉介條件 →</small></TrackLink>)}</div></section>

    <section id="lead" className="path-role-panel path-role-lead"><div className="path-role-intro"><span>🧭</span><div><p className="eyebrow">總教練</p><h2>我要掌握全局、媒合資源與處理卡關。</h2><p>總教練不必教完五力，重點是讓主軌、支援軌與推薦人順利接力。</p></div></div><div className="path-role-actions"><TrackLink href="/p/39371670189881f99fc6c5a30d5632b4" eventName="path_lead_action" eventData={{ action: "assignment" }}>個案啟動與分派 →</TrackLink><TrackLink href="/p/3937167018988179be38dbb2c5da5a50" eventName="path_lead_action" eventData={{ action: "weekly" }}>每週陪跑會談 →</TrackLink><TrackLink href="/p/393716701898814080e2e3834090f29b" eventName="path_lead_action" eventData={{ action: "review" }}>30／60／90 日回顧 →</TrackLink></div></section>
  </main>;
}
