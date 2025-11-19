/**
 * 訪客 Middleware
 * 只允許未登入的用戶訪問（如登入頁面、註冊頁面）
 * 如果用戶已登入，會被重定向到首頁或指定頁面
 */
export default defineNuxtRouteMiddleware(to => {
  const user = useSupabaseUser()

  // 如果用戶已登入，重定向到首頁
  if (user.value) {
    // 檢查是否有 redirect 參數，有的話就導向該頁面
    const redirect = to.query.redirect as string
    return navigateTo(redirect || '/')
  }
})
