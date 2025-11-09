import type { Database } from '~/types/database.types'

/**
 * Supabase Database Composable
 * 提供型別安全的資料庫操作方法
 */
export const useDatabase = () => {
  const supabase = useSupabaseClient<Database>()

  /**
   * 獲取所有歌曲
   */
  const getSongs = async () => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('song_id', { ascending: false })

    if (error) {
      console.error('獲取歌曲失敗:', error)
      return []
    }

    // 確保返回的一定是陣列
    return data || []
  }

  /**
   * 根據 ID 獲取單一歌曲及其翻譯和歌詞
   */
  const getSongById = async (songId: number) => {
    const { data, error } = await supabase
      .from('songs')
      .select(`
        *,
        song_translations (*),
        lyrics (*)
      `)
      .eq('song_id', songId)
      .single()

    if (error) {
      console.error('獲取歌曲失敗:', error)
      return null
    }

    return data
  }

  /**
   * 根據語言代碼獲取歌曲翻譯
   */
  const getSongTranslation = async (songId: number, languageCode: string) => {
    const { data, error } = await supabase
      .from('song_translations')
      .select('*')
      .eq('song_id', songId)
      .eq('language_code', languageCode)
      .single()

    if (error) {
      console.error('獲取翻譯失敗:', error)
      return null
    }

    return data
  }

  /**
   * 根據語言代碼獲取歌詞
   */
  const getLyrics = async (songId: number, languageCode: string) => {
    const { data, error } = await supabase
      .from('lyrics')
      .select('*')
      .eq('song_id', songId)
      .eq('language_code', languageCode)
      .order('created_at', { ascending: false }) // 取最新的
      .limit(1)

    if (error) {
      console.error('獲取歌詞失敗:', error)
      return null
    }

    // 如果有資料，返回第一筆（最新的）
    return data && data.length > 0 ? data[0] : null
  }

  /**
   * 獲取歌曲的所有可用語言
   */
  const getAvailableLanguages = async (songId: number) => {
    const { data, error } = await supabase
      .from('lyrics')
      .select('language_code')
      .eq('song_id', songId)

    if (error) {
      console.error('獲取可用語言失敗:', error)
      return []
    }

    // 去重並返回語言代碼數組
    return data ? [...new Set(data.map(l => l.language_code))] : []
  }

  /**
   * 獲取標題翻譯的所有可用語言
   */
  const getAvailableTitleLanguages = async (songId: number) => {
    const { data, error } = await supabase
      .from('song_translations')
      .select('language_code')
      .eq('song_id', songId)

    if (error) {
      console.error('獲取標題翻譯語言失敗:', error)
      return []
    }

    // 去重並返回語言代碼數組
    return data ? [...new Set(data.map(t => t.language_code))] : []
  }

  /**
   * 搜尋歌曲（根據藝術家或專輯標題）
   */
  const searchSongs = async (keyword: string) => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .or(`artist.ilike.%${keyword}%,album_title.ilike.%${keyword}%`)

    if (error) {
      console.error('搜尋歌曲失敗:', error)
      return []
    }

    return data
  }

  /**
   * 建立新歌曲
   */
  const createSong = async (song: Database['public']['Tables']['songs']['Insert']) => {
    const { data, error } = await supabase
      .from('songs')
      .insert([song])
      .select()
      .single()

    if (error) {
      console.error('建立歌曲失敗:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  /**
   * 更新歌曲資訊
   */
  const updateSong = async (songId: number, song: Database['public']['Tables']['songs']['Update']) => {
    const { data, error } = await supabase
      .from('songs')
      .update(song)
      .eq('song_id', songId)
      .select()
      .single()

    if (error) {
      console.error('更新歌曲失敗:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  /**
   * 刪除歌曲及相關資料
   */
  const deleteSong = async (songId: number) => {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('song_id', songId)

    if (error) {
      console.error('刪除歌曲失敗:', error)
      return { error }
    }

    return { error: null }
  }

  /**
   * 新增歌曲翻譯
   */
  const addSongTranslation = async (translation: Database['public']['Tables']['song_translations']['Insert']) => {
    const { data, error } = await supabase
      .from('song_translations')
      .insert([translation])
      .select()
      .single()

    if (error) {
      console.error('新增翻譯失敗:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  /**
   * 新增歌詞
   */
  const addLyrics = async (lyrics: Database['public']['Tables']['lyrics']['Insert']) => {
    const { data, error } = await supabase
      .from('lyrics')
      .insert([lyrics])
      .select()
      .single()

    if (error) {
      console.error('新增歌詞失敗:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  /**
   * 更新歌詞
   */
  const updateLyrics = async (lyricId: number, lyrics: Database['public']['Tables']['lyrics']['Update']) => {
    const { data, error } = await supabase
      .from('lyrics')
      .update(lyrics)
      .eq('lyrics_id', lyricId)
      .select()
      .single()

    if (error) {
      console.error('更新歌詞失敗:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  /**
   * 刪除歌詞
   */
  const deleteLyrics = async (lyricId: number) => {
    const { error } = await supabase
      .from('lyrics')
      .delete()
      .eq('lyrics_id', lyricId)

    if (error) {
      console.error('刪除歌詞失敗:', error)
      return { error }
    }

    return { error: null }
  }

  /**
   * 根據歌曲 ID 取得所有翻譯
   */
  const getSongTranslations = async (songId: number) => {
    const { data, error } = await supabase
      .from('song_translations')
      .select('*')
      .eq('song_id', songId)
      .order('language_code', { ascending: true })

    if (error) {
      console.error('獲取翻譯失敗:', error)
      return []
    }

    return data || []
  }

  return {
    getSongs,
    getSongById,
    getSongTranslation,
    getSongTranslations,
    getLyrics,
    getAvailableLanguages,
    getAvailableTitleLanguages,
    searchSongs,
    createSong,
    updateSong,
    deleteSong,
    addSongTranslation,
    addLyrics,
    updateLyrics,
    deleteLyrics,
  }
}
