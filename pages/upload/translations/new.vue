<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 標題區 -->
      <div class="mb-8">
        <NuxtLink to="/upload" class="inline-flex items-center text-red-500 hover:text-red-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">
          新增歌曲翻譯
        </h1>
        <p class="mt-2 text-gray-600">
          為歌曲新增多語言翻譯標題
        </p>
      </div>

      <!-- 內容卡片 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-8 space-y-6">
          <!-- 歌曲選擇 -->
          <div>
            <label for="song-select" class="block text-sm font-medium text-gray-700 mb-1">
              選擇歌曲 <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <select
                id="song-select"
                v-model="selectedSongId"
                required
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                :disabled="loadingInitial"
                @change="onSongSelected"
              >
                <option value="">-- 選擇歌曲 --</option>
                <option v-for="song in songs" :key="song.song_id" :value="song.song_id">
                  {{ song.title }} {{ song.artist ? `(${song.artist})` : '' }}
                </option>
              </select>
              <NuxtLink
                to="/upload/songs/new"
                class="px-4 py-2 border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                新增
              </NuxtLink>
            </div>
          </div>

          <!-- 翻譯列表 -->
          <div v-if="selectedSong" class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <h2 class="font-semibold text-gray-900 mb-2">原始資訊</h2>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">標題:</span>
                  <p class="font-medium">{{ selectedSong.title }}</p>
                </div>
                <div>
                  <span class="text-gray-600">藝術家:</span>
                  <p class="font-medium">{{ selectedSong.artist || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- 翻譯表單 -->
            <div class="space-y-4">
              <h2 class="font-semibold text-gray-900">新增翻譯</h2>
              
              <!-- 語言選擇 -->
              <div>
                <label for="language" class="block text-sm font-medium text-gray-700 mb-1">
                  語言 <span class="text-red-500">*</span>
                </label>
                <select
                  id="language"
                  v-model="formData.language"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  :disabled="loading"
                >
                  <option value="">-- 選擇語言 --</option>
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ru">Русский</option>
                </select>
              </div>

              <!-- 翻譯標題 -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                  翻譯標題 <span class="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  placeholder="輸入翻譯後的歌曲標題"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  :disabled="loading"
                >
              </div>

              <!-- 來源和譯者 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="source" class="block text-sm font-medium text-gray-700 mb-1">
                    來源
                  </label>
                  <input
                    id="source"
                    v-model="formData.source"
                    type="text"
                    placeholder="例如: Wikipedia"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    :disabled="loading"
                  >
                </div>
                <div>
                  <label for="translator" class="block text-sm font-medium text-gray-700 mb-1">
                    譯者
                  </label>
                  <input
                    id="translator"
                    v-model="formData.translator"
                    type="text"
                    placeholder="您的名字"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    :disabled="loading"
                  >
                </div>
              </div>
            </div>

            <!-- 現有翻譯列表 -->
            <div v-if="translations.length > 0" class="border-t border-gray-200 pt-6">
              <h3 class="font-semibold text-gray-900 mb-4">現有翻譯</h3>
              <div class="space-y-2">
                <div v-for="trans in translations" :key="`${trans.song_id}-${trans.language_code}`" class="p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getLanguageName(trans.language_code) }}</p>
                      <p class="text-sm text-gray-600">{{ trans.title }}</p>
                    </div>
                    <button
                      type="button"
                      class="text-red-500 hover:text-red-700 text-sm font-medium"
                      :disabled="loading"
                      @click="deleteTranslation(trans.language_code)"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
                </p>4-16345
              </div>
            </div>
          </div>

          <!-- 按鈕群 -->
          <div v-if="selectedSong" class="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              :disabled="loading || !formData.language || !formData.title.trim()"
              class="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              @click="handleSubmit"
            >
              <span v-if="loading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                新增中...
              </span>
              <span v-else>新增翻譯</span>
            </button>
            <NuxtLink
              to="/upload"
              class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              完成
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getLanguageName } from '~/utils/languages'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { getSongs, addSongTranslation, getSongTranslations } = useDatabase()

// 響應式狀態
const songs = ref([])
const selectedSongId = ref('')
const selectedSong = computed(() => {
  const id = Number(selectedSongId.value)
  return songs.value.find(s => s.song_id === id)
})

const formData = reactive({
  language: '',
  title: '',
  source: '',
  translator: '',
})

const translations = ref([])
const loadingInitial = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loadTranslations = async () => {
  if (!selectedSongId.value) return
  
  try {
    const result = await getSongTranslations(Number(selectedSongId.value))
    translations.value = Array.isArray(result) ? result : (result ? [result] : [])
  } catch (err) {
    console.error('載入翻譯失敗:', err)
  }
}

const onSongSelected = async () => {
  if (!selectedSong.value) return
  
  errorMessage.value = ''
  successMessage.value = ''
  formData.language = ''
  formData.title = ''
  formData.source = ''
  formData.translator = ''
  
  await loadTranslations()
}

const validateForm = () => {
  if (!selectedSongId.value) {
    errorMessage.value = '請選擇歌曲'
    return false
  }

  if (!formData.language) {
    errorMessage.value = '請選擇語言'
    return false
  }

  if (!formData.title.trim()) {
    errorMessage.value = '請輸入翻譯標題'
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

  try {
    const { error } = await addSongTranslation({
      song_id: Number(selectedSongId.value),
      language_code: formData.language,
      title: formData.title.trim(),
      source: formData.source || null,
      translator: formData.translator || null,
    })

    if (error) {
      errorMessage.value = '新增翻譯失敗: ' + error.message
      loading.value = false
      return
    }

    successMessage.value = '翻譯新增成功！'
    formData.language = ''
    formData.title = ''
    formData.source = ''
    formData.translator = ''

    await loadTranslations()
  } finally {
    loading.value = false
  }
}

const deleteTranslation = async (languageCode) => {
  if (!confirm(`確定要刪除 ${getLanguageName(languageCode)} 翻譯嗎?`)) return

  loading.value = true
  try {
    // TODO: 需要在 useDatabase.ts 中實作刪除翻譯的方法
    errorMessage.value = '刪除功能尚未實作'
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(async () => {
  loadingInitial.value = true

  try {
    const result = await getSongs()
    // 確保 result 是陣列，並過濾掉 null/undefined
    songs.value = Array.isArray(result) ? result : (result ? [result] : [])

    // 從 query string 取得 songId
    const queryId = route.query.songId
    if (queryId) {
      selectedSongId.value = String(queryId)
      onSongSelected()
    }
  } catch (err) {
    errorMessage.value = '載入歌曲失敗: ' + (err.message || '未知錯誤')
  } finally {
    loadingInitial.value = false
  }
})

useHead({
  title: '新增翻譯 - YouTube Music',
})
</script>
