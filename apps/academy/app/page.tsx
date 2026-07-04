import { AcademyNotionPage } from "../components/notion-page";
import { NotionConnectionState } from "../components/notion-connection-state";
import {
  getAcademyHomepageData,
  getAcademyRootPageId,
  getPageRecordMap,
  getRendererPageTitle,
} from "../lib/notion";

export const revalidate = 300;

const highlights = [
  "五力是分工架構，不是人格標籤。",
  "問卷只做探索，不直接當成認證。",
  "公開站顯示已審核內容，個資與個案留在內部。",
];

export default async function AcademyHome() {
  const rootPageId = getAcademyRootPageId();

  try {
    const [recordMap, homepage] = await Promise.all([
      getPageRecordMap(rootPageId),
      getAcademyHomepageData(),
    ]);
    const title = getRendererPageTitle(recordMap);
    const publicSops = homepage.sopItems.filter((item) => item.websitePublic);
    const pendingSops = homepage.sopItems.filter((item) => !item.websitePublic);
    const publicResources = homepage.resourceItems.filter((item) => item.websitePublic && !item.containsPersonalData);
    const internalResources = homepage.resourceItems.filter((item) => !item.websitePublic);

    return (
      <main className="academy-shell">
        <section className="academy-hero">
          <div>
            <p className="eyebrow">Academy v1</p>
            <h1>{title}</h1>
            <p className="lede">
              這個版本已經從靜態骨架切換到 Notion 驅動。之後教練團在 Notion 共編、審核通過後，academy 前台就能承接同一份內容。
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

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">首頁導覽</p>
            <h2>先把整體結構看懂，再進入各區細讀。</h2>
          </div>
          <div className="nav-grid">
            {homepage.rootLinks.map((item) => (
              <a key={item.pageId} className="nav-card" href={item.href}>
                <h3>{item.title}</h3>
                <span>進入內容</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Start Here</p>
            <h2>依角色進入，不同身分有不同任務。</h2>
          </div>
          <div className="role-grid">
            {homepage.roles.map((role) => (
              <article key={role.title} className="role-card">
                <h3>{role.title}</h3>
                <p>{role.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">五力分類</p>
            <h2>每一力都有自己的定位與陪跑方式。</h2>
          </div>
          <div className="power-grid">
            {homepage.powers.map((power) => (
              <a key={power.pageId} className="power-link-card" href={power.href}>
                <h3>{power.title}</h3>
                <p>{power.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">90 天 SOP</p>
            <h2>公開 SOP 還在建置中，但資料結構已經接上。</h2>
          </div>
          <div className="status-strip">
            <div>
              <strong>{publicSops.length}</strong>
              <span>已公開 SOP</span>
            </div>
            <div>
              <strong>{pendingSops.length}</strong>
              <span>待公開 SOP</span>
            </div>
          </div>
          <div className="sop-grid">
            {(publicSops.length ? publicSops : pendingSops).map((item) => (
              <a key={item.href} className="sop-card" href={item.href}>
                <div className="sop-meta">
                  <span>{item.phase}</span>
                  <span>{item.status}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.powers.join("・") || "共通制度"}</p>
                <small>{item.websitePublic ? "已對站上公開" : "尚未設為網站公開"}</small>
              </a>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">工具與表單</p>
            <h2>資源清單已接上，公開與內部資料會分流。</h2>
          </div>
          <div className="status-strip">
            <div>
              <strong>{publicResources.length}</strong>
              <span>可公開資源</span>
            </div>
            <div>
              <strong>{internalResources.length}</strong>
              <span>內部或待整理</span>
            </div>
          </div>
          <div className="resource-grid">
            {(publicResources.length ? publicResources : homepage.resourceItems.filter((item) => !item.containsPersonalData)).map(
              (item) => (
                <article key={item.href} className="resource-card">
                  <div className="resource-meta">
                    <span>{item.type}</span>
                    <span>{item.status}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.purpose}</p>
                  <div className="resource-actions">
                    <a href={item.href}>查看說明</a>
                    {item.officialUrl ? (
                      <a href={item.officialUrl} target="_blank" rel="noreferrer">
                        前往正式連結
                      </a>
                    ) : null}
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>先把容易混淆的地方說清楚。</h2>
          </div>
          <div className="faq-list">
            {homepage.faq.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
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
