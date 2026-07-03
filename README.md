# 五力陪跑系統 — 找到你的教練天賦

20 題、3-5 分鐘，測出你是哪一種教練：**關係、工具、零售、招募、自媒體**。

## 直接開測
開 `index.html` 即可，或 deploy 到 GitHub Pages / Netlify / Cloudflare Pages 任一靜態主機。

## 部署到 GitHub Pages（推薦）

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)`
4. 幾分鐘後，網址為：
   `https://<user>.github.io/3000-coaching-system/`

OG 圖 meta tag 已預設指向該網址下的 `assets/og-image.webp`。

## 修改 Google Sheets webhook

開啟 `index.html`，搜尋 `GOOGLE_SHEET_WEBHOOK_URL`，貼上你的 Apps Script Web App URL。

接收欄位：

| 欄位 | 型別 | 來源 |
|---|---|---|
| `name` | string | 使用者輸入 |
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
├── assets/
│   ├── og-image.webp              # OG 主用（1200×630 WebP，62KB）
│   ├── og-image.jpg               # OG 備用（JPEG，103KB）
│   ├── og-image@2x.png            # 高解析備份（PNG）
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
