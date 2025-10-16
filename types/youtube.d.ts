// YouTube IFrame API 全域型別擴展
declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady: () => void
  }
}

export {}
