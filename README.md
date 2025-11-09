# YouTube Music Homepage Design (Nuxt 3)

> 使用 Nuxt 3 + Vue 3 + Tailwind CSS 重新打造的 YouTube Music 前端介面

## ✨ 專案特色

- 🎨 **純 Tailwind CSS** - 完全客製化的樣式設計
- 🚀 **Nuxt 3** - 最新的 Vue 框架，支援 SSR 和優化的性能
- 📱 **響應式設計** - 完美適配桌面和移動設備
- 🎵 **音樂播放器** - 完整的播放控制和歌詞顯示
- 💎 **TypeScript** - 完整的類型安全
- 🎭 **動畫效果** - 流暢的過渡和互動動畫

## 🛠️ 技術棧

### 核心框架

- **Nuxt 3** - Vue 3 全端框架
- **Vue 3** - 漸進式 JavaScript 框架
- **TypeScript** - JavaScript 的超集

### UI 和樣式

- **Tailwind CSS v3** - 實用優先的 CSS 框架
- **Lucide Vue Next** - 優雅的圖示庫
- **@nuxt/image** - 圖片優化
- **@nuxt/fonts** - 字體優化

### 狀態管理和工具

- **Pinia** - Vue 狀態管理
- **VueUse** - Vue Composition API 工具集
- **@vueuse/motion** - 動畫庫

## 📦 專案結構

```
youtube-music-nuxt/
├── assets/
│   └── css/
│       └── main.css           # Tailwind 全域樣式
├── components/
│   └── ui/                    # UI 基礎組件
│       ├── Button.vue
│       ├── Input.vue
│       └── Slider.vue
├── composables/
│   └── useMockData.ts         # 假資料
├── pages/
│   ├── index.vue              # 首頁
│   └── player.vue             # 播放器頁面
├── stores/
│   └── player.ts              # 播放器狀態管理
├── types/
│   └── index.ts               # TypeScript 類型定義
├── utils/
│   └── index.ts               # 工具函式
├── nuxt.config.ts             # Nuxt 配置
└── tailwind.config.ts         # Tailwind 配置
```

## 🚀 快速開始

### 安裝依賴

```bash
pnpm install
```

### 啟動開發伺服器

```bash
pnpm dev
```

訪問 `http://localhost:3000` 查看專案

### 建置生產版本

```bash
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
