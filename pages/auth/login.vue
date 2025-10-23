<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- 標題區 -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">
          歡迎回來
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          登入您的帳戶以繼續
        </p>
      </div>

      <!-- 登入表單 -->
      <div class="bg-white py-8 px-6 rounded-xl shadow-sm">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Email 輸入 -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email 地址
            </label>
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
            <label for="password" class="block text-sm font-medium text-gray-700">
              密碼
            </label>
            <div class="mt-1">
              <Input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                placeholder="••••••••"
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
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
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
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700">
                  {{ successMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- 記住我 & 忘記密碼 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                記住我
              </label>
            </div>

            <div class="text-sm">
              <NuxtLink to="/auth/forgot-password" class="font-medium text-red-500 hover:text-red-600">
                忘記密碼？
              </NuxtLink>
            </div>
          </div>

          <!-- 登入按鈕 -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{{ loading ? '登入中...' : '登入' }}</span>
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

        <!-- 註冊連結 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            還沒有帳戶？
            <NuxtLink to="/auth/register" class="font-medium text-red-500 hover:text-red-600">
              立即註冊
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- 返回首頁 -->
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900">
           返回首頁
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false,
})

const route = useRoute()
const router = useRouter()
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const { data, error } = await signIn(email.value, password.value)

  loading.value = false

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      errorMessage.value = 'Email 或密碼錯誤'
    }
    else if (error.message.includes('Email not confirmed')) {
      errorMessage.value = '請先驗證您的 Email'
    }
    else {
      errorMessage.value = error.message || '登入失敗，請稍後再試'
    }
    return
  }

  if (data) {
    successMessage.value = '登入成功！正在跳轉...'

    setTimeout(() => {
      const redirect = String(route.query.redirect || '')
      router.push(redirect || '/')
    }, 500)
  }
}

useHead({
  title: '登入 - YouTube Music',
})
</script>
