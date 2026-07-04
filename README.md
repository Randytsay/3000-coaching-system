# SANQ Platform

這個 repo 現在承載三個面向：

- `apps/portal`：`sanq.ccwu.cc` 團隊總入口
- `apps/quiz`：`quiz.sanq.ccwu.cc` 五力教練天賦測驗
- `apps/academy`：`academy.sanq.ccwu.cc` 五力教練學院

目前策略是「保留既有 quiz、另外建 portal 與 academy」，這樣問卷不中斷，後續又能把內容系統完整長出來。

## 本機開發

```bash
npm install
npm run dev:portal
npm run dev:academy
```

`apps/quiz` 是靜態網站與 Vercel Function，不需要透過 Next.js 啟動。

## 建議網域

- `sanq.ccwu.cc`
- `quiz.sanq.ccwu.cc`
- `academy.sanq.ccwu.cc`
- `admin.sanq.ccwu.cc`（後續）

## Notion 內容策略

`academy` 採用「Notion 共編 + 自訂前端樣式」：

- Notion：負責 SOP、FAQ、課程、公告、教練共編
- Academy 前端：負責導覽、品牌字體、色彩、版型、公開頁體驗
- 敏感資料：不放公開 Notion，留在 Sheets / Drive / Admin

## 目前 repo 結構

```bash
.
├── apps
│   ├── academy
│   ├── portal
│   └── quiz
├── package.json
├── package-lock.json
├── turbo.json
└── tsconfig.base.json
```
