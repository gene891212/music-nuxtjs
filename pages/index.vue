<script setup lang="ts">
import { Search, Cast, User, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'

const { getSongs } = useDatabase()
const { getThumbnail } = useYouTube()
const songs = await getSongs()
console.log(songs)

const { quickPicks, newReleases, categories } = useMockData()
</script>

<template>
  <div class="min-h-screen yt-gradient">
    <!-- Header -->
    <header class="sticky top-0 z-50 glass border-b border-gray-200">
      <div class="max-w-[1800px] mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo and Search -->
          <div class="flex items-center gap-8 flex-1">
            <!-- Logo -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <div class="w-6 h-6 bg-white rounded-full" />
              </div>
              <span class="text-gray-700 font-medium text-lg">Music</span>
            </div>
            
            <!-- Search -->
            <div class="flex-1 max-w-xl">
              <div class="relative">
                <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="搜尋歌曲、專輯、藝人或 Podcast"
                  class="pl-12"
                />
              </div>
            </div>
          </div>

          <!-- Right Icons -->
          <div class="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Cast class="w-5 h-5" />
            </Button>
            <Button variant="danger" size="icon">
              <User class="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="max-w-[1800px] mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
        <Button
          v-for="(category, index) in categories"
          :key="category.id"
          :variant="index === 0 ? 'default' : 'ghost'"
          size="sm"
          class="whitespace-nowrap"
        >
          {{ category.name }}
        </Button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1800px] mx-auto px-6 py-8">
      <!-- Quick Picks Section -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">歌曲快選</h2>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 mr-2">全部顯示</span>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <NuxtLink
            v-for="song in quickPicks"
            :key="song.song_id"
            :to="`/player/${song.song_id}`"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
          >
            <div class="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
              <img
                :src="getThumbnail(song.youtube_video_id, 'mq')"
                :alt="song.artist || 'Song thumbnail'"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              >
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-gray-900 font-medium truncate">{{ song.title }}</h3>
              <p class="text-sm text-gray-500 truncate">
                {{ song.album_title || '未知專輯' }} • {{ song.artist || '未知歌手' }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- New Releases Section -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">最新發行</h2>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 mr-2">查看更多</span>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <NuxtLink
            v-for="album in newReleases"
            :key="album.id"
            :to="`/player/${quickPicks[0]?.song_id || 1}`"
            class="group cursor-pointer block"
          >
            <div class="aspect-square rounded-lg overflow-hidden mb-3 shadow-soft hover:shadow-hard transition-all duration-300">
              <img
                :src="album.image"
                :alt="album.title"
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              >
            </div>
            <h3 class="text-gray-900 font-medium truncate mb-1">{{ album.title }}</h3>
            <p class="text-sm text-gray-500 truncate">{{ album.artist }}</p>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
