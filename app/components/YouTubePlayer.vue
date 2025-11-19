<script setup lang="ts">
/// <reference types="youtube" />
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  videoId: {
    type: String,
    default: undefined,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['ready', 'stateChange', 'error'])

const { initPlayer, play, pause, loadVideoById, destroy } = useYouTubePlayer()

const playerContainerId = ref('youtube-player')
const player = ref<YT.Player | null>(null)
const isReady = ref(false)

// 初始化播放器
onMounted(async () => {
  if (!props.videoId) return

  try {
    player.value = await initPlayer(playerContainerId.value, props.videoId, {
      onReady: (event: YT.PlayerEvent) => {
        isReady.value = true
        emit('ready', event.target)

        // 如果需要自動播放
        if (props.autoplay) {
          play()
        }
      },
      onStateChange: (event: YT.OnStateChangeEvent) => {
        const state = event.data
        emit('stateChange', state)
      },
      onError: (event: YT.OnErrorEvent) => {
        console.error('YouTube Player Error:', event)
        emit('error', event)
      },
    })
  } catch (error) {
    console.error('Failed to initialize YouTube player:', error)
  }
})

// 清理
onBeforeUnmount(() => {
  destroy()
})

// 監聽 videoId 變化
watch(
  () => props.videoId,
  newVideoId => {
    if (newVideoId && isReady.value) {
      loadVideoById(newVideoId)
    }
  }
)

// 暴露給父元件的方法
defineExpose({
  player,
  isReady,
  play,
  pause,
})
</script>

<template>
  <ClientOnly>
    <div class="youtube-player-wrapper w-full h-full">
      <div :id="playerContainerId" class="w-full h-full" />
    </div>
    <template #fallback>
      <div class="w-full h-full bg-gray-900 flex items-center justify-center">
        <div class="text-white text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p>載入播放器中...</p>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.youtube-player-wrapper {
  position: relative;
  background: #000;
}

/* 確保 YouTube iframe 填滿容器 */
.youtube-player-wrapper :deep(iframe) {
  width: 100%;
  height: 100%;
}
</style>
