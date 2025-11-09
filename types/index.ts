export interface Song {
  id: number
  title: string
  artist: string
  duration: number // in seconds
  album: string
  thumbnail: string
  videoUrl?: string
  youtubeId?: string // YouTube 影片 ID
  titlePayload?: TitlePayload | null
}

export interface Album {
  id: number
  title: string
  artist: string
  type: 'album' | 'EP' | 'single'
  image: string
  releaseYear?: number
}

export interface Category {
  id: number
  name: string
  slug: string
}

/**
 * Ruby 注音標記（用於日文假名等）
 * @example { s: 0, e: 1, rt: "ひら" } 表示文字索引 0-1 的注音是 "ひら"
 */
export interface RubyAnnotation {
  /** 起始字元索引（包含） */
  s: number
  /** 結束字元索引（不包含） */
  e: number
  /** 注音文字（ruby text） */
  rt: string
}

/**
 * 歌詞行（資料庫儲存格式）
 * 包含時間軸和可選的 Ruby 注音
 */
export interface LyricsLine {
  /** 歌詞文本 */
  text: string
  /** 開始時間（毫秒） */
  start_ms?: number
  /** 結束時間（毫秒），可能為 null */
  end_ms?: number | null
  /** Ruby 注音標記（可選，主要用於日文） */
  ruby?: RubyAnnotation[]
}

/**
 * 歌詞資料結構（資料庫 payload 欄位）
 */
export interface LyricsPayload {
  lines: LyricsLine[]
}

/**
 * 標題資料結構（資料庫 payload 欄位）
 */
export interface TitlePayload {
  text: string
  ruby?: RubyAnnotation[]
}
