import type { Metadata } from "next";
import { getTeamTalentDashboard } from "../../lib/team-talents";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "團隊天賦分佈｜五力教練學院",
  description: "內部使用的五力教練團隊天賦分佈與團隊特色解析。",
  robots: { index: false, follow: false },
};

function Meter({ value, max }: { value: number; max: number }) {
  const width = max ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return <span className="talent-meter" aria-hidden="true"><span style={{ width: `${width}%` }} /></span>;
}

export default async function TeamTalentsPage() {
  const dashboard = await getTeamTalentDashboard();
  const maxPrimary = Math.max(1, ...dashboard.primaryDistribution.map((item) => item.count));
  const maxSecondary = Math.max(1, ...dashboard.secondaryDistribution.map((item) => item.count));
  const maxAverage = Math.max(1, ...dashboard.scoreAverages.map((item) => item.average));

  return (
    <main className="academy-shell talent-dashboard">
      <section className="talent-hero">
        <div>
          <p className="eyebrow">Internal Dashboard</p>
          <h1>團隊天賦分佈</h1>
          <p className="lede">這個頁面只給知道網址的人查看；資料會依姓名去重，保留每位夥伴最新一次填寫的問卷結果。</p>
        </div>
        <div className="talent-stats">
          <article><strong>{dashboard.people.length}</strong><span>去重後人數</span></article>
          <article><strong>{dashboard.totalResponses}</strong><span>原始回覆</span></article>
          <article><strong>{dashboard.duplicateCount}</strong><span>重複填寫已排除</span></article>
          <article><strong>{dashboard.latestUpdate || "尚無"}</strong><span>最新填寫</span></article>
        </div>
      </section>

      <section className="talent-analysis">
        <div className="analysis-main">
          <p className="eyebrow">{dashboard.analysis.source === "llm" ? "LLM Analysis" : "Rule-based Preview"}</p>
          <h2>{dashboard.analysis.title}</h2>
          <p>{dashboard.analysis.summary}</p>
        </div>
        <div className="analysis-columns">
          <article>
            <h3>團隊優勢</h3>
            <ul>{dashboard.analysis.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <h3>可能盲點</h3>
            <ul>{dashboard.analysis.blindSpots.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <h3>下一步建議</h3>
            <ul>{dashboard.analysis.suggestions.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
        {dashboard.analysis.setupMissing.length ? (
          <div className="setup-note">
            <strong>尚未啟用正式 LLM 自動解析</strong>
            <span>請在 Vercel 設定 {dashboard.analysis.setupMissing.join("、")}。設定後此區會自動改由 LLM 產生。</span>
          </div>
        ) : null}
      </section>

      <section className="talent-grid">
        <article className="talent-panel">
          <div className="panel-title"><p className="eyebrow">Primary</p><h2>主修分佈</h2></div>
          <div className="distribution-list">
            {dashboard.primaryDistribution.map((item) => (
              <div key={item.talent} className="distribution-item">
                <div><strong>{item.talent}</strong><span>{item.count} 位</span></div>
                <Meter value={item.count} max={maxPrimary} />
                <p>{item.names.join("、")}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="talent-panel">
          <div className="panel-title"><p className="eyebrow">Secondary</p><h2>副修分佈</h2></div>
          <div className="distribution-list">
            {dashboard.secondaryDistribution.map((item) => (
              <div key={item.talent} className="distribution-item">
                <div><strong>{item.talent}</strong><span>{item.count} 位</span></div>
                <Meter value={item.count} max={maxSecondary} />
                <p>{item.names.join("、")}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="talent-grid">
        <article className="talent-panel">
          <div className="panel-title"><p className="eyebrow">Scores</p><h2>五力平均</h2></div>
          <div className="score-list">
            {dashboard.scoreAverages.map((item) => (
              <div key={item.label} className="score-item">
                <div><strong>{item.label}</strong><span>平均 {item.average} / 最高 {item.max}</span></div>
                <Meter value={item.average} max={maxAverage} />
                {item.names.length ? <p>最高分：{item.names.join("、")}</p> : null}
              </div>
            ))}
          </div>
        </article>

        <article className="talent-panel">
          <div className="panel-title"><p className="eyebrow">AI Readiness</p><h2>AI 意願</h2></div>
          <div className="ai-list">
            {dashboard.aiDistribution.map((item) => (
              <div key={item.answer} className="ai-item">
                <strong>{item.answer}</strong>
                <span>{item.count} 位</span>
                <p>{item.names.join("、")}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="talent-panel people-panel">
        <div className="panel-title"><p className="eyebrow">People</p><h2>最新名單</h2></div>
        <div className="people-table" role="table" aria-label="團隊天賦最新名單">
          <div role="row" className="people-row people-head">
            <span>姓名</span><span>主修</span><span>副修</span><span>五力分數</span><span>AI 意願</span><span>填寫時間</span>
          </div>
          {dashboard.people.map((person) => (
            <div role="row" className="people-row" key={`${person.name}-${person.submittedAt}`}>
              <strong>{person.name}</strong>
              <span>{person.primaryTalent}</span>
              <span>{person.secondaryTalent}</span>
              <span>{Object.entries(person.scores).map(([label, score]) => `${label}${score}`).join(" / ")}</span>
              <span>{person.aiInterest}</span>
              <time dateTime={person.submittedAt}>{person.displayTime}</time>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
