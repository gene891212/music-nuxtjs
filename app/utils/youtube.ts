/**
 * YouTube 工具函數
 */

/**
 * 從 YouTube URL 中提取影片 ID
 * @param url - YouTube URL
 * @returns 影片 ID，如果無法提取則返回空字串
 */
export const extractYouTubeVideoId = (url: string): string => {
  if (!url) return ''

  // YouTube URL regex patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return ''
}

/**
 * 根據 YouTube 影片 ID 取得縮圖 URL
 * @param youtubeId - YouTube 影片 ID
 * @param quality - 縮圖品質 (default: 120x90, mq: 320x180, hq: 480x360, sd: 640x480, maxres: 1280x720)
 */
export const getYouTubeThumbnail = (
  youtubeId: string | null,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'mq'
): string => {
  if (!youtubeId) {
    // 預設佔位圖
    return 'https://via.placeholder.com/320x180?text=No+Thumbnail'
  }
  const qualityPrefix = quality === 'default' ? '' : quality
  return `https://i.ytimg.com/vi_webp/${youtubeId}/${qualityPrefix}default.webp`
}

/**
 * 根據 YouTube 影片 ID 取得影片 URL
 */
export const getYouTubeVideoUrl = (youtubeId: string | null): string => {
  if (!youtubeId) return ''
  return `https://www.youtube.com/watch?v=${youtubeId}`
}

/**
 * 根據 YouTube 影片 ID 取得嵌入 URL
 */
export const getYouTubeEmbedUrl = (youtubeId: string | null): string => {
  if (!youtubeId) return ''
  return `https://www.youtube.com/embed/${youtubeId}`
}
