import { getPublicNotionUrl } from "../lib/notion";

export function NotionConnectionState({ pageId }: { pageId: string }) {
  return (
    <section className="connection-card">
      <p className="eyebrow">Notion Connection</p>
      <h2>Academy 已接上 Notion 結構，現在差公開頁面。</h2>
      <p>
        目前網站端已經準備好讀取 Notion page，但你現在的學院根頁還是私人頁面，所以前台不能直接抓內容。
      </p>
      <ol>
        <li>把學院首頁 page 發布為公開可檢視。</li>
        <li>在 Vercel 的 `academy` 專案設定 `NOTION_PAGE_ID`。</li>
        <li>重新部署後，前台就會開始顯示真正的 Notion 內容。</li>
      </ol>
      <a className="publish-link" href={getPublicNotionUrl(pageId)} target="_blank" rel="noreferrer">
        查看目前目標頁面
      </a>
    </section>
  );
}
