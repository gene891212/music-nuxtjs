# 認證系統實作完成

## ✅ 已完成的功能

### 1. **核心 Composable**

- ✅ `composables/useAuth.ts` - 完整的認證功能
  - 註冊 (`signUp`)
  - 登入 (`signIn`)
  - OAuth 登入 (`signInWithOAuth`)
  - 登出 (`signOut`)
  - 密碼重置 (`resetPassword`)
  - 更新密碼 (`updatePassword`)
  - 更新個人資料 (`updateProfile`)

### 2. **Middleware 保護**

- ✅ `middleware/auth.ts` - 保護需要登入的頁面
- ✅ `middleware/guest.ts` - 只允許未登入用戶訪問

### 3. **認證頁面**

- ✅ `pages/auth/login.vue` - 登入頁面
- ✅ `pages/auth/register.vue` - 註冊頁面
- ✅ `pages/auth/forgot-password.vue` - 忘記密碼頁面

### 4. **UI 組件**

- ✅ `components/layout/Header.vue` - 導航欄，顯示用戶狀態和登出功能

### 5. **測試頁面**

- ✅ `pages/upload/index.vue` - 受保護的上傳頁面（需要登入）

---

## 🚀 使用方法

### **開始前的設定**

1. **確保 Supabase 已正確設定**
   - 檢查 `.env` 檔案中的 `SUPABASE_URL` 和 `SUPABASE_KEY`
   - 如果還沒設定，請參考 `docs/SUPABASE_SETUP.md`

2. **在 Supabase Dashboard 中啟用 Email 認證**
   - 前往 [Supabase Dashboard](https://app.supabase.com)
   - 選擇你的專案
   - 進入 **Authentication** → **Providers**
   - 確保 **Email** 已啟用
   - 設定 **Email Templates**（可選）

3. **設定 Site URL（重要）**
   - 在 Supabase Dashboard 中
   - 進入 **Authentication** → **URL Configuration**
   - 設定 **Site URL** 為 `http://localhost:3000`（開發環境）
   - 生產環境時改為你的實際網址

---

## 📝 測試流程

### **步驟 1：啟動開發伺服器**

```powershell
pnpm dev
```

### **步驟 2：測試註冊功能**

1. 開啟瀏覽器，前往 `http://localhost:3000`
2. 點擊右上角的「註冊」按鈕
3. 填寫表單：
   - 顯示名稱：測試用戶
   - Email：test@example.com
   - 密碼：test123456
   - 確認密碼：test123456
   - 勾選服務條款
4. 點擊「註冊」

**預期結果：**

- 顯示「註冊成功！請檢查您的 Email 以驗證帳戶」
- 2 秒後自動跳轉到登入頁面

### **步驟 3：驗證 Email（如果啟用）**

如果 Supabase 設定為需要驗證 Email：

1. 檢查你的信箱（或 Supabase Dashboard 的 Authentication 頁面）
2. 點擊驗證連結
3. 完成驗證

### **步驟 4：測試登入功能**

1. 在登入頁面輸入剛才註冊的 Email 和密碼
2. 點擊「登入」

**預期結果：**

- 顯示「登入成功！正在跳轉...」
- 跳轉到首頁
- 右上角顯示用戶頭像和名稱

### **步驟 5：測試受保護的頁面**

1. 點擊 Header 中的「上傳歌曲」連結
2. 或直接前往 `http://localhost:3000/upload`

**預期結果：**

- 可以正常訪問頁面
- 顯示當前登入的 Email 和 User ID

### **步驟 6：測試登出功能**

1. 點擊右上角的用戶頭像
2. 點擊「登出」

**預期結果：**

- 成功登出
- 跳轉到首頁
- 右上角顯示「登入」和「註冊」按鈕

### **步驟 7：測試 Middleware 保護**

1. 登出後，直接前往 `http://localhost:3000/upload`

**預期結果：**

- 自動重定向到登入頁面
- URL 包含 `redirect` 參數：`/auth/login?redirect=/upload`
- 登入後會自動返回 `/upload` 頁面

### **步驟 8：測試忘記密碼**

1. 前往登入頁面
2. 點擊「忘記密碼？」
3. 輸入註冊的 Email
4. 點擊「發送重設連結」

**預期結果：**

- 顯示「重設連結已發送至您的 Email」
- 檢查信箱會收到重設密碼的連結

---

## 🎨 UI 特色

- ✅ 響應式設計（支援手機、平板、電腦）
- ✅ 深色模式支援
- ✅ 載入狀態指示
- ✅ 友善的錯誤訊息
- ✅ 成功提示
- ✅ 表單驗證
- ✅ 動畫效果

---

## 🔧 在其他頁面中使用

### **保護頁面**

在任何頁面中加入 auth middleware：

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth', // 需要登入
})
</script>
```

### **取得當前用戶資訊**

```vue
<script setup lang="ts">
const { user, isAuthenticated, userEmail, userId } = useAuth()

// user.value - 完整的用戶物件
// isAuthenticated.value - 是否已登入（布林值）
// userEmail.value - 用戶 Email
// userId.value - 用戶 ID
</script>
```

### **在組件中使用**

```vue
<template>
  <div v-if="isAuthenticated">
    <p>歡迎回來，{{ userEmail }}！</p>
    <button @click="handleLogout">登出</button>
  </div>
  <div v-else>
    <NuxtLink to="/auth/login">請先登入</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, userEmail, signOut } = useAuth()

const handleLogout = async () => {
  await signOut()
}
</script>
```

---

## 🐛 常見問題

### **問題 1：註冊後無法登入**

**原因：** Supabase 設定為需要驗證 Email
**解決方法：**

1. 前往 Supabase Dashboard
2. **Authentication** → **Settings**
3. 關閉 **Enable email confirmations**

### **問題 2：收不到驗證郵件**

**解決方法：**

1. 檢查垃圾郵件資料夾
2. 在 Supabase Dashboard 中查看 **Authentication** → **Users**
3. 手動點擊用戶旁的 **Confirm email**

### **問題 3：重定向錯誤**

**原因：** Site URL 設定不正確
**解決方法：**

1. 前往 Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. 確保 **Site URL** 設定為 `http://localhost:3000`

### **問題 4：ESLint 錯誤**

看到 `'useAuth' is not defined` 的錯誤是正常的，Nuxt 3 會自動導入 composables，實際運行時不會有問題。

---

## 📚 下一步

認證系統已完成！現在可以：

1. ✅ **測試所有認證功能**
2. ⏳ **開始實作上傳功能**
   - 建立歌曲上傳表單
   - 整合 YouTube API
   - 歌詞編輯器
   - 權限控制

3. ⏳ **擴充資料庫結構**
   - 在 `songs` 表中加入 `created_by` 欄位
   - 設定 Row Level Security (RLS)

---

## 🎯 準備好了嗎？

先測試認證功能，確認一切運作正常後，我們就可以繼續實作上傳功能了！

有任何問題或需要調整的地方，隨時告訴我！ 😊
