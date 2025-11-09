# YouTube IFrame API 整合完成 ✅

## 📦 已完成的實作

### 1. 安裝型別定義

- ✅ 已安裝 `@types/youtube` (v0.1.2)
- 提供完整的 TypeScript 型別支援

### 2. 核心檔案結構

#### 📁 composables/useYouTubePlayer.ts

負責 YouTube IFrame API 的載入與播放器管理：

- `useYouTubeAPI()` - 動態載入 YouTube IFrame API script
- `useYouTubePlayer()` - 提供完整的播放器控制方法
  - `initPlayer()` - 初始化播放器
  - `play()` / `pause()` / `stop()` - 播放控制
  - `setVolume()` / `getVolume()` - 音量控制
  - `seekTo()` - 時間跳轉
  - `loadVideoById()` - 載入新影片

#### 📁 components/YouTubePlayer.vue

YouTube 播放器元件：

- 使用 `<ClientOnly>` 包裝，確保 SSR 相容
- 自動同步播放狀態到 Pinia store
- 監聽 store 變化並控制播放器
- 定時更新播放進度
- 影片結束自動播放下一首

#### 📁 types/index.ts

更新的型別定義：

- `Song` interface 加入 `youtubeId` 欄位
- `PlaylistState` 加入 `youtubePlayer` 引用

#### 📁 stores/player.ts

增強的播放器 store：

- 加入 `youtubePlayer` 狀態
- 修正 `nextSong()` 和 `previousSong()` 的型別安全

#### 📁 composables/useMockData.ts

測試資料已更新：

- ✅ 米津玄師 - Lemon (youtubeId: `SX_ViT4Ra7k`)
- ✅ RADWIMPS - Sparkle (youtubeId: `a2GujJZfXpg`)
- ✅ aimyon - Marigold (youtubeId: `0xSiBpUdW4E`)
- ✅ TK - Unravel (youtubeId: `QKXi08chD2E`)
- ✅ Official HIGE DANdism - Pretender (youtubeId: `TQ8WlA2GXbk`)
- ✅ 米津玄師 - LOSER (youtubeId: `Dx_fKPBPYUI`)

#### 📁 pages/player.vue

播放器頁面整合：

- 嵌入 `YouTubePlayer` 元件
- 綁定播放器事件
- Fallback 顯示靜態封面（當沒有 youtubeId 時）

---

## 🎯 功能特色

### ✨ 完整的播放器控制

- ▶️ 播放/暫停
- ⏭️ 上一首/下一首
- 🔊 音量控制（0-100%）
- 📊 進度條拖動
- 🔄 自動播放下一首

### 🔄 狀態同步

- Store ↔️ YouTube Player 雙向綁定
- 播放狀態自動同步
- 音量變化即時反映
- 進度更新每 500ms

### 🖥️ SSR 相容

- 使用 `ClientOnly` 確保只在客戶端載入
- 避免 SSR 編譯錯誤
- 提供載入中的 fallback UI

### 🎨 優雅的 Fallback

- 沒有 YouTube ID 時顯示封面圖
- 載入失敗時的錯誤處理
- 平滑的過渡效果

---

## 🚀 如何使用

### 啟動開發伺服器

```bash
pnpm dev
```

### 測試流程

1. 開啟 http://localhost:3000/
2. 點擊任一歌曲卡片
3. 自動跳轉到播放器頁面
4. YouTube 影片開始載入並播放
5. 測試播放/暫停、音量、進度條、上下首等功能

---

## 📝 程式碼範例

### 在其他元件中使用 YouTubePlayer

```vue
<template>
  <YouTubePlayer
    :video-id="'SX_ViT4Ra7k'"
    :autoplay="true"
    @ready="handleReady"
    @state-change="handleStateChange"
    @time-update="handleTimeUpdate"
  />
</template>

<script setup>
const handleReady = player => {
  console.log('Player ready:', player)
}

const handleStateChange = state => {
  // YT.PlayerState.PLAYING = 1
  // YT.PlayerState.PAUSED = 2
  // YT.PlayerState.ENDED = 0
  console.log('State:', state)
}

const handleTimeUpdate = (currentTime, duration) => {
  console.log(`${currentTime}s / ${duration}s`)
}
</script>
```

### 使用 useYouTubePlayer Composable

```vue
<script setup>
const { initPlayer, play, pause, setVolume, seekTo } = useYouTubePlayer()

onMounted(async () => {
  const player = await initPlayer('player-id', 'VIDEO_ID', {
    onReady: event => {
      console.log('Ready!', event)
    },
  })
})
</script>
```

---

## 🔧 技術細節

### YouTube IFrame API 載入策略

- 全域單例模式，只載入一次
- Promise-based 載入追蹤
- 避免重複載入

### 事件驅動架構

```
YouTube Player Events
    ↓
YouTubePlayer Component
    ↓
Pinia Store (playerStore)
    ↓
UI Components (Controls, Progress Bar)
```

### 型別安全

- 完整的 TypeScript 型別定義
- YouTube IFrame API 型別支援
- 編譯時期錯誤檢查

---

## ⚠️ 注意事項

### ESLint 警告

某些檔案可能出現 ESLint 警告（如參數型別推斷），這不影響實際運作。可在未來透過 ESLint 設定調整。

### YouTube API 限制

- 需要網際網路連線
- 受 YouTube 服務條款約束
- 部分影片可能無法嵌入（版權限制）

### 瀏覽器相容性

- 現代瀏覽器完全支援
- 需要 JavaScript 啟用
- 建議使用 Chrome/Firefox/Edge

---

## 📚 參考資源

- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [@types/youtube Documentation](https://www.npmjs.com/package/@types/youtube)
- [Nuxt 3 Composables](https://nuxt.com/docs/guide/directory-structure/composables)
- [Pinia Store](https://pinia.vuejs.org/)

---

## ✅ 完成檢查清單

- [x] 安裝 @types/youtube
- [x] 建立 useYouTubePlayer composable
- [x] 建立 YouTubePlayer 元件
- [x] 更新 Song 型別
- [x] 增強 player store
- [x] 整合到 player.vue 頁面
- [x] 更新 mock 資料
- [x] 啟動開發伺服器測試

---

## 🎉 下一步建議

### 功能增強

- [ ] 加入播放清單管理
- [ ] 支援歌詞同步顯示
- [ ] 加入播放歷史記錄
- [ ] 實作隨機播放和循環播放
- [ ] 加入鍵盤快捷鍵（空白鍵播放/暫停等）

### 效能優化

- [ ] 預載下一首影片
- [ ] 加入影片品質選擇
- [ ] 優化載入動畫

### 使用者體驗

- [ ] 加入全螢幕模式
- [ ] 支援子母畫面 (PiP)
- [ ] 加入等化器視覺效果
- [ ] 深色/淺色主題切換

---

**實作完成時間**: 2025-10-17
**開發環境**: Nuxt 4.1.3 + Vue 3.5.22 + Pinia + TypeScript
