/**
 * YouTube Helper Composable
 * 提供 YouTube 相關的工具函數
 */
export const useYouTube = () => {
  /**
   * 根據 YouTube 影片 ID 取得縮圖 URL
   * @param youtubeId - YouTube 影片 ID
   * @param quality - 縮圖品質 (default: 120x90, mq: 320x180, hq: 480x360, sd: 640x480, maxres: 1280x720)
   */
  const getThumbnail = (
    youtubeId: string | null,
    quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'mq'
  ): string => {
    if (!youtubeId) {
      // 預設佔位圖
      return 'https://via.placeholder.com/320x180?text=No+Thumbnail'
    }
    return `https://i.ytimg.com/vi/${youtubeId}/${quality}default.jpg`
  }

  /**
   * 根據 YouTube 影片 ID 取得影片 URL
   */
  const getVideoUrl = (youtubeId: string | null): string => {
    if (!youtubeId) return ''
    return `https://www.youtube.com/watch?v=${youtubeId}`
  }

  /**
   * 根據 YouTube 影片 ID 取得嵌入 URL
   */
  const getEmbedUrl = (youtubeId: string | null): string => {
    if (!youtubeId) return ''
    return `https://www.youtube.com/embed/${youtubeId}`
  }

  return {
    getThumbnail,
    getVideoUrl,
    getEmbedUrl,
  }
}
