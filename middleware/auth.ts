/**
 * 認證 Middleware
 * 保護需要登入才能訪問的頁面
 * 如果用戶未登入，會被重定向到登入頁面
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // 如果用戶未登入，重定向到登入頁面
  if (!user.value) {
    return navigateTo({
      path: '/auth/login',
      query: {
        redirect: to.fullPath, // 儲存原本要去的頁面，登入後可以返回
      },
    })
  }
})
