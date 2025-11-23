/**
 * 認證 Middleware
 * 保護需要登入才能訪問的頁面
 * 如果用戶未登入，會被重定向到登入頁面
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  // 如果用戶未登入，重定向到登入頁面
  if (!user.value) {
    // 在 SPA 模式下，重新整理時 user 可能尚未填入
    // 嘗試獲取 session 確認是否真的未登入
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return navigateTo({
        path: '/auth/login',
        query: {
          redirect: to.fullPath, // 儲存原本要去的頁面，登入後可以返回
        },
      })
    }
  }
})
