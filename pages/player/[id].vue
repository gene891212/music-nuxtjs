<script setup>
import {
  Play,
  Pause,
  Heart,
  Share2,
} from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'
import Button from '~/components/ui/Button.vue'

const router = useRouter()
const route = useRoute()
const { getSongById, getLyrics } = useDatabase()

// 響應式狀態
const currentSongData = ref(null)
const currentLyricsData = ref([])

// 從路由參數取得歌曲 ID
const songId = computed(() => Number(route.params.id))

// 初始化資料
const initializeData = async () => {
  try {
    // 直接從資料庫取單一歌曲
    const song = await getSongById(songId.value)
    if (!song) {
      console.warn(`Song with ID ${songId.value} not found`)
      router.push('/')
      return
    }
    currentSongData.value = song
    
    // 取得當前歌曲的歌詞（使用預設語言）
    const langCode = song.default_language_code || 'zh'
    const lyrics = await getLyrics(songId.value, langCode)
    
    if (lyrics && lyrics.payload && lyrics.payload.lines) {
      // 將 payload.lines 轉換為顯示用的格式
      currentLyricsData.value = lyrics.payload.lines
    } else {
      currentLyricsData.value = []
    }
  } catch (error) {
    console.error('載入資料失敗:', error)
    router.push('/')
  }
}

// 監聽路由參數變化
watch(songId, (newId) => {
  if (newId) {
    initializeData()
  }
}, { immediate: true })

// 播放狀態管理（頁面內的 local state）
const isPlaying = ref(false)
const youtubePlayerRef = ref(null)

const activeTab = ref('歌詞')
const tabs = ['歌詞', '留言']

const togglePlayPause = () => {
  if (!youtubePlayerRef.value) return
  
  if (isPlaying.value) {
    youtubePlayerRef.value.pauseVideo()
  } else {
    youtubePlayerRef.value.playVideo()
  }
  isPlaying.value = !isPlaying.value
}

// YouTube Player 事件處理
const onPlayerReady = (player) => {
  console.log('YouTube Player Ready:', player)
  youtubePlayerRef.value = player
}

const onPlayerStateChange = (state) => {
  console.log('YouTube Player State Changed:', state)
  // 同步播放狀態
  // YT.PlayerState.PLAYING = 1, PAUSED = 2
  if (state === 1) {
    isPlaying.value = true
  } else if (state === 2 || state === 0) {
    isPlaying.value = false
  }
}

const onTimeUpdate = () => {
  // 時間更新由 YouTube 控制列處理
}
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
            @time-update="onTimeUpdate"
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

          <!-- Playback Controls (只有播放/暫停按鈕) -->
          <div class="flex items-center justify-center gap-6 mt-4">
            <Button
              variant="ghost"
              size="icon"
              class="h-16 w-16"
              @click="togglePlayPause"
            >
              <Play v-if="!isPlaying" class="w-8 h-8" />
              <Pause v-else class="w-8 h-8" />
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
        <div class="flex-1 overflow-y-auto p-8">
          <div v-if="activeTab === '歌詞'" class="space-y-3">
            <div
              v-for="(line, index) in currentLyricsData"
              :key="index"
              class="text-gray-700 leading-relaxed text-base"
            >
              {{ line.text || '...' }}
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
