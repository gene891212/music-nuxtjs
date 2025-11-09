<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- 標題區 -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">建立新帳戶</h2>
        <p class="mt-2 text-sm text-gray-600">加入我們，開始您的音樂之旅</p>
      </div>

      <!-- 註冊表單 -->
      <div class="bg-white py-8 px-6 rounded-xl shadow-sm">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <!-- 顯示名稱輸入 -->
          <div>
            <label for="displayName" class="block text-sm font-medium text-gray-700">
              顯示名稱
            </label>
            <div class="mt-1">
              <Input
                id="displayName"
                v-model="displayName"
                type="text"
                autocomplete="name"
                required
                placeholder="您的名稱"
                class="w-full"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Email 輸入 -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Email 地址 </label>
            <div class="mt-1">
              <Input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                placeholder="your@email.com"
                class="w-full"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- 密碼輸入 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> 密碼 </label>
            <div class="mt-1">
              <Input
                id="password"
                v-model="password"
                type="password"
                autocomplete="new-password"
                required
                placeholder="至少 6 個字元"
                class="w-full"
                :disabled="loading"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">密碼需要至少 6 個字元</p>
          </div>

          <!-- 確認密碼輸入 -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              確認密碼
            </label>
            <div class="mt-1">
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                placeholder="再次輸入密碼"
                class="w-full"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- 錯誤訊息 -->
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 border border-red-200">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- 成功訊息 -->
          <div v-if="successMessage" class="rounded-lg bg-green-50 p-4 border border-green-200">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700">
                  {{ successMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- 服務條款 -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="acceptTerms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-gray-600">
                我同意
                <a href="#" class="text-red-500 hover:text-red-600">服務條款</a>
                和
                <a href="#" class="text-red-500 hover:text-red-600">隱私政策</a>
              </label>
            </div>
          </div>

          <!-- 註冊按鈕 -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>{{ loading ? '註冊中...' : '註冊' }}</span>
            </button>
          </div>
        </form>

        <!-- 分隔線 -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">或</span>
            </div>
          </div>
        </div>

        <!-- 登入連結 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            已經有帳戶了？
            <NuxtLink to="/auth/login" class="font-medium text-red-500 hover:text-red-600">
              立即登入
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- 返回首頁 -->
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900"> ← 返回首頁 </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest', // 只允許未登入用戶訪問
  layout: false, // 不使用預設 layout
})

const router = useRouter()
const { signUp } = useAuth()

// 表單資料
const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

// 狀態
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 註冊處理
const handleRegister = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  // 驗證密碼
  if (password.value.length < 6) {
    errorMessage.value = '密碼需要至少 6 個字元'
    loading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '兩次輸入的密碼不一致'
    loading.value = false
    return
  }

  if (!acceptTerms.value) {
    errorMessage.value = '請同意服務條款和隱私政策'
    loading.value = false
    return
  }

  const { data, error } = await signUp(email.value, password.value, {
    display_name: displayName.value,
  })

  loading.value = false

  if (error) {
    // 顯示友善的錯誤訊息
    if (error.message.includes('User already registered')) {
      errorMessage.value = '此 Email 已被註冊'
    } else if (error.message.includes('Password should be at least')) {
      errorMessage.value = '密碼強度不足，請使用更複雜的密碼'
    } else {
      errorMessage.value = error.message || '註冊失敗，請稍後再試'
    }
    return
  }

  if (data) {
    successMessage.value = '註冊成功！請檢查您的 Email 以驗證帳戶'

    // 延遲後導向登入頁面
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  }
}

// SEO
useHead({
  title: '註冊 - YouTube Music',
})
</script>
