import { AcademyNotionPage } from "../components/notion-page";
import { NotionConnectionState } from "../components/notion-connection-state";
import { getAcademyRootPageId, getPageRecordMap, getRendererPageTitle } from "../lib/notion";

export const revalidate = 300;

const highlights = [
  "五力是分工架構，不是人格標籤。",
  "問卷只做探索，不直接當成認證。",
  "公開站顯示已審核內容，個資與個案留在內部。",
];

export default async function AcademyHome() {
  const rootPageId = getAcademyRootPageId();

  try {
    const recordMap = await getPageRecordMap(rootPageId);
    const title = getRendererPageTitle(recordMap);

    return (
      <main className="academy-shell">
        <section className="academy-hero">
          <div>
            <p className="eyebrow">Academy v1</p>
            <h1>{title}</h1>
            <p className="lede">
              這個版本已經從靜態骨架切到 Notion 驅動。之後教練團在 Notion 共編、審核通過後，academy 前台就能承接同一份內容。
            </p>
          </div>
          <aside className="hero-note">
            <span>內容流程</span>
            <strong>Notion 共編 → Academy 公開</strong>
            <p>你現在看到的是品牌化包裝後的前台，不是原生 Notion 介面。</p>
          </aside>
        </section>

        <section className="highlight-row">
          {highlights.map((item) => (
            <article key={item} className="highlight-card">
              <span className="highlight-mark" />
              <p>{item}</p>
            </article>
          ))}
        </section>

        <AcademyNotionPage pageId={rootPageId} recordMap={recordMap} />
      </main>
    );
  } catch {
    return (
      <main className="academy-shell">
        <section className="academy-hero">
          <div>
            <p className="eyebrow">Academy v1</p>
            <h1>五力教練學院</h1>
            <p className="lede">
              網站端已經準備好接 Notion，現在差最後一段公開權限與 page ID 連接。
            </p>
          </div>
          <aside className="hero-note">
            <span>接線狀態</span>
            <strong>前端完成，內容待公開</strong>
            <p>這樣做的好處是，不會因為 Notion 尚未發布就讓整個 academy 壞掉。</p>
          </aside>
        </section>

        <NotionConnectionState pageId={rootPageId} />
      </main>
    );
  }
}
