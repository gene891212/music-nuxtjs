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

    return data
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
      .single()

    if (error) {
      console.error('獲取歌詞失敗:', error)
      return null
    }

    return data
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

  return {
    getSongs,
    getSongById,
    getSongTranslation,
    getLyrics,
    searchSongs,
  }
}
