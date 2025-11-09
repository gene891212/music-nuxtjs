<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- 標題區 -->
      <div class="mb-8">
        <NuxtLink to="/upload" class="inline-flex items-center text-red-500 hover:text-red-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">
          新增歌曲
        </h1>
        <p class="mt-2 text-gray-600">
          輸入歌曲的基本資訊
        </p>
      </div>

      <!-- 表單卡片 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <form class="p-8 space-y-6" @submit.prevent="handleSubmit">
          <!-- 必填提示 -->
          <div class="text-sm text-gray-600">
            標有 <span class="text-red-500">*</span> 的欄位為必填
          </div>

          <!-- YouTube URL 輸入 -->
          <div>
            <label for="youtube-url" class="block text-sm font-medium text-gray-700 mb-1">
              YouTube URL
            </label>
            <input
              id="youtube-url"
              v-model="youtubeUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :disabled="loading"
            >
            <p v-if="extractedVideoId" class="mt-2 text-sm text-green-600">
              ✓ 影片 ID: {{ extractedVideoId }}
            </p>
          </div>

          <!-- 標題 (必填) -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
              標題 <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="例如：Never Gonna Give You Up"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :disabled="loading"
            >
          </div>

          <!-- 藝術家 -->
          <div>
            <label for="artist" class="block text-sm font-medium text-gray-700 mb-1">
              藝術家
            </label>
            <input
              id="artist"
              v-model="form.artist"
              type="text"
              placeholder="例如：Rick Astley"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :disabled="loading"
            >
          </div>

          <!-- 專輯 -->
          <div>
            <label for="album" class="block text-sm font-medium text-gray-700 mb-1">
              專輯
            </label>
            <input
              id="album"
              v-model="form.album_title"
              type="text"
              placeholder="例如：Whenever You Need Somebody"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :disabled="loading"
            >
          </div>

          <div>
            <label for="composer" class="block text-sm font-medium text-gray-700 mb-1">
              作曲
            </label>
            <input
              id="composer"
              v-model="form.composer"
              type="text"
              placeholder="例如：Mike Stock, Matt Aitken, Pete Waterman"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :disabled="loading"
            >
          </div>

          <div>
            <label for="lyricist" class="block text-sm font-medium text-gray-700 mb-1">
              作詞
            </label>
            <input
              id="lyricist"
              v-model="form.lyricist"
              type="text"
              placeholder="例如：Mike Stock, Matt Aitken, Pete Waterman"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :disabled="loading"
            >
          </div>

          <div>
            <label for="arranger" class="block text-sm font-medium text-gray-700 mb-1">
              編曲
            </label>
            <input
              id="arranger"
              v-model="form.arranger"
              type="text"
              placeholder="編排者名稱"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :disabled="loading"
            >
          </div>

          <!-- 預設語言 (必填) -->
          <div>
            <label for="language" class="block text-sm font-medium text-gray-700 mb-1">
              預設語言 <span class="text-red-500">*</span>
            </label>
            <select
              id="language"
              v-model="form.default_language_code"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :disabled="loading"
            >
              <option value="">-- 選擇語言 --</option>
              <option v-for="lang in ALL_LANGUAGES" :key="lang" :value="lang">
                {{ getLanguageName(lang) }}
              </option>
            </select>
          </div>

          <!-- 錯誤訊息 -->
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 border border-red-200">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
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
              <svg class="h-5 w-5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-green-700">
                  {{ successMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- 按鈕群 -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                建立中...
              </span>
              <span v-else>建立歌曲</span>
            </button>
            <NuxtLink
              to="/upload"
              class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ALL_LANGUAGES, getLanguageName } from '~/utils/languages'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const { createSong } = useDatabase()

const youtubeUrl = ref('')
const extractedVideoId = computed(() => {
  if (!youtubeUrl.value) return ''
  
  // YouTube URL regex patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = youtubeUrl.value.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return ''
})

const form = reactive({
  title: '',
  artist: '',
  album_title: '',
  composer: '',
  lyricist: '',
  arranger: '',
  default_language_code: '',
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const validateForm = () => {
  if (!form.title.trim()) {
    errorMessage.value = '請輸入歌曲標題'
    return false
  }
  
  if (!form.default_language_code) {
    errorMessage.value = '請選擇預設語言'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  const songData = {
    title: form.title.trim(),
    artist: form.artist.trim() || null,
    album_title: form.album_title.trim() || null,
    composer: form.composer.trim() || null,
    lyricist: form.lyricist.trim() || null,
    arranger: form.arranger.trim() || null,
    youtube_video_id: extractedVideoId.value || null,
    default_language_code: form.default_language_code,
  }
  
  const { data, error } = await createSong(songData)
  
  loading.value = false
  
  if (error) {
    errorMessage.value = error.message || '建立歌曲失敗，請稍後再試'
    return
  }
  
  if (data) {
    successMessage.value = '歌曲建立成功！正在跳轉...'
    
    // 確保正確取得 song_id
    const songId = data.song_id
    setTimeout(() => {
      router.push(`/upload/lyrics/new?songId=${songId}`)
    }, 800)
  }
}

useHead({
  title: '新增歌曲 - YouTube Music',
})
</script>
