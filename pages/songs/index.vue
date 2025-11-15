<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-[1800px] mx-auto px-3 py-3 md:px-6 md:py-8">
      <!-- Header -->
      <div class="mb-4 md:mb-8">
        <h1 class="text-2xl md:text-4xl font-bold text-gray-900 mb-2">所有歌曲</h1>
        <p class="text-sm md:text-base text-gray-600">共 {{ allSongs.length }} 首歌曲</p>
      </div>

      <!-- Songs Grid -->
      <div class="bg-white rounded-lg md:rounded-xl shadow-sm p-3 md:p-8">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4"
        >
          <NuxtLink
            v-for="song in allSongs"
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
            <p class="text-xs md:text-sm text-gray-500 truncate">
              {{ song.artist || '未知歌手' }}
            </p>
          </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-if="allSongs.length === 0" class="text-center py-12 md:py-16">
          <p class="text-lg md:text-xl text-gray-500">目前沒有歌曲</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useYouTube } from '~/composables/useYouTube'

const { getSongs } = useDatabase()
const { getThumbnail } = useYouTube()

const allSongs = ref([])

// 載入所有歌曲
const loadSongs = async () => {
  try {
    const songs = await getSongs()
    allSongs.value = Array.isArray(songs) ? songs : songs ? [songs] : []

    // 按 created_at 排序，最新的在前面
    allSongs.value.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } catch (error) {
    console.error('載入歌曲失敗:', error)
  }
}

onMounted(() => {
  loadSongs()
})

useHead({
  title: '所有歌曲 - YouTube Music',
})
</script>
