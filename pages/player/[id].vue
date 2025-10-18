<script setup lang="ts">
import {
  ChevronLeft,
  Play,
  Pause,
  Heart,
  Share2,
  MoreVertical,
} from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'

const router = useRouter()
const route = useRoute()
const { quickPicks: songs, lyrics } = useMockData()

// 從路由參數取得歌曲 ID
const songId = computed(() => Number(route.params.id))

// 找到當前歌曲
const currentSong = computed(() => 
  songs.find(s => s.song_id === songId.value)
)

// 404 處理：如果找不到歌曲，導回首頁
watch(currentSong, (song) => {
  if (!song) {
    console.warn(`Song with ID ${songId.value} not found`)
    router.push('/')
  }
}, { immediate: true })

// 播放狀態管理（頁面內的 local state）
const isPlaying = ref(false)
const youtubePlayerRef = ref<any>(null)

const activeTab = ref('lyrics')
const tabs = ['歌詞', '相關內容', '留言']

const handleBack = () => {
  router.push('/')
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

// YouTube Player 事件處理
const onPlayerReady = (player: any) => {
  console.log('YouTube Player Ready:', player)
  youtubePlayerRef.value = player
}

const onPlayerStateChange = (state: any) => {
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
  <div class="h-screen bg-white flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
      <Button variant="ghost" size="icon" @click="handleBack">
        <ChevronLeft class="w-6 h-6" />
      </Button>
      
      <div class="flex-1 max-w-md mx-8">
        <Input
          placeholder="搜尋歌曲、專輯、藝人或 Podcast"
          class="w-full"
        />
      </div>

      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <MoreVertical class="w-5 h-5" />
        </Button>
        <div class="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full" />
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Side - Video Player and Controls -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Video Section -->
        <div class="flex-1 bg-black flex items-center justify-center relative">
          <!-- YouTube Player -->
          <YouTubePlayer
            v-if="currentSong?.youtube_video_id"
            :video-id="currentSong.youtube_video_id"
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
                <div v-if="currentSong" class="text-8xl opacity-20 mb-4">{{ currentSong.title }}</div>
                <p class="text-xl opacity-60">Music Video</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="p-6 bg-white border-t border-gray-200">
          <!-- Song Info -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-semibold text-gray-900 truncate">
                {{ currentSong?.title || '未播放歌曲' }}
              </h2>
              <p class="text-sm text-gray-500 truncate">
                {{ currentSong?.artist || '未知藝人' }}
              </p>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <Button variant="ghost" size="icon">
                <Heart class="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 class="w-5 h-5" />
              </Button>
            </div>
          </div>

          <!-- Playback Controls (只有播放/暫停按鈕) -->
          <div class="flex items-center justify-center gap-6">
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
      <div class="flex-1 border-l border-gray-200 flex flex-col bg-white">
        <!-- Tabs -->
        <div class="flex items-center border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
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
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="activeTab === '歌詞'" class="space-y-4">
            <div
              v-for="(line, index) in lyrics"
              :key="index"
              class="text-gray-700 leading-relaxed"
              :class="{ 'text-gray-400': !line.text }"
            >
              {{ line.text || '...' }}
            </div>
          </div>
          
          <div v-else-if="activeTab === '相關內容'" class="text-center text-gray-500 py-12">
            <p>暫無相關內容</p>
          </div>
          
          <div v-else class="text-center text-gray-500 py-12">
            <p>暫無留言</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
