<script setup lang="ts">
import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Share2,
  MoreVertical,
} from 'lucide-vue-next'
import { ref, computed } from 'vue'
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'
import Slider from '~/components/ui/Slider.vue'

const router = useRouter()
const playerStore = usePlayerStore()
const { lyrics } = useMockData()

const activeTab = ref('lyrics')
const tabs = ['歌詞', '相關內容', '留言']

const handleBack = () => {
  router.push('/')
}

const togglePlayPause = () => {
  playerStore.togglePlayPause()
}

const currentSong = computed(() => playerStore.currentSong)
const isPlaying = computed(() => playerStore.isPlaying)
const volume = computed({
  get: () => playerStore.volume,
  set: (value) => playerStore.setVolume(value),
})
const progress = computed({
  get: () => playerStore.progress,
  set: (value) => playerStore.setProgress(value),
})
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
          <!-- Video Placeholder -->
          <div class="absolute inset-0">
            <NuxtImg
              v-if="currentSong"
              :src="currentSong.thumbnail"
              :alt="currentSong.title"
              class="w-full h-full object-cover opacity-70"
            />
            <div v-else class="w-full h-full bg-gray-900" />
            
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

          <!-- Progress Bar -->
          <div class="mb-4">
            <Slider v-model="progress" :min="0" :max="100" />
            <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{{ formatDuration((currentSong?.duration || 0) * progress / 100) }}</span>
              <span>{{ formatDuration(currentSong?.duration || 0) }}</span>
            </div>
          </div>

          <!-- Playback Controls -->
          <div class="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              :disabled="!playerStore.hasPreviousSong"
              @click="playerStore.previousSong()"
            >
              <SkipBack class="w-6 h-6" />
            </Button>
            
            <Button
              variant="default"
              size="lg"
              class="h-14 w-14"
              @click="togglePlayPause"
            >
              <Play v-if="!isPlaying" class="w-6 h-6" />
              <Pause v-else class="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              :disabled="!playerStore.hasNextSong"
              @click="playerStore.nextSong()"
            >
              <SkipForward class="w-6 h-6" />
            </Button>
          </div>

          <!-- Volume Control -->
          <div class="flex items-center gap-3 mt-4">
            <Volume2 class="w-5 h-5 text-gray-500 flex-shrink-0" />
            <Slider v-model="volume" :min="0" :max="100" class="flex-1" />
            <span class="text-sm text-gray-500 w-12 text-right">{{ volume }}%</span>
          </div>
        </div>
      </div>

      <!-- Right Side - Lyrics and Tabs -->
      <div class="w-96 border-l border-gray-200 flex flex-col bg-white">
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
