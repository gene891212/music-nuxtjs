/// <reference types="youtube" />
import { ref } from 'vue'

// YouTube IFrame API 載入狀態
const isYouTubeAPIReady = ref(false)
const isYouTubeAPILoading = ref(false)

// 全域的 API 就緒 Promise
let apiReadyPromise: Promise<void> | null = null

/**
 * 載入 YouTube IFrame API
 * 確保只載入一次，並使用 Promise 追蹤載入狀態
 */
export function useYouTubeAPI() {
  const loadYouTubeAPI = (): Promise<void> => {
    // 如果已經載入完成
    if (isYouTubeAPIReady.value) {
      return Promise.resolve()
    }

    // 如果正在載入中，返回現有的 Promise
    if (apiReadyPromise) {
      return apiReadyPromise
    }

    // 開始載入
    isYouTubeAPILoading.value = true

    apiReadyPromise = new Promise((resolve) => {
      // 檢查 API 是否已經被載入
      if (window.YT && window.YT.Player) {
        isYouTubeAPIReady.value = true
        isYouTubeAPILoading.value = false
        resolve()
        return
      }

      // 設定全域回調函數
      window.onYouTubeIframeAPIReady = () => {
        isYouTubeAPIReady.value = true
        isYouTubeAPILoading.value = false
        resolve()
      }

      // 動態載入 YouTube IFrame API script
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      } else {
        document.head.appendChild(tag)
      }
    })

    return apiReadyPromise
  }

  return {
    loadYouTubeAPI,
    isYouTubeAPIReady,
    isYouTubeAPILoading,
  }
}

/**
 * YouTube Player Composable
 * 管理 YouTube Player 實例的生命週期
 */
export function useYouTubePlayer() {
  const player = ref<YT.Player | null>(null)
  const playerState = ref<YT.PlayerState | null>(null)
  const duration = ref(0)
  const currentTime = ref(0)

  /**
   * 初始化 YouTube Player
   */
  const initPlayer = async (
    elementId: string,
    videoId: string,
    options?: {
      onReady?: (event: YT.PlayerEvent) => void
      onStateChange?: (event: YT.OnStateChangeEvent) => void
      onError?: (event: YT.OnErrorEvent) => void
    }
  ): Promise<YT.Player> => {
    const { loadYouTubeAPI } = useYouTubeAPI()
    
    // 確保 API 已載入
    await loadYouTubeAPI()

    return new Promise((resolve) => {
      player.value = new YT.Player(elementId, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1, // 顯示 YouTube 預設控制列（包含音量、時間軸）
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 1, // 允許全螢幕
          enablejsapi: 1,
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            duration.value = event.target.getDuration()
            options?.onReady?.(event)
            resolve(event.target)
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            playerState.value = event.data
            if (event.data === YT.PlayerState.PLAYING) {
              duration.value = event.target.getDuration()
            }
            options?.onStateChange?.(event)
          },
          onError: options?.onError,
        },
      })
    })
  }

  /**
   * 播放影片
   */
  const play = () => {
    player.value?.playVideo()
  }

  /**
   * 暫停影片
   */
  const pause = () => {
    player.value?.pauseVideo()
  }

  /**
   * 停止影片
   */
  const stop = () => {
    player.value?.stopVideo()
  }

  /**
   * 設定音量 (0-100)
   */
  const setVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume))
    player.value?.setVolume(clampedVolume)
  }

  /**
   * 取得音量
   */
  const getVolume = (): number => {
    return player.value?.getVolume() ?? 0
  }

  /**
   * 設定靜音
   */
  const mute = () => {
    player.value?.mute()
  }

  /**
   * 取消靜音
   */
  const unMute = () => {
    player.value?.unMute()
  }

  /**
   * 跳轉到指定時間 (秒)
   */
  const seekTo = (seconds: number) => {
    player.value?.seekTo(seconds, true)
  }

  /**
   * 載入新影片
   */
  const loadVideoById = (videoId: string) => {
    player.value?.loadVideoById(videoId)
  }

  /**
   * 取得當前播放時間
   */
  const getCurrentTime = (): number => {
    return player.value?.getCurrentTime() ?? 0
  }

  /**
   * 取得影片總長度
   */
  const getDuration = (): number => {
    return player.value?.getDuration() ?? 0
  }

  /**
   * 取得播放狀態
   */
  const getPlayerState = (): YT.PlayerState | undefined => {
    return player.value?.getPlayerState()
  }

  /**
   * 銷毀 Player
   */
  const destroy = () => {
    player.value?.destroy()
    player.value = null
  }

  return {
    player,
    playerState,
    duration,
    currentTime,
    initPlayer,
    play,
    pause,
    stop,
    setVolume,
    getVolume,
    mute,
    unMute,
    seekTo,
    loadVideoById,
    getCurrentTime,
    getDuration,
    getPlayerState,
    destroy,
  }
}
