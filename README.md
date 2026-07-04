# 五力陪跑系統 — 找到你的教練天賦

20 題、3-5 分鐘，測出你是哪一種教練：**關係、工具、零售、招募、自媒體**。

正式網站：<https://coach.randy88.ccwu.cc/>

## 功能

- 單主修、10 種雙主修專屬分析與可發展方向
- 五力雷達圖與 1080×1350 PNG 成果卡
- LIFF 自動帶入 LINE 顯示名稱
- LINE 好友／群組選擇器、手機系統分享與圖片下載
- LINE 內建瀏覽器長按儲存及外部瀏覽器備援
- Google Sheets 測驗資料收集

## 直接開測
純測驗可直接開啟 `index.html`；完整的成果圖與分享功能需部署到 Vercel。

成果圖使用 Vercel Function 產生，因此完整功能請以 Vercel 部署。開發環境：

```bash
npm install
vercel dev
```

## 部署

GitHub `main` 分支已連接 Vercel，推送後會自動部署至正式網域。OG 圖與 LIFF Endpoint 均使用 `https://coach.randy88.ccwu.cc/`。

## 修改 Google Sheets webhook

開啟 `index.html`，搜尋 `GOOGLE_SHEET_WEBHOOK_URL`，貼上你的 Apps Script Web App URL。

接收欄位：

| 欄位 | 型別 | 來源 |
|---|---|---|
| `name` | string | 使用者輸入 |
| `lineDisplayName` | string | LIFF profile 顯示名稱（若有授權） |
| `nameSource` | string | `LINE profile` 或 `manual` |
| `timestamp` | ISO8601 | 送出時間 |
| `primary` | string | 主修天賦中文名 |
| `secondary` | string | 副修天賦中文名 |
| `scoreA` | int | 關係分數 |
| `scoreB` | int | 工具分數 |
| `scoreC` | int | 零售分數 |
| `scoreD` | int | 招募分數 |
| `scoreE` | int | 自媒體分數 |
| `aiAdvisorInterest` | string | 彩蛋題答案 |

## 檔案結構

```
.
├── index.html                     # 主檔（含 20 題、五力、結果、彩蛋題）
├── privacy.html                   # 隱私權說明
├── api/result-card.js             # Vercel PNG 成果圖 API
├── package.json                   # 成果圖函式依賴
├── assets/
│   ├── fonts/                     # 成果圖繁體中文字型與授權
│   ├── og-image.webp              # OG 主用（1200×630 WebP，62KB）
│   ├── og-image.jpg               # OG 備用（JPEG，103KB）
│   ├── og-square.webp             # IG/Threads 方形（1080×1080）
│   ├── favicon.ico                # 瀏覽器 tab
│   ├── favicon-{16,32,64}.png     # 各尺寸 favicon
│   ├── icon-{192,512}.png         # PWA
│   ├── apple-touch-icon.png       # iOS 主畫面
│   ├── maskable-icon-512.png      # Android PWA
│   └── manifest.json              # PWA 設定
└── README.md
```

## 自訂

- **新增類型**（教練類型數量）：編輯 `questions`、`types`、`optKeys`、`badge-row`、CSS `:root` 五色變數
- **改題目**：搜尋 `const questions = [`，每題 5 個選項都映射到 `A/B/C/D/E` 之一
- **改結果描述**：編輯 `const types = {}` 內各類型的 `desc`
- **背景漸層**：編輯 CSS `body` 的 `background`
- **OG/Favicon**：直接替換 `assets/` 內同名檔案
