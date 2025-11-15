<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-[1800px] mx-auto px-3 py-3 md:px-6 md:py-8 space-y-3 md:space-y-8">
      <!-- Quick Picks Section -->
      <section class="bg-white rounded-lg md:rounded-xl shadow-sm p-3 md:p-8">
        <div class="flex items-center justify-between mb-3 md:mb-6">
          <h2 class="text-lg md:text-2xl font-semibold text-gray-900">歌曲快選</h2>
          <div class="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              :disabled="quickPicksPage === 0"
              @click="previousQuickPicks"
            >
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              :disabled="quickPicksPage >= Math.ceil(quickPicks.length / 6) - 1"
              @click="nextQuickPicks"
            >
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
          <NuxtLink
            v-for="song in displayedQuickPicks"
            :key="song.song_id"
            :to="`/player/${song.song_id}`"
            class="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
          >
            <div class="relative w-10 h-10 md:w-12 md:h-12 rounded overflow-hidden flex-shrink-0">
              <img
                :src="getThumbnail(song.youtube_video_id, 'mq')"
                :alt="song.artist || 'Song thumbnail'"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm md:text-base text-gray-900 font-medium truncate">
                {{ song.title }}
              </h3>
              <p class="text-xs md:text-sm text-gray-500 truncate">
                {{ song.album_title || '未知專輯' }} • {{ song.artist || '未知歌手' }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- New Releases Section -->
      <section class="bg-white rounded-lg md:rounded-xl shadow-sm p-3 md:p-8">
        <div class="flex items-center justify-between mb-3 md:mb-6">
          <h2 class="text-lg md:text-2xl font-semibold text-gray-900">最新發行</h2>
          <div class="flex items-center gap-2">
            <NuxtLink
              to="/songs"
              class="text-sm text-gray-500 hover:text-gray-700 mr-2 transition-colors"
            >
              查看更多
            </NuxtLink>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              :disabled="newReleasesPage === 0"
              @click="previousNewReleases"
            >
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              :disabled="newReleasesPage >= Math.ceil(newReleases.length / 6) - 1"
              @click="nextNewReleases"
            >
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4"
        >
          <NuxtLink
            v-for="song in displayedNewReleases"
            :key="song.song_id"
            :to="`/player/${song.song_id}`"
            class="group cursor-pointer block"
          >
            <div
              class="aspect-video rounded-lg overflow-hidden mb-1.5 md:mb-3 shadow-soft hover:shadow-hard transition-all duration-300"
            >
              <img
                :src="getThumbnail(song.youtube_video_id || '', 'maxres')"
                :alt="song.title"
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <h3 class="text-sm md:text-base text-gray-900 font-medium truncate mb-0.5 md:mb-1">
              {{ song.title }}
            </h3>
            <p class="text-xs md:text-sm text-gray-500 truncate">{{ song.artist || '未知歌手' }}</p>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import { useYouTube } from '~/composables/useYouTube'

const { getSongs } = useDatabase()
const { getThumbnail } = useYouTube()

const allSongs = ref([])
const quickPicks = ref([])
const newReleases = ref([])

// 分頁狀態
const quickPicksPage = ref(0)
const quickPicksPerPage = 6
const newReleasesPage = ref(0)
const newReleasesPerPage = 6

// 計算當前顯示的快選歌曲
const displayedQuickPicks = computed(() => {
  const start = quickPicksPage.value * quickPicksPerPage
  const end = start + quickPicksPerPage
  return quickPicks.value.slice(start, end)
})

// 計算當前顯示的最新發行
const displayedNewReleases = computed(() => {
  const start = newReleasesPage.value * newReleasesPerPage
  const end = start + newReleasesPerPage
  return newReleases.value.slice(start, end)
})

// 快選分頁控制
const nextQuickPicks = () => {
  if (quickPicksPage.value < Math.ceil(quickPicks.value.length / quickPicksPerPage) - 1) {
    quickPicksPage.value++
  }
}

const previousQuickPicks = () => {
  if (quickPicksPage.value > 0) {
    quickPicksPage.value--
  }
}

// 最新發行分頁控制
const nextNewReleases = () => {
  if (newReleasesPage.value < Math.ceil(newReleases.value.length / newReleasesPerPage) - 1) {
    newReleasesPage.value++
  }
}

const previousNewReleases = () => {
  if (newReleasesPage.value > 0) {
    newReleasesPage.value--
  }
}

// 從陣列中隨機挑選指定數量的項目
const getRandomItems = (items, count) => {
  const shuffled = [...items].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 初始化資料
const initializeData = async () => {
  try {
    const songs = await getSongs()
    // 確保 songs 是陣列，並過濾掉 null/undefined
    allSongs.value = Array.isArray(songs) ? songs : songs ? [songs] : []

    // 快選：隨機挑 12 首
    quickPicks.value = getRandomItems(allSongs.value, 12)

    // 最新發行：按 created_at 排序，取最新的 12 首
    newReleases.value = [...allSongs.value]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 12)
  } catch (error) {
    console.error('載入歌曲失敗:', error)
  }
}

onMounted(() => {
  initializeData()
})

useHead({
  title: '首頁 - YouTube Music',
})
</script>
