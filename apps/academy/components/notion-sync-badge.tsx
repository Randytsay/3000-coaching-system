export function NotionSyncBadge({ lastEdited }: { lastEdited?: number | string | null }) {
  let dateLabel = "";
  if (lastEdited) {
    const date = new Date(typeof lastEdited === "number" && lastEdited < 10_000_000_000 ? lastEdited * 1000 : lastEdited);
    if (!Number.isNaN(date.getTime())) {
      dateLabel = new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
    }
  }

  return <span className="notion-sync-badge" title="這部分內容由教練團在 Notion 維護，網站會定期同步更新。"><span className="notion-mark" aria-hidden="true">N</span><span>內容由 Notion 同步{dateLabel ? ` · ${dateLabel} 更新` : ""}</span></span>;
}
