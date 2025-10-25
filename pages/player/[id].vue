<script setup>
import {
  Play,
  Pause,
  Heart,
  Share2,
  SkipBack,
  SkipForward,
  Repeat1,
} from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'
import Button from '~/components/ui/Button.vue'

const router = useRouter()
const route = useRoute()
const { getSongById, getAvailableTitleLanguages, getSongTranslation } = useDatabase()

// 響應式狀態
const currentSongData = ref(null)
const lyricsMap = ref({}) // { ja: [...], zh: [...], en: [...] }

// 語言選擇
const availableLanguages = ref([]) // 可用的語言列表
const primaryLanguage = ref('ja') // 主要語言（時間軸基準）

// 標題翻譯
const availableTitleLanguages = ref([]) // 可用的標題翻譯語言
const currentTitleTranslation = ref('') // 當前標題翻譯

// 從路由參數取得歌曲 ID
const songId = computed(() => Number(route.params.id))

// 播放狀態管理（頁面內的 local state）
const isPlaying = ref(false)
const youtubePlayerRef = ref(null)

// 動態歌詞同步狀態
const currentTime = ref(0)           // 當前播放時間（毫秒）
let animationFrameId = null

// 重複播放當前句子
const isRepeatCurrentLine = ref(false) // 是否啟用重複播放
const repeatLineIndex = ref(-1)        // 要重複播放的句子索引
let repeatCheckIntervalId = null       // 重複檢查的計時器

// 停止追蹤播放時間（先定義）
const stopTimeTracking = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// 停止重複播放檢查
const stopRepeatCheck = () => {
  if (repeatCheckIntervalId) {
    clearInterval(repeatCheckIntervalId)
    repeatCheckIntervalId = null
  }
}

// 切換重複播放當前句子
const toggleRepeatCurrentLine = () => {
  isRepeatCurrentLine.value = !isRepeatCurrentLine.value
  
  if (isRepeatCurrentLine.value) {
    // 啟用時，記住當前要重複的句子索引
    repeatLineIndex.value = highlightedLineIndex.value
    startRepeatCheck()
  } else {
    repeatLineIndex.value = -1
    stopRepeatCheck()
  }
}

// 開始檢查是否需要重複播放（基於 primaryLanguage）
const startRepeatCheck = () => {
  if (repeatCheckIntervalId) return
  
  repeatCheckIntervalId = setInterval(() => {
    if (!isRepeatCurrentLine.value || !youtubePlayerRef.value) return
    
    const primaryLines = lyricsMap.value[primaryLanguage.value]
    if (!primaryLines || !primaryLines.length) return
    
    // 檢查要重複的 index 是否有效
    if (repeatLineIndex.value < 0 || repeatLineIndex.value >= primaryLines.length) {
      return
    }
    
    const currentIndex = highlightedLineIndex.value
    
    // 如果當前播放的句子不是要重複的句子，跳回去
    if (currentIndex !== repeatLineIndex.value) {
      console.log('當前在第', currentIndex, '句，跳回第', repeatLineIndex.value, '句')
      seekToLine(repeatLineIndex.value)
    }
  }, 100) // 每 100ms 檢查一次
}

// 初始化資料
const initializeData = async () => {
  try {
    // 直接從資料庫取單一歌曲（包含所有 lyrics）
    const song = await getSongById(songId.value)
    if (!song) {
      console.warn(`Song with ID ${songId.value} not found`)
      router.push('/')
      return
    }
    currentSongData.value = song
    
    // 從 song.lyrics 建立 lyricsMap
    const allLyrics = song.lyrics || []
    const tempLyricsMap = {}
    const languages = []
    
    allLyrics.forEach(lyric => {
      if (lyric.language_code && lyric.payload?.lines) {
        tempLyricsMap[lyric.language_code] = lyric.payload.lines
        languages.push(lyric.language_code)
      }
    })
    
    lyricsMap.value = tempLyricsMap
    
    // 設定主要語言（優先 ja，其次 zh，最後用第一個）
    if (languages.includes('ja')) {
      primaryLanguage.value = 'ja'
    } else if (languages.includes('zh')) {
      primaryLanguage.value = 'zh'
    } else if (languages.length > 0) {
      primaryLanguage.value = languages[0]
    }
    
    // 調整 availableLanguages 順序：主要語言排第一
    const sortedLanguages = [primaryLanguage.value]
    languages.forEach(lang => {
      if (lang !== primaryLanguage.value) {
        sortedLanguages.push(lang)
      }
    })
    availableLanguages.value = sortedLanguages
    
    // 獲取標題翻譯的所有可用語言
    const titleLanguages = await getAvailableTitleLanguages(songId.value)
    availableTitleLanguages.value = titleLanguages
    
    // 加載標題翻譯（如果有的話）
    if (availableTitleLanguages.value.length > 0) {
      // 嘗試加載與主要語言相同的標題翻譯
      const titleLang = availableTitleLanguages.value.includes(primaryLanguage.value)
        ? primaryLanguage.value
        : availableTitleLanguages.value[0]
      
      const translation = await getSongTranslation(songId.value, titleLang)
      console.log('Loaded title translation:', translation)
      if (translation && translation.title) {
        currentTitleTranslation.value = translation.title
      }
    }
  } catch (error) {
    console.error('載入資料失敗:', error)
    router.push('/')
  }
}

// 監聽路由參數變化
watch(songId, (newId) => {
  if (newId) {
    stopTimeTracking()
    currentTime.value = 0
    initializeData()
  }
}, { immediate: true })

// 計算當前應該高亮的行索引（基於 primaryLanguage）
const highlightedLineIndex = computed(() => {
  const primaryLines = lyricsMap.value[primaryLanguage.value]
  if (!primaryLines || !primaryLines.length) return -1
  
  // 找到最後一個 start_ms <= currentTime 的行
  let index = -1
  for (let i = 0; i < primaryLines.length; i++) {
    const startMs = primaryLines[i].start_ms || 0
    if (currentTime.value >= startMs) {
      index = i
    } else {
      break // 因為歌詞是按時間排序的，後面的都不符合了
    }
  }
  return index
})

const activeTab = ref('歌詞')
const tabs = ['歌詞', '留言']

// 開始追蹤播放時間
const startTimeTracking = () => {
  if (animationFrameId) return
  
  const updateFrame = () => {
    if (youtubePlayerRef.value && isPlaying.value) {
      currentTime.value = youtubePlayerRef.value.getCurrentTime() * 1000 // 轉毫秒
    }
    if (isPlaying.value) {
      animationFrameId = requestAnimationFrame(updateFrame)
    }
  }
  animationFrameId = requestAnimationFrame(updateFrame)
}

// 點擊歌詞行跳轉到該時間（基於 primaryLanguage）
const seekToLine = (lineIndex) => {
  if (!youtubePlayerRef.value) return
  
  const primaryLines = lyricsMap.value[primaryLanguage.value]
  const line = primaryLines?.[lineIndex]
  if (!line || line.start_ms === undefined) return
  
  console.log(line)
  const targetSeconds = line.start_ms / 1000
  youtubePlayerRef.value.seekTo(targetSeconds, true)
  youtubePlayerRef.value.playVideo()
  isPlaying.value = true
}

const togglePlayPause = () => {
  if (!youtubePlayerRef.value) return
  
  if (isPlaying.value) {
    youtubePlayerRef.value.pauseVideo()
  } else {
    youtubePlayerRef.value.playVideo()
  }
  isPlaying.value = !isPlaying.value
}

// 跳到上一句歌詞（基於 primaryLanguage）
const goToPreviousLine = () => {
  if (!youtubePlayerRef.value) return
  
  const primaryLines = lyricsMap.value[primaryLanguage.value]
  if (!primaryLines || !primaryLines.length) return
  
  const currentIndex = highlightedLineIndex.value
  const previousIndex = Math.max(0, currentIndex - 1)
  
  if (previousIndex >= 0) {
    seekToLine(previousIndex)
  }
}

// 跳到下一句歌詞（基於 primaryLanguage）
const goToNextLine = () => {
  if (!youtubePlayerRef.value) return
  
  const primaryLines = lyricsMap.value[primaryLanguage.value]
  if (!primaryLines || !primaryLines.length) return
  
  const currentIndex = highlightedLineIndex.value
  const nextIndex = Math.min(primaryLines.length - 1, currentIndex + 1)
  
  if (nextIndex < primaryLines.length) {
    seekToLine(nextIndex)
  }
}

// YouTube Player 事件處理
const onPlayerReady = (player) => {
  console.log('YouTube Player Ready:', player)
  youtubePlayerRef.value = player
}

const onPlayerStateChange = (state) => {
  // 同步播放狀態
  // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
  if (state === 1) {
    isPlaying.value = true
    startTimeTracking()
    if (isRepeatCurrentLine.value) {
      startRepeatCheck()
    }
  } else {
    isPlaying.value = false
    stopTimeTracking()
    stopRepeatCheck()
  }
}

// 組件卸載時清理資源
onUnmounted(() => {
  stopTimeTracking()
  stopRepeatCheck()
})
</script>

<template>
  <div style="height: calc(100vh - 68px)" class="bg-gray-50 flex flex-col overflow-hidden">
    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden gap-6 p-6 max-w-[1800px] mx-auto w-full">
      <!-- Left Side - Video Player and Controls -->
      <div class="flex-1 flex flex-col overflow-hidden bg-white rounded-xl shadow-sm">
        <!-- Video Section -->
        <div class="aspect-video bg-black flex items-center justify-center relative rounded-t-xl overflow-hidden">
          <!-- YouTube Player -->
          <YouTubePlayer
            v-if="currentSongData?.youtube_video_id"
            :video-id="currentSongData.youtube_video_id"
            :autoplay="false"
            @ready="onPlayerReady"
            @state-change="onPlayerStateChange"
          />
          
          <!-- Fallback for songs without YouTube ID -->
          <div v-else class="absolute inset-0">
            <div class="w-full h-full bg-gray-900" />
            
            <!-- Video overlay with text -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-white">
                <div v-if="currentSongData" class="text-8xl opacity-20 mb-4">{{ currentSongData.title }}</div>
                <p class="text-xl opacity-60">Music Video</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="p-8 bg-white">
          <!-- Song Info -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex-1 min-w-0">
              <h2 class="text-2xl font-semibold text-gray-900 truncate mb-1">
                {{ currentSongData?.title || '未播放歌曲' }}
              </h2>
              <!-- 標題翻譯 -->
              <p v-if="currentTitleTranslation" class="text-lg text-gray-600 truncate mb-2">
                {{ currentTitleTranslation }}
              </p>
              <p class="text-base text-gray-500 truncate mb-3">
                {{ currentSongData?.artist || '未知藝人' }}
              </p>
              
              <!-- Additional Info: Composer, Lyricist, Arranger -->
              <div class="mt-3 space-y-1.5">
                <p v-if="currentSongData?.composer" class="text-sm text-gray-600">
                  <span class="font-medium">作曲：</span>{{ currentSongData.composer }}
                </p>
                <p v-if="currentSongData?.lyricist" class="text-sm text-gray-600">
                  <span class="font-medium">作詞：</span>{{ currentSongData.lyricist }}
                </p>
                <p v-if="currentSongData?.arranger" class="text-sm text-gray-600">
                  <span class="font-medium">編曲：</span>{{ currentSongData.arranger }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3 ml-6">
              <Button variant="ghost" size="icon">
                <Heart class="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 class="w-5 h-5" />
              </Button>
            </div>
          </div>

          <!-- Playback Controls -->
          <div class="flex items-center justify-center gap-6 mt-4">
            <!-- 上一句 -->
            <Button
              variant="ghost"
              size="icon"
              class="h-12 w-12"
              :disabled="!lyricsMap[primaryLanguage]?.length || highlightedLineIndex <= 0"
              @click="goToPreviousLine"
            >
              <SkipBack class="w-6 h-6" />
            </Button>
            
            <!-- 播放/暫停 -->
            <Button
              variant="ghost"
              size="icon"
              class="h-16 w-16"
              @click="togglePlayPause"
            >
              <Play v-if="!isPlaying" class="w-8 h-8" />
              <Pause v-else class="w-8 h-8" />
            </Button>
            
            <!-- 下一句 -->
            <Button
              variant="ghost"
              size="icon"
              class="h-12 w-12"
              :disabled="!lyricsMap[primaryLanguage]?.length || highlightedLineIndex >= (lyricsMap[primaryLanguage]?.length || 0) - 1"
              @click="goToNextLine"
            >
              <SkipForward class="w-6 h-6" />
            </Button>
          </div>

          <!-- 重複播放當前句子按鈕 -->
          <div class="flex items-center justify-center mt-4">
            <Button
              :variant="isRepeatCurrentLine ? 'default' : 'ghost'"
              size="sm"
              class="gap-2"
              :disabled="!lyricsMap[primaryLanguage]?.length"
              @click="toggleRepeatCurrentLine"
            >
              <Repeat1 class="w-4 h-4" />
              <span class="text-sm">重複當前句</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Right Side - Lyrics and Tabs -->
      <div class="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Tabs -->
        <div class="flex items-center border-b border-gray-200 px-2">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="flex-1 px-6 py-4 text-sm font-medium transition-colors"
            :class="[
              activeTab === tab.toLowerCase()
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            ]"
            @click="activeTab = tab.toLowerCase()"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Lyrics Content -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="activeTab === '歌詞'" class="p-8 space-y-3">
            <div
              v-for="(_, index) in lyricsMap[primaryLanguage] || []"
              :key="index"
              class="transition-all duration-50 cursor-pointer p-3 rounded-lg mb-4"
              :class="[
                highlightedLineIndex === index
                  ? 'bg-red-50 border-l-4 border-red-500'
                  : 'hover:bg-gray-50'
              ]"
              @click="seekToLine(index)"
            >
              <div
                v-for="(lang, langIndex) in availableLanguages"
                :key="lang"
                class="mb-1 last:mb-0"
              >
                <div
                  :class="[
                    // 第一個（主要語言）用大字體粗體
                    langIndex === 0 ? 'text-lg font-medium' : 'text-base',
                    // 高亮時使用紅色
                    highlightedLineIndex === index ? 'text-red-500' : 'text-gray-900'
                  ]"
                >
                  {{ lyricsMap[lang]?.[index]?.text || '' }}
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="activeTab === '留言'" class="text-center text-gray-500 py-16">
            <p>暫無留言</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
