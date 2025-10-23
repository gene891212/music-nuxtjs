<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- 標題區 -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">
          重設密碼
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          輸入您的 Email，我們會發送重設連結給您
        </p>
      </div>

      <!-- 表單 -->
      <div class="bg-white py-8 px-6 rounded-xl shadow-sm">
        <form class="space-y-6" @submit.prevent="handleResetPassword">
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

          <!-- 發送按鈕 -->
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
              <span>{{ loading ? '發送中...' : '發送重設連結' }}</span>
            </button>
          </div>
        </form>

        <!-- 返回登入 -->
        <div class="mt-6 text-center">
          <NuxtLink to="/auth/login" class="text-sm font-medium text-red-500 hover:text-red-600">
            ← 返回登入
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false,
})

const { resetPassword } = useAuth()

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleResetPassword = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const { error } = await resetPassword(email.value)

  loading.value = false

  if (error) {
    errorMessage.value = error.message || '發送失敗，請稍後再試'
    return
  }

  successMessage.value = '重設連結已發送至您的 Email，請查收'
}

useHead({
  title: '忘記密碼 - YouTube Music',
})
</script>
