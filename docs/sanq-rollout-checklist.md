# SANQ 上線清單

## 我已完成

- 把單一問卷 repo 改成 monorepo
- 建立 `apps/portal`
- 保留原問卷於 `apps/quiz`
- 建立 `apps/academy`
- 建立 root workspace / turbo / TypeScript 設定
- 更新 quiz 公開網址目標為 `quiz.sanq.ccwu.cc`
- academy 已接上 Notion renderer 與內部頁面路由
- academy 在 Notion 未公開時，會顯示接線狀態而不會壞站

## 你要在平台後台做的事

1. Cloudflare DNS
   - 建立 `sanq.ccwu.cc`
   - 建立 `quiz.sanq.ccwu.cc`
   - 建立 `academy.sanq.ccwu.cc`

2. Vercel 專案
   - `portal` 專案 root directory 指到 `apps/portal`
   - `quiz` 專案 root directory 指到 `apps/quiz`
   - `academy` 專案 root directory 指到 `apps/academy`

3. LINE Developers
   - 把 LIFF endpoint 改成 `https://quiz.sanq.ccwu.cc/`

4. Notion
   - 把 academy 根頁發布為公開可檢視
   - 在 `academy` 專案設定 `NOTION_PAGE_ID`
   - 若之後改用私有 API，再補 `NOTION_TOKEN`

## 下一輪建議

1. 做 academy 導覽、頁面模板、文章列表、FAQ
2. 決定哪些 Notion 子頁要公開上站
3. 補 admin / internal 專案處理問卷與教練營運資料
