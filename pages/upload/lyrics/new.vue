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
          新增歌詞
        </h1>
        <p class="mt-2 text-gray-600">
          為歌曲新增歌詞和翻譯
        </p>
      </div>

      <!-- 內容卡片 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-8 space-y-6">
          <!-- 步驟指示 -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span class="ml-2 text-sm font-medium text-gray-900">選擇歌曲</span>
            </div>
            <div class="flex-1 mx-4 h-1 bg-gray-200" />
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span class="ml-2 text-sm font-medium text-gray-600">編輯歌詞</span>
            </div>
          </div>

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
            <p v-if="selectedSong" class="mt-2 text-sm text-gray-600">
              預設語言: <span class="font-medium">{{ getLanguageName(selectedSong.default_language_code) }}</span>
            </p>
          </div>

          <!-- 歌詞編輯區 -->
          <div v-if="selectedSong" class="space-y-4">
            <!-- 語言標籤 -->
            <div class="flex items-center gap-2 border-b border-gray-200 pb-4">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="lang in languages"
                  :key="lang"
                  type="button"
                  class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  :class="currentLanguage === lang
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  @click="currentLanguage = lang"
                >
                  {{ getLanguageName(lang) }}
                </button>
              </div>
              <button
                v-if="!showAddLanguage"
                type="button"
                class="ml-auto px-3 py-1 text-sm text-red-500 hover:text-red-600 font-medium"
                @click="showAddLanguage = true"
              >
                + 新增語言
              </button>
            </div>

            <!-- 新增語言表單 -->
            <div v-if="showAddLanguage" class="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <label for="new-lang" class="block text-sm font-medium text-gray-700 mb-1">
                  選擇語言
                </label>
                <select
                  id="new-lang"
                  v-model="newLanguage"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">-- 選擇語言 --</option>
                  <option v-for="lang in availableLanguages" :key="lang" :value="lang">
                    {{ getLanguageName(lang) }}
                  </option>
                </select>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                  @click="addLanguage"
                >
                  新增
                </button>
                <button
                  type="button"
                  class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  @click="showAddLanguage = false; newLanguage = ''"
                >
                  取消
                </button>
              </div>
            </div>

            <!-- 歌詞編輯器 -->
            <div class="space-y-2">
              <label for="lyrics-textarea" class="block text-sm font-medium text-gray-700">
                {{ getLanguageName(currentLanguage) }} 歌詞
              </label>
              <p class="text-xs text-gray-500">
                支援格式:
                <br>• <strong>LRC</strong>: <code class="bg-gray-100 px-1 rounded">[00:24.200]開いたノートに綴った青さは</code>
                <br>• <strong>SRT</strong>: 包含時間碼 <code class="bg-gray-100 px-1 rounded">00:00:24,200 --> 00:00:36,900</code>
                <br>• <strong>純文字</strong>: 每行一句歌詞
              </p>
              <textarea
                id="lyrics-textarea"
                v-model="currentLyrics"
                rows="12"
                placeholder="輸入 LRC/SRT 或純文字歌詞..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                :disabled="loading"
              />
            </div>

            <!-- 額外欄位 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="source" class="block text-sm font-medium text-gray-700 mb-1">
                  來源
                </label>
                <input
                  id="source"
                  v-model="lyricsData.source"
                  type="text"
                  placeholder="例如: Original, Wikipedia"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  :disabled="loading"
                >
              </div>
              <div>
                <label for="translator" class="block text-sm font-medium text-gray-700 mb-1">
                  譯者 / 提供者
                </label>
                <input
                  id="translator"
                  v-model="lyricsData.translator"
                  type="text"
                  placeholder="您的名字"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  :disabled="loading"
                >
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
                </p>
              </div>
            </div>
          </div>

          <!-- 按鈕群 -->
          <div v-if="selectedSong" class="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              :disabled="loading || !currentLyrics.trim()"
              class="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              @click="handleSubmit"
            >
              <span v-if="loading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                建立中...
              </span>
              <span v-else>建立歌詞</span>
            </button>
            <NuxtLink
              to="/upload"
              class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const { getSongs, addLyrics } = useDatabase()

// 語言映射
const languageMap = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
}

const allLanguages = Object.keys(languageMap)

// 響應式狀態
const songs = ref([])
const selectedSongId = ref('')
const selectedSong = computed(() => {
  const id = Number(selectedSongId.value)
  return songs.value.find(s => s.song_id === id)
})
const languages = ref([])
const currentLanguage = ref('zh')
const showAddLanguage = ref(false)
const newLanguage = ref('')

const lyricsData = reactive({})
const currentLyrics = computed({
  get: () => lyricsData[currentLanguage.value] || '',
  set: (value) => {
    lyricsData[currentLanguage.value] = value
  },
})

const formData = reactive({
  source: '',
  translator: '',
})

const availableLanguages = computed(() =>
  allLanguages.filter(lang => !languages.value.includes(lang))
)

const loadingInitial = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 輔助函數
const getLanguageName = (code) => languageMap[code] || code

// 解析 SRT 格式
const parseSRT = (content) => {
  const lines = []
  const blocks = content.trim().split('\n\n')
  
  for (const block of blocks) {
    const lines_array = block.split('\n')
    if (lines_array.length >= 3) {
      const timecode = lines_array[1] // "00:00:24,200 --> 00:00:36,900"
      const text = lines_array.slice(2).join('\n')
      
      const timeMatch = timecode.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s+-->\s+(\d{2}):(\d{2}):(\d{2}),(\d{3})/)
      if (timeMatch) {
        const startMs = (parseInt(timeMatch[1]) * 3600000) + (parseInt(timeMatch[2]) * 60000) + (parseInt(timeMatch[3]) * 1000) + parseInt(timeMatch[4])
        const endMs = (parseInt(timeMatch[5]) * 3600000) + (parseInt(timeMatch[6]) * 60000) + (parseInt(timeMatch[7]) * 1000) + parseInt(timeMatch[8])
        
        lines.push({ start_ms: startMs, end_ms: endMs, text })
      }
    }
  }
  
  return { lines }
}

// 解析 LRC 格式
const parseLRC = (content) => {
  const lines = []
  const lrcLines = content.split('\n')
  const timestamps = []
  
  // 第一遍：收集所有時間戳和文本
  for (const line of lrcLines) {
    // LRC 格式: [mm:ss.ms]text 或 [mm:ss]text
    const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/);
    if (match) {
      const minutes = parseInt(match[1])
      const seconds = parseInt(match[2])
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0
      const text = match[4].trim()
      
      const start_ms = (minutes * 60000) + (seconds * 1000) + milliseconds
      
      timestamps.push({ start_ms, text })
    }
  }
  
  // 第二遍：計算 end_ms（下一行的 start_ms，或 +5000ms 如果是最後一行）
  for (let i = 0; i < timestamps.length; i++) {
    const current = timestamps[i]
    const next = timestamps[i + 1]
    const end_ms = next ? next.start_ms : null
    
    lines.push({
      start_ms: current.start_ms,
      end_ms: end_ms,
      text: current.text
    })
  }
  
  return { lines }
}

// 自動檢測並解析格式
const parseAuto = (content) => {
  content = content.trim()
  
  // 檢測 SRT 格式（包含 --> 時間碼）
  if (content.includes('-->')) {
    return parseSRT(content)
  }
  
  // 檢測 LRC 格式（包含 [mm:ss] 時間碼）
  if (content.includes('[') && content.includes(']')) {
    return parseLRC(content)
  }
  
  // 預設為純文字
  const lines = content
    .split('\n')
    .filter((line) => line.trim())
    .map((text) => ({ text }))
  return { lines }
}

const addLanguage = () => {
  if (!newLanguage.value) {
    errorMessage.value = '請選擇語言'
    return
  }
  if (languages.value.includes(newLanguage.value)) {
    errorMessage.value = '該語言已存在'
    return
  }
  languages.value.push(newLanguage.value)
  lyricsData[newLanguage.value] = ''
  currentLanguage.value = newLanguage.value
  newLanguage.value = ''
  showAddLanguage.value = false
  errorMessage.value = ''
}

const onSongSelected = () => {
  if (!selectedSong.value) return

  // 初始化語言（從預設語言開始）
  const defaultLang = selectedSong.value.default_language_code || 'zh'
  languages.value = [defaultLang]
  currentLanguage.value = defaultLang
  lyricsData[defaultLang] = ''
  errorMessage.value = ''
  successMessage.value = ''
}

const validateForm = () => {
  if (!selectedSongId.value) {
    errorMessage.value = '請選擇歌曲'
    return false
  }

  if (!currentLyrics.value.trim()) {
    errorMessage.value = '請輸入歌詞'
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
    // 為每個語言的歌詞建立記錄
    for (const lang of languages.value) {
      const lyricsContent = lyricsData[lang]
      if (!lyricsContent || !lyricsContent.trim()) continue

      // 自動檢測並解析 LRC/SRT 格式或純文字
      const payload = parseAuto(lyricsContent)

      const { error } = await addLyrics({
        song_id: Number(selectedSongId.value),
        language_code: lang,
        payload: payload,
        source: formData.source || null,
        translator: formData.translator || null,
      })

      if (error) {
        errorMessage.value = `建立 ${getLanguageName(lang)} 歌詞失敗: ${error.message}`
        loading.value = false
        return
      }
    }

    successMessage.value = '歌詞建立成功！正在跳轉...'

    setTimeout(() => {
      router.push(`/upload/translations/new?songId=${selectedSongId.value}`)
    }, 800)
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(async () => {
  loadingInitial.value = true

  try {
    const result = await getSongs()
    songs.value = Array.isArray(result) ? result : [result]

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
  title: '新增歌詞 - YouTube Music',
})
</script>
