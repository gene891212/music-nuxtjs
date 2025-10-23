<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 標題區 -->
      <div class="mb-12">
        <NuxtLink to="/" class="inline-flex items-center text-red-500 hover:text-red-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回首頁
        </NuxtLink>
        <h1 class="text-4xl font-bold text-gray-900">
          上傳管理
        </h1>
        <p class="mt-2 text-gray-600">
          管理歌曲、歌詞和翻譯
        </p>
      </div>

      <!-- 功能卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 新增歌曲卡片 -->
        <NuxtLink
          to="/upload/songs/new"
          class="group"
        >
          <div class="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">新增歌曲</h2>
            <p class="text-gray-600 text-sm flex-1 mb-4">
              建立新的歌曲記錄，包括標題、藝術家、專輯等基本資訊
            </p>
            <div class="flex items-center text-red-500 font-medium text-sm group-hover:gap-2 transition-all">
              開始 <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- 新增歌詞卡片 -->
        <NuxtLink
          to="/upload/lyrics/new"
          class="group"
        >
          <div class="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25S6.5 28 12 28s10-4.745 10-10.75S17.5 6.253 12 6.253z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">新增歌詞</h2>
            <p class="text-gray-600 text-sm flex-1 mb-4">
              為歌曲新增多語言歌詞內容，支援 JSON 格式或純文字
            </p>
            <div class="flex items-center text-red-500 font-medium text-sm group-hover:gap-2 transition-all">
              開始 <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- 新增翻譯卡片 -->
        <NuxtLink
          to="/upload/translations/new"
          class="group"
        >
          <div class="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1 13h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">新增翻譯</h2>
            <p class="text-gray-600 text-sm flex-1 mb-4">
              為歌曲標題新增多語言翻譯版本
            </p>
            <div class="flex items-center text-red-500 font-medium text-sm group-hover:gap-2 transition-all">
              開始 <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- 資訊區塊 -->
      <div class="mt-12 bg-white rounded-xl shadow-sm p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">工作流程</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">新增歌曲</h3>
              <p class="text-gray-600 text-sm mt-1">
                首先建立歌曲的基本資訊（標題、藝術家、專輯等），以及 YouTube 影片連結
              </p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">新增歌詞</h3>
              <p class="text-gray-600 text-sm mt-1">
                選擇已建立的歌曲，為其新增多語言歌詞內容
              </p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">新增翻譯</h3>
              <p class="text-gray-600 text-sm mt-1">
                （選填）為歌曲標題新增多語言翻譯版本
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})

useHead({
  title: '上傳管理 - YouTube Music',
})
</script>
