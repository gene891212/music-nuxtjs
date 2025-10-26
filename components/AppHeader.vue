<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div class="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-8 py-2 sm:py-3">
      <!-- Mobile Layout -->
      <div class="md:hidden">
        <div class="flex items-center justify-between mb-2">
          <NuxtLink to="/" class="flex items-center gap-1.5 flex-shrink-0">
            <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <div class="w-5 h-5 bg-white rounded-full" />
            </div>
            <span class="text-gray-700 font-medium text-base">Music</span>
          </NuxtLink>
          <div class="flex items-center gap-2">
            <template v-if="!isAuthenticated">
              <NuxtLink to="/auth/login"><button class="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900">登入</button></NuxtLink>
              <NuxtLink to="/auth/register"><button class="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-full hover:bg-red-600">註冊</button></NuxtLink>
            </template>
            <template v-else>
              <div class="relative">
                <button class="flex items-center gap-2" @click="showUserMenu = !showUserMenu">
                  <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">{{ userInitial }}</div>
                </button>
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                  <div class="px-4 py-2 border-b"><p class="text-sm font-medium">{{ displayName }}</p><p class="text-xs text-gray-500">{{ userEmail }}</p></div>
                  <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">個人資料</NuxtLink>
                  <NuxtLink to="/upload" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">上傳歌曲</NuxtLink>
                  <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" @click="handleSignOut">登出</button>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="搜尋歌曲..." class="w-full pl-10 pr-3 py-1.5 text-sm border border-gray-200 bg-gray-100 rounded-full focus:outline-none focus:border-transparent focus:ring-2 focus:ring-red-500 focus:bg-white">
        </div>
      </div>

      <!-- Desktop Layout -->
      <div class="hidden md:flex items-center justify-between">
        <div class="flex items-center gap-8 flex-1">
          <NuxtLink to="/" class="flex items-center gap-2 flex-shrink-0">
            <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <div class="w-6 h-6 bg-white rounded-full" />
            </div>
            <span class="text-gray-700 font-medium text-lg">Music</span>
          </NuxtLink>
          <div class="flex-1 max-w-xl">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="searchQuery" type="text" placeholder="搜尋歌曲、專輯、藝人或 Podcast" class="w-full pl-12 pr-4 py-2 border border-gray-200 bg-gray-100 rounded-full focus:outline-none focus:border-transparent focus:ring-2 focus:ring-red-500 focus:bg-white">
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <template v-if="!isAuthenticated">
            <NuxtLink to="/auth/login"><button class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">登入</button></NuxtLink>
            <NuxtLink to="/auth/register"><button class="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-full hover:bg-red-600">註冊</button></NuxtLink>
          </template>
          <template v-else>
            <!-- 用戶下拉選單 -->
            <div class="relative">
              <button class="flex items-center gap-2" @click="showUserMenu = !showUserMenu">
                <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">{{ userInitial }}</div>
              </button>
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                <div class="px-4 py-2 border-b"><p class="text-sm font-medium">{{ displayName }}</p><p class="text-xs text-gray-500">{{ userEmail }}</p></div>
                <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">個人資料</NuxtLink>
                <NuxtLink to="/upload" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">上傳歌曲</NuxtLink>
                <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" @click="handleSignOut">登出</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isAuthenticated, userEmail, userMetadata, signOut } = useAuth()
const searchQuery = ref('')
const showUserMenu = ref(false)
const displayName = computed(() => userMetadata.value?.display_name || userEmail.value?.split('@')[0] || '用戶')
const userInitial = computed(() => displayName.value.charAt(0).toUpperCase())
const handleSignOut = async () => { showUserMenu.value = false; await signOut() }
</script>
