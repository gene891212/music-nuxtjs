import type { Provider } from '@supabase/supabase-js'

/**
 * 認證相關的 Composable
 * 提供登入、登出、註冊等功能
 */
export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()

  /**
   * 使用 Email 和密碼註冊
   */
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata, // 可以存儲額外的用戶資訊（如顯示名稱）
        },
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      console.error('註冊失敗:', error.message)
      return { data: null, error }
    }
  }

  /**
   * 使用 Email 和密碼登入
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      console.error('登入失敗:', error.message)
      return { data: null, error }
    }
  }

  /**
   * 使用 OAuth 登入（Google, GitHub 等）
   */
  const signInWithOAuth = async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      console.error('OAuth 登入失敗:', error.message)
      return { data: null, error }
    }
  }

  /**
   * 登出
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      // 登出後導向首頁
      await router.push('/')

      return { error: null }
    } catch (error: any) {
      console.error('登出失敗:', error.message)
      return { error }
    }
  }

  /**
   * 發送密碼重置郵件
   */
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      console.error('發送密碼重置郵件失敗:', error.message)
      return { data: null, error }
    }
  }

  /**
   * 更新密碼
   */
  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      console.error('更新密碼失敗:', error.message)
      return { data: null, error }
    }
  }

  /**
   * 更新用戶資料
   */
  const updateProfile = async (updates: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      console.error('更新個人資料失敗:', error.message)
      return { data: null, error }
    }
  }

  /**
   * 檢查是否已登入
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * 取得當前用戶的 Email
   */
  const userEmail = computed(() => user.value?.email || '')

  /**
   * 取得當前用戶的 ID
   */
  const userId = computed(() => user.value?.id || '')

  /**
   * 取得當前用戶的 metadata
   */
  const userMetadata = computed(() => user.value?.user_metadata || {})

  return {
    // 狀態
    user,
    isAuthenticated,
    userEmail,
    userId,
    userMetadata,

    // 方法
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  }
}
