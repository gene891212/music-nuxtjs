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
import { getLanguageName } from '~/utils/languages'

const router = useRouter()
const route = useRoute()
const { getSongById, getAvailableTitleLanguages, getSongTranslation } = useDatabase()

// 響應式狀態
const currentSongData = ref(null)
const lyricsMap = ref({}) // { ja: [...], zh: [...], en: [...] }

// 語言選擇
const availableLanguages = ref([]) // 可用的語言列表
const primaryLanguage = ref('ja') // 主要語言（時間軸基準）

// 取得歌詞的 metadata（來源和譯者）
const getLyricsMetadata = (lang) => {
  const lyric = currentSongData.value?.lyrics?.find(l => l.language_code === lang)
  return {
    source: lyric?.source || null,
    translator: lyric?.translator || null
  }
}

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

// 渲染帶有 Ruby 注音的文字
const renderTextWithRuby = (text, rubyAnnotations) => {
  if (!rubyAnnotations || rubyAnnotations.length === 0) {
    return text
  }

  const parts = []
  let lastIndex = 0

  // 按照起始位置排序 Ruby 注音
  const sortedRuby = [...rubyAnnotations].sort((a, b) => a.s - b.s)

  sortedRuby.forEach((ruby) => {
    // 添加 Ruby 注音前的普通文字
    if (ruby.s > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, ruby.s)
      })
    }

    // 添加帶 Ruby 注音的文字
    parts.push({
      type: 'ruby',
      content: text.slice(ruby.s, ruby.e),
      rt: ruby.rt
    })

    lastIndex = ruby.e
  })

  // 添加剩餘的普通文字
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex)
    })
  }

  return parts
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
  
  // 檢查第一行是否有時間軸，沒有則不高亮任何行（靜態歌詞）
  const hasTimestamps = primaryLines.some(line => line.start_ms !== undefined && line.start_ms !== null)
  if (!hasTimestamps) return -1
  
  // 找到最後一個 start_ms <= currentTime 的行
  let index = -1
  for (let i = 0; i < primaryLines.length; i++) {
    const startMs = primaryLines[i].start_ms
    if (startMs === undefined || startMs === null) continue
    
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
  <div class="bg-gray-50 min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] flex flex-col lg:overflow-hidden">
    <!-- Main Content - Responsive Layout -->
    <div class="flex-1 flex flex-col lg:flex-row lg:overflow-hidden gap-2 md:gap-4 lg:gap-6 p-3 md:p-4 lg:p-6 max-w-[1800px] mx-auto w-full">
      <!-- Video Player and Controls Section -->
      <div class="w-full lg:flex-1 flex flex-col bg-white rounded-lg md:rounded-xl shadow-sm">
        <!-- Video Section -->
        <div class="aspect-video bg-black flex items-center justify-center relative rounded-t-lg md:rounded-t-xl overflow-hidden">
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
                <div v-if="currentSongData" class="text-4xl md:text-8xl opacity-20 mb-4">{{ currentSongData.title }}</div>
                <p class="text-lg md:text-xl opacity-60">Music Video</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="p-3 md:p-6 lg:p-8 bg-white rounded-b-lg md:rounded-b-xl">
          <!-- Song Info -->
          <div class="flex items-start justify-between mb-3 md:mb-6">
            <div class="flex-1 min-w-0">
              <!-- 歌曲標題（支援 Ruby 注音） -->
              <h1 class="text-lg md:text-2xl font-semibold text-gray-900 mb-0.5 md:mb-1">
                <template v-if="currentSongData?.title_payload?.ruby">
                  <template v-for="(part, partIndex) in renderTextWithRuby(currentSongData.title_payload.text, currentSongData.title_payload.ruby)" :key="partIndex">
                    <ruby v-if="part.type === 'ruby'" class="ruby-text">
                      <rb>{{ part.content }}</rb><rt class="text-[0.5em] leading-tight select-none whitespace-nowrap opacity-75">{{ part.rt }}</rt>
                    </ruby>
                    <template v-else>{{ part.content }}</template>
                  </template>
                </template>
                <template v-else>
                  {{ currentSongData?.title || '未播放歌曲' }}
                </template>
              </h1>
              <!-- 標題翻譯 -->
              <p v-if="currentTitleTranslation" class="text-sm md:text-lg text-gray-600 truncate mb-2 md:mb-3">
                {{ currentTitleTranslation }}
              </p>
              <p class="text-xs md:text-base text-gray-500 truncate mb-2 md:mb-3">
                {{ currentSongData?.artist || '未知藝人' }}
              </p>
              
              <!-- Additional Info: Composer, Lyricist, Arranger -->
              <div class="mt-1.5 md:mt-3 space-y-0.5 md:space-y-1.5">
                <p v-if="currentSongData?.composer" class="text-xs md:text-sm text-gray-600">
                  <span class="font-medium">作曲：{{ currentSongData.composer }}</span>
                </p>
                <p v-if="currentSongData?.lyricist" class="text-xs md:text-sm text-gray-600">
                  <span class="font-medium">作詞：{{ currentSongData.lyricist }}</span>
                </p>
                <p v-if="currentSongData?.arranger" class="text-xs md:text-sm text-gray-600">
                  <span class="font-medium">編曲：{{ currentSongData.arranger }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1.5 md:gap-3 ml-2 md:ml-6">
              <Button variant="ghost" size="icon" class="h-7 w-7 md:h-10 md:w-10">
                <Heart class="w-3.5 h-3.5 md:w-5 md:h-5" />
              </Button>
              <Button variant="ghost" size="icon" class="h-7 w-7 md:h-10 md:w-10">
                <Share2 class="w-3.5 h-3.5 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>

          <!-- 歌詞來源和譯者資訊 -->
          <div v-if="availableLanguages.length > 1" class="mb-3 md:mb-6 p-2.5 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 class="text-xs font-semibold text-gray-700 mb-1.5 md:mb-2">歌詞資訊</h3>
            <div class="space-y-1">
              <div v-for="lang in availableLanguages.slice(1)" :key="`meta-${lang}`" class="text-xs">
                <span class="font-medium text-gray-900">{{ getLanguageName(lang) }}：</span>
                <template v-if="getLyricsMetadata(lang).source || getLyricsMetadata(lang).translator">
                  <span v-if="getLyricsMetadata(lang).source" class="text-gray-600">
                    來源：{{ getLyricsMetadata(lang).source }}
                  </span>
                  <span v-if="getLyricsMetadata(lang).source && getLyricsMetadata(lang).translator" class="text-gray-400 mx-1">|</span>
                  <span v-if="getLyricsMetadata(lang).translator" class="text-gray-600">
                    譯者：{{ getLyricsMetadata(lang).translator }}
                  </span>
                </template>
                <span v-else class="text-gray-400 italic">無資訊</span>
              </div>
            </div>
          </div>

          <!-- Playback Controls -->
          <div class="flex items-center justify-center gap-3 md:gap-6 mt-2 md:mt-4">
            <!-- 上一句 -->
            <Button
              variant="ghost"
              size="icon"
              class="h-9 w-9 md:h-12 md:w-12"
              :disabled="!lyricsMap[primaryLanguage]?.length || highlightedLineIndex <= 0"
              @click="goToPreviousLine"
            >
              <SkipBack class="w-4 h-4 md:w-6 md:h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              class="h-11 w-11 md:h-16 md:w-16"
              @click="togglePlayPause"
            >
              <Play v-if="!isPlaying" class="w-5 h-5 md:w-8 md:h-8" />
              <Pause v-else class="w-5 h-5 md:w-8 md:h-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              class="h-9 w-9 md:h-12 md:w-12"
              :disabled="!lyricsMap[primaryLanguage]?.length || highlightedLineIndex >= (lyricsMap[primaryLanguage]?.length || 0) - 1"
              @click="goToNextLine"
            >
              <SkipForward class="w-4 h-4 md:w-6 md:h-6" />
            </Button>
          </div>

          <div class="flex items-center justify-center mt-2 md:mt-4">
            <Button
              :variant="isRepeatCurrentLine ? 'default' : 'ghost'"
              size="sm"
              class="gap-2 text-xs md:text-sm"
              :disabled="!lyricsMap[primaryLanguage]?.length"
              @click="toggleRepeatCurrentLine"
            >
              <Repeat1 class="w-3 h-3 md:w-4 md:h-4" />
              <span>重複當前句</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Lyrics Section - Below player on mobile, right side on desktop -->
      <div class="w-full lg:flex-1 flex flex-col bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden">
        <!-- Tabs -->
        <div class="flex items-center border-b border-gray-200 px-1 md:px-2 flex-shrink-0">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="flex-1 px-3 md:px-6 py-2.5 md:py-4 text-xs md:text-sm font-medium transition-colors"
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
          <div v-if="activeTab === '歌詞'" class="p-3 md:p-6 lg:p-8">
          <template v-for="(_, index) in lyricsMap[primaryLanguage] || []" :key="index">
            <div
              class="transition-all duration-50 cursor-pointer p-3 md:p-4 rounded-lg"
              :class="[
                highlightedLineIndex === index
                  ? 'bg-red-50 border-l-4 border-red-500'
                  : 'hover:bg-gray-100'
              ]"
              @click="seekToLine(index)"
            >
              <div
                v-for="(lang, langIndex) in availableLanguages"
                :key="lang"
                class="mb-1.5 md:mb-2 last:mb-0"
              >
                <div
                  :class="[
                    // 第一個（主要語言）用大字體粗體
                    langIndex === 0 ? 'text-base md:text-lg font-medium' : 'text-sm md:text-base',
                    // 高亮時使用紅色
                    highlightedLineIndex === index ? 'text-red-500' : 'text-gray-900',
                    langIndex > 0 && 'opacity-80'
                  ]"
                >
                  <!-- 渲染帶 Ruby 注音的歌詞 -->
                  <template v-if="lyricsMap[lang]?.[index]?.ruby">
                    <template v-for="(part, partIndex) in renderTextWithRuby(lyricsMap[lang][index].text, lyricsMap[lang][index].ruby)" :key="partIndex">
                      <ruby v-if="part.type === 'ruby'" class="ruby-text">
                        <rb>{{ part.content }}</rb><rt class="text-[0.7em] leading-tight select-none whitespace-nowrap opacity-75" :class="highlightedLineIndex === index ? 'opacity-85' : ''">{{ part.rt }}</rt>
                      </ruby>
                      <template v-else>{{ part.content }}</template>
                    </template>
                  </template>
                  <!-- 無 Ruby 注音的普通文字 -->
                  <template v-else>
                    {{ lyricsMap[lang]?.[index]?.text || '' }}
                  </template>
                </div>
              </div>
            </div>
            <hr v-if="index < (lyricsMap[primaryLanguage]?.length || 0) - 1" class="my-2 border-gray-200">
          </template>
          </div>
          
          <div v-else-if="activeTab === '留言'" class="text-center text-gray-500 py-12 md:py-16">
            <p class="text-sm md:text-base">暫無留言</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ruby 注音位置 (Tailwind 無法設定) */
.ruby-text {
  ruby-position: over;
  ruby-align: center;
}
</style>
