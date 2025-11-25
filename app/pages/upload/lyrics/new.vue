<template>
  <NuxtLayout name="split-screen" left-class="overflow-y-auto">
    <template #left>
      <div class="p-4 md:p-6 space-y-6">
        <!-- Header / Back Button -->
        <div class="mb-8">
          <NuxtLink
            to="/upload"
            class="inline-flex items-center text-red-500 hover:text-red-600 mb-4"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回
          </NuxtLink>
          <h1 class="text-3xl font-bold text-gray-900">新增歌詞</h1>
          <p class="mt-2 text-gray-600">輸入歌曲的歌詞內容</p>
        </div>

        <!-- Song Selection -->
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
              class="px-4 py-2 border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              新增
            </NuxtLink>
          </div>
        </div>

        <!-- Song Info -->
        <div v-if="selectedSong" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 class="font-medium text-gray-900 mb-2">{{ selectedSong.title }}</h3>
          <div class="space-y-1 text-sm text-gray-600">
            <p v-if="selectedSong.artist">藝人: {{ selectedSong.artist }}</p>
            <p v-if="selectedSong.album_title">專輯: {{ selectedSong.album_title }}</p>
            <p>
              預設語言:
              <span class="font-medium">
                {{ getLanguageName(selectedSong.default_language_code || 'zh') }}
              </span>
            </p>
          </div>
        </div>

        <div v-if="selectedSong" class="flex-1 flex flex-col h-full">
          <!-- Language Tabs -->
          <div
            class="flex items-center border-b border-gray-200 px-1 md:px-2 overflow-x-auto scrollbar-hide flex-shrink-0"
          >
            <button
              v-for="lang in ALL_LANGUAGES"
              :key="lang"
              type="button"
              class="px-3 md:px-6 py-2.5 md:py-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap border-b-2"
              :class="
                currentLanguage === lang
                  ? 'text-red-500 border-red-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              "
              @click="currentLanguage = lang"
            >
              <span class="flex items-center gap-2">
                {{ getLanguageName(lang) }}
                <span
                  v-if="lyricsData[lang]?.trim()"
                  class="w-1.5 h-1.5 rounded-full bg-green-500"
                />
              </span>
            </button>
          </div>

          <!-- Editor Area -->
          <div class="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col">
            <div class="space-y-4 flex-1 flex flex-col">
              <div class="flex justify-between items-center">
                <label for="lyrics-textarea" class="block text-sm font-medium text-gray-700">
                  歌詞內容
                </label>
                <div class="text-xs text-gray-500 space-x-2">
                  <span class="bg-gray-100 px-1.5 py-0.5 rounded">LRC</span>
                  <span class="bg-gray-100 px-1.5 py-0.5 rounded">SRT</span>
                </div>
              </div>

              <textarea
                id="lyrics-textarea"
                v-model="currentLyrics"
                placeholder="[00:12.34] 輸入歌詞..."
                class="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm resize-none"
                :disabled="loading"
              />

              <!-- Metadata Inputs -->
              <div class="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label for="source" class="block text-sm font-medium text-gray-700 mb-1">
                    來源
                  </label>
                  <input
                    id="source"
                    v-model="currentMetadata.source"
                    type="text"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    :disabled="loading"
                  />
                </div>
                <div>
                  <label for="translator" class="block text-sm font-medium text-gray-700 mb-1">
                    譯者
                  </label>
                  <input
                    id="translator"
                    v-model="currentMetadata.translator"
                    type="text"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    :disabled="loading"
                  />
                </div>
              </div>

              <!-- Messages -->
              <div
                v-if="errorMessage"
                class="rounded-lg bg-red-50 p-3 border border-red-200 text-sm text-red-700"
              >
                {{ errorMessage }}
              </div>
              <div
                v-if="successMessage"
                class="rounded-lg bg-green-50 p-3 border border-green-200 text-sm text-green-700"
              >
                {{ successMessage }}
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  :disabled="loading || !currentLyrics.trim()"
                  class="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm"
                  @click="handleSubmit"
                >
                  <span v-if="loading">處理中...</span>
                  <span v-else>儲存歌詞</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #right>
      <div v-if="selectedSong" class="h-full flex flex-col">
        <!-- YouTube Player -->
        <div class="w-full aspect-video bg-black flex-shrink-0">
          <YouTubePlayer
            v-if="selectedSong.youtube_video_id"
            :key="selectedSong.youtube_video_id"
            :video-id="selectedSong.youtube_video_id"
            :autoplay="false"
            @ready="onPlayerReady"
            @state-change="onPlayerStateChange"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-900"
          >
            <div class="text-center">
              <svg
                class="w-16 h-16 mx-auto mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>此歌曲無 YouTube 影片</p>
            </div>
          </div>
        </div>

        <!-- Lyrics Preview -->
        <div class="flex-1 overflow-y-auto p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">歌詞預覽</h3>

          <div v-if="maxLines > 0" class="space-y-3">
            <div
              v-for="index in maxLines"
              :key="index"
              class="p-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 transition-colors cursor-pointer flex gap-3 items-center"
              :class="{
                'bg-red-100 border-red-500 ring-1 ring-red-500': highlightedLineIndex === index - 1,
              }"
              @click="seekToLine(index - 1)"
            >
              <!-- Timestamp Column -->
              <div class="flex-shrink-0 w-14 text-xs font-mono text-gray-400 text-right">
                <template
                  v-if="
                    sortedLanguages[0] &&
                    allParsedLyrics[sortedLanguages[0]]?.lines[index - 1]?.start_ms !== undefined
                  "
                >
                  {{ formatTime(allParsedLyrics[sortedLanguages[0]].lines[index - 1].start_ms!) }}
                </template>
              </div>

              <!-- Lyrics Stack Column -->
              <div class="flex-1 min-w-0 space-y-1">
                <div v-for="(lang, langIndex) in sortedLanguages" :key="lang">
                  <div
                    v-if="allParsedLyrics[lang]?.lines[index - 1]"
                    class="flex items-center gap-2"
                    :class="[
                      langIndex === 0
                        ? 'text-gray-900 font-medium text-base'
                        : 'text-gray-500 text-sm',
                      highlightedLineIndex === index - 1 && langIndex === 0 ? 'text-red-700' : '',
                    ]"
                  >
                    <!-- Language Badge -->
                    <span
                      class="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider"
                      :class="
                        lang === currentLanguage
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-500'
                      "
                    >
                      {{ lang }}
                    </span>
                    <span>{{ allParsedLyrics[lang].lines[index - 1].text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center text-gray-400 py-12">
            <svg
              class="w-12 h-12 mx-auto mb-3 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>開始輸入歌詞以預覽</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="h-full flex items-center justify-center text-gray-400">
        <div class="text-center p-8">
          <svg
            class="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <p class="text-lg">選擇歌曲以開始</p>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: false,
})

const route = useRoute()
const router = useRouter()
const { getSongs, addLyrics } = useDatabase()

// 響應式狀態
const songs = ref<any[]>([])
const selectedSongId = ref<string>('')
const selectedSong = computed(() => {
  if (!selectedSongId.value) return undefined
  const id = Number(selectedSongId.value)
  for (const song of songs.value) {
    if (song.song_id === id) return song
  }
  return undefined
})
const currentLanguage = ref<LanguageCode>('zh')

const lyricsData = reactive<Record<LanguageCode, string>>({
  zh: '',
  ja: '',
  en: '',
})
const currentLyrics = computed({
  get: () => lyricsData[currentLanguage.value] || '',
  set: value => {
    lyricsData[currentLanguage.value] = value
  },
})

const formData = reactive<Record<LanguageCode, { source: string; translator: string }>>({
  zh: { source: '', translator: '' },
  ja: { source: '', translator: '' },
  en: { source: '', translator: '' },
})

const currentMetadata = computed(() => {
  return formData[currentLanguage.value]
})

const loadingInitial = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 主要語言（時間軸基準）
const primaryLanguage = computed(() => {
  return (selectedSong.value?.default_language_code as LanguageCode) || 'jp'
})

// 解析所有語言的歌詞（包含時間軸繼承邏輯）
const allParsedLyrics = computed(() => {
  const result: Record<string, any> = {}

  // 解析所有語言的原始內容
  ALL_LANGUAGES.forEach(lang => {
    const content = lyricsData[lang]
    if (content && content.trim()) {
      result[lang] = parseAuto(content)
    } else {
      result[lang] = { lines: [] }
    }
  })

  // 取得主要語言的歌詞行（作為時間軸基準）
  const primaryLines = result[primaryLanguage.value]?.lines || []

  // 為其他語言注入時間軸
  ALL_LANGUAGES.forEach(lang => {
    if (lang === primaryLanguage.value) return // 跳過主要語言本身

    const targetLines = result[lang]?.lines || []

    // 遍歷每一行，嘗試從主要語言繼承時間軸
    targetLines.forEach((line: any, index: number) => {
      const primaryLine = primaryLines[index]

      // 如果該行原本沒有時間軸，且對應的主要語言行有時間軸，則繼承
      if (primaryLine && primaryLine.start_ms !== undefined && line.start_ms === undefined) {
        line.start_ms = primaryLine.start_ms
        line.end_ms = primaryLine.end_ms
      }
    })
  })

  return result
})

// 排序語言：主要語言排第一，其他隨後
const sortedLanguages = computed(() => {
  const langs = [primaryLanguage.value]
  ALL_LANGUAGES.forEach(lang => {
    if (lang !== primaryLanguage.value) {
      langs.push(lang)
    }
  })
  return langs
})

// 計算最大行數
const maxLines = computed(() => {
  let max = 0
  Object.values(allParsedLyrics.value).forEach((parsed: any) => {
    if (parsed.lines.length > max) {
      max = parsed.lines.length
    }
  })
  return max
})

// YouTube Player 相關
const youtubePlayerRef = ref<any>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
let animationFrameId: number | null = null

const onPlayerReady = (player: any) => {
  youtubePlayerRef.value = player
}

const onPlayerStateChange = (state: number) => {
  // YT.PlayerState.PLAYING = 1
  if (state === 1) {
    isPlaying.value = true
    startTimeTracking()
  } else {
    isPlaying.value = false
    stopTimeTracking()
  }
}

const startTimeTracking = () => {
  if (animationFrameId) return

  const updateFrame = () => {
    if (youtubePlayerRef.value && isPlaying.value) {
      currentTime.value = youtubePlayerRef.value.getCurrentTime() * 1000
    }
    if (isPlaying.value) {
      animationFrameId = requestAnimationFrame(updateFrame)
    }
  }
  animationFrameId = requestAnimationFrame(updateFrame)
}

const stopTimeTracking = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// 計算高亮行
const highlightedLineIndex = computed(() => {
  // 使用主要語言（或第一個排序語言）作為時間軸基準
  const primaryLang = primaryLanguage.value
  const currentLines = allParsedLyrics.value[primaryLang]?.lines || []

  if (!currentLines.length) return -1

  // 檢查是否有時間軸
  const hasTimestamps = currentLines.some(
    (line: any) => line.start_ms !== undefined && line.start_ms !== null
  )
  if (!hasTimestamps) return -1

  let index = -1
  for (let i = 0; i < currentLines.length; i++) {
    const startMs = currentLines[i]?.start_ms
    if (startMs === undefined || startMs === null) continue

    if (currentTime.value >= startMs) {
      index = i
    } else {
      break
    }
  }
  return index
})

const seekToLine = (index: number) => {
  if (!youtubePlayerRef.value) return

  const primaryLang = primaryLanguage.value
  const line = allParsedLyrics.value[primaryLang]?.lines[index]

  if (line && line.start_ms !== undefined) {
    youtubePlayerRef.value.seekTo(line.start_ms / 1000, true)
    youtubePlayerRef.value.playVideo()
  }
}

onUnmounted(() => {
  stopTimeTracking()
})

// 格式化時間（毫秒轉為 mm:ss.ms）
const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = Math.floor((ms % 1000) / 10)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
}

const onSongSelected = () => {
  if (!selectedSong.value) return

  // 初始化語言（從預設語言開始）
  const defaultLang = selectedSong.value.default_language_code || 'jp'
  currentLanguage.value = (defaultLang as LanguageCode) || 'jp'
  // 初始化所有語言的歌詞為空字串
  ALL_LANGUAGES.forEach(lang => {
    if (!lyricsData[lang]) {
      lyricsData[lang] = ''
    }
    // 重置 metadata
    formData[lang] = { source: '', translator: '' }
  })
  errorMessage.value = ''
  successMessage.value = ''
}

const validateForm = () => {
  if (!selectedSongId.value) {
    errorMessage.value = '請選擇歌曲'
    return false
  }

  const hasContent = Object.values(lyricsData).some(content => content && content.trim())
  if (!hasContent) {
    errorMessage.value = '請至少輸入一種語言的歌詞'
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
    // 為每個有內容的語言建立歌詞記錄
    for (const lang of ALL_LANGUAGES) {
      const lyricsContent = lyricsData[lang]
      if (!lyricsContent || !lyricsContent.trim()) continue

      // 使用已經處理過（包含繼承時間軸）的歌詞資料
      const payload = allParsedLyrics.value[lang]
      const metadata = formData[lang]

      const result = await addLyrics({
        song_id: Number(selectedSongId.value),
        language_code: lang,
        payload: payload as any,
        source: metadata.source || null,
        translator: metadata.translator || null,
      })

      if (!result) {
        errorMessage.value = `建立 ${getLanguageName(lang)} 歌詞失敗`
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
    // 確保 result 是陣列，並過濾掉 null/undefined
    songs.value = Array.isArray(result) ? result : result ? [result] : []

    // 從 query string 取得 songId
    const queryId = route.query.songId
    if (queryId) {
      selectedSongId.value = String(queryId)
      onSongSelected()
    }
  } catch (err) {
    errorMessage.value = '載入歌曲失敗: ' + ((err as Error).message || '未知錯誤')
  } finally {
    loadingInitial.value = false
  }
})

useHead({
  title: '新增歌詞 - YouTube Music',
})
</script>
