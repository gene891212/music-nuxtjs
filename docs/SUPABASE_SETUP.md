# Supabase 設定完成指南

## ✅ 已完成的設定

1. **型別檔案已就位**: `types/database.types.ts`
2. **Nuxt 配置已更新**: 加入 `@nuxtjs/supabase` 模組，設定為 SPA 模式
3. **環境變數範本已建立**: `.env.example`
4. **資料庫操作 Composable**: `composables/useDatabase.ts`

---

## 🚀 下一步：設定你的 Supabase 金鑰

### 1. 建立 `.env` 檔案

在專案根目錄複製 `.env.example` 並重新命名為 `.env`：

```bash
# PowerShell
Copy-Item .env.example .env
```

### 2. 填入你的 Supabase 憑證

開啟 `.env` 檔案，填入你的實際金鑰：

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
```

**在哪裡找到這些金鑰？**
1. 前往 [Supabase Dashboard](https://app.supabase.com)
2. 選擇你的專案
3. 點擊左側選單的 **Settings** → **API**
4. 複製 **Project URL** 和 **anon/public key**

---

## 📖 使用範例

### 在任何 Vue 組件或頁面中使用：

```vue
<script setup lang="ts">
// 使用 Supabase client（自動注入）
const supabase = useSupabaseClient()

// 使用我們建立的 database composable
const { getSongs, getSongById } = useDatabase()

// 獲取所有歌曲
const songs = ref([])
const loadSongs = async () => {
  songs.value = await getSongs()
}

// 獲取特定歌曲
const song = ref(null)
const loadSong = async (id: number) => {
  song.value = await getSongById(id)
}

// 頁面載入時執行
onMounted(() => {
  loadSongs()
})
</script>

<template>
  <div>
    <h1>歌曲列表</h1>
    <div v-for="song in songs" :key="song.song_id">
      <h2>{{ song.artist }}</h2>
      <p>{{ song.album_title }}</p>
    </div>
  </div>
</template>
```

---

## 🔄 將來要改成 SSR？

非常簡單！只需在 `nuxt.config.ts` 中：

```typescript
export default defineNuxtConfig({
  // 將 ssr: false 改成 ssr: true 或直接刪除此行
  ssr: true,
  
  // 其他設定保持不變
  // 你的程式碼完全不用改！
})
```

---

## 📚 更多資源

- [Nuxt Supabase 模組文件](https://supabase.nuxtjs.org/)
- [Supabase JavaScript 客戶端文件](https://supabase.com/docs/reference/javascript/introduction)
- [你的資料庫結構文件](./docs/SUPABASE_SETUP.md)

---

## 🛠️ 可用的 Composables

- `useSupabaseClient()` - 取得 Supabase 客戶端實例
- `useSupabaseUser()` - 取得當前登入的使用者（如需身份驗證）
- `useDatabase()` - 我們建立的資料庫操作方法

---

**現在你可以開始使用 Supabase 了！** 🎉
