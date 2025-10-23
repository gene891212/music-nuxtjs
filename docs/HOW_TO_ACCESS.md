# 🚀 如何訪問和測試認證系統

## 📍 訪問方式

### 1. **確保開發伺服器正在運行**

如果還沒啟動，在終端機執行：
```powershell
pnpm dev
```

等待看到類似這樣的訊息：
```
✔ Nuxt DevTools is enabled
✔ Vite client warmed up
✔ Vite server warmed up

Nuxt 4.1.3 with Nitro 2.10.4
  ➜ Local:    http://localhost:3000/
  ➜ Network:  use --host to expose
```

### 2. **開啟瀏覽器訪問以下頁面**

#### 📄 主要頁面
- **首頁**: http://localhost:3000/
- **登入頁面**: http://localhost:3000/auth/login
- **註冊頁面**: http://localhost:3000/auth/register
- **忘記密碼**: http://localhost:3000/auth/forgot-password
- **上傳頁面（需登入）**: http://localhost:3000/upload

---

## ✅ 測試流程

### **第一步：註冊新帳號**

1. 前往 http://localhost:3000/auth/register
2. 填寫表單：
   - 顯示名稱：`測試用戶`
   - Email：`test@example.com`
   - 密碼：`test123456`
   - 確認密碼：`test123456`
   - ✅ 勾選同意服務條款
3. 點擊「註冊」按鈕

**預期結果：**
- ✅ 顯示綠色成功訊息
- ✅ 2 秒後自動跳轉到登入頁面

### **第二步：登入**

1. 在登入頁面（http://localhost:3000/auth/login）
2. 輸入剛才註冊的資訊：
   - Email：`test@example.com`
   - 密碼：`test123456`
3. 點擊「登入」按鈕

**預期結果：**
- ✅ 顯示「登入成功！」
- ✅ 跳轉到首頁
- ✅ 右上角顯示用戶頭像和名稱（顯示為「測試用戶」或「test」）
- ✅ Header 出現「上傳歌曲」連結

### **第三步：測試受保護的頁面**

1. 點擊 Header 中的「上傳歌曲」
2. 或直接前往 http://localhost:3000/upload

**預期結果：**
- ✅ 可以正常訪問頁面
- ✅ 顯示「歡迎來到上傳頁面！」
- ✅ 顯示你的 Email 和 User ID

### **第四步：測試登出**

1. 點擊右上角的用戶頭像
2. 在下拉選單中點擊「登出」

**預期結果：**
- ✅ 成功登出
- ✅ 跳轉到首頁
- ✅ 右上角顯示「登入」和「註冊」按鈕

### **第五步：測試 Middleware 保護**

1. **在登出狀態下**，直接訪問 http://localhost:3000/upload

**預期結果：**
- ✅ 自動重定向到登入頁面
- ✅ URL 變成：`http://localhost:3000/auth/login?redirect=/upload`
- ✅ 登入後會自動返回 `/upload` 頁面

---

## 🐛 如果遇到問題

### **問題 1：無法註冊或登入**

**檢查事項：**
1. 確認 `.env` 檔案存在且包含：
   ```env
   SUPABASE_URL=你的_supabase_url
   SUPABASE_KEY=你的_supabase_key
   ```

2. 前往 [Supabase Dashboard](https://app.supabase.com)
   - 檢查專案是否正常運行
   - 進入 **Authentication** → **Providers**
   - 確保 **Email** 已啟用

3. 檢查 **Authentication** → **Settings**
   - 如果想快速測試，可以暫時關閉 **Enable email confirmations**

### **問題 2：註冊後無法登入**

**原因：** Supabase 可能要求驗證 Email

**解決方法：**
1. 前往 Supabase Dashboard
2. **Authentication** → **Users**
3. 找到你的測試帳號
4. 點擊右側的「...」→ **Confirm email**

或者：
1. **Authentication** → **Settings**
2. 關閉 **Enable email confirmations**

### **問題 3：頁面顯示錯誤**

1. 檢查終端機的錯誤訊息
2. 按 `Ctrl + C` 停止伺服器
3. 重新執行 `pnpm dev`

### **問題 4：ESLint 錯誤**

看到 `'useAuth' is not defined` 是正常的，不會影響運行。
Nuxt 3 會自動導入 composables。

---

## 🎯 快速測試指令

在瀏覽器中依序訪問：

1. **註冊**: http://localhost:3000/auth/register
2. **登入**: http://localhost:3000/auth/login
3. **上傳頁面**: http://localhost:3000/upload
4. **首頁**: http://localhost:3000/

---

## 📱 在手機上測試

如果想在手機上測試響應式設計：

1. 確保電腦和手機在同一個 Wi-Fi 網路
2. 停止當前的伺服器（`Ctrl + C`）
3. 重新啟動並加上 `--host`：
   ```powershell
   pnpm dev --host
   ```
4. 終端機會顯示 Network URL，例如：`http://192.168.1.100:3000/`
5. 在手機瀏覽器輸入該網址

---

## ✨ 功能特色

當你完成測試後，你會看到：

- ✅ 美觀的漸層背景
- ✅ 深色模式支援（跟隨系統設定）
- ✅ 流暢的動畫效果
- ✅ 響應式設計
- ✅ 載入狀態指示
- ✅ 友善的錯誤訊息
- ✅ 用戶下拉選單
- ✅ 自動重定向保護

祝測試順利！🎉
