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
    const { data: songs, error } = await supabase.from('songs').select('*')

    if (error) {
      throw new Error(`Failed to fetch songs: ${error.message}`)
    }
    return songs ?? []
  }

  /**
   * 根據 ID 獲取單一歌曲及其翻譯和歌詞
   */
  const getSongById = async (songId: number) => {
    const { data: song, error } = await supabase
      .from('songs')
      .select(
        `
        *,
        song_translations (*),
        lyrics (*)
      `
      )
      .eq('song_id', songId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch song by id: ${error.message}`)
    }
    return song
  }

  /**
   * 根據語言代碼獲取歌曲翻譯
   */
  const getSongTranslation = async (songId: number, languageCode: string) => {
    const { data: translation, error } = await supabase
      .from('song_translations')
      .select('*')
      .eq('song_id', songId)
      .eq('language_code', languageCode)
      .single()

    if (error) {
      throw new Error(`Failed to fetch song translation: ${error.message}`)
    }
    return translation
  }

  /**
   * 根據語言代碼獲取歌詞
   */
  const getLyrics = async (songId: number, languageCode: string) => {
    const { data: lyrics, error } = await supabase
      .from('lyrics')
      .select('*')
      .eq('song_id', songId)
      .eq('language_code', languageCode)
      .order('created_at', { ascending: false }) // 取最新的
      .limit(1)

    if (error) {
      throw new Error(`Failed to fetch lyrics: ${error.message}`)
    }
    // 如果有資料，返回第一筆（最新的）
    return lyrics?.[0] ?? null
  }

  /**
   * 獲取歌曲的所有可用語言
   */
  const getAvailableLanguages = async (songId: number) => {
    const { data: records, error } = await supabase
      .from('lyrics')
      .select('language_code')
      .eq('song_id', songId)

    if (error) {
      throw new Error(`Failed to fetch available languages: ${error.message}`)
    }

    return records ? [...new Set(records.map(r => r.language_code))] : []
  }

  /**
   * 獲取標題翻譯的所有可用語言
   */
  const getAvailableTitleLanguages = async (songId: number) => {
    const { data: records, error } = await supabase
      .from('song_translations')
      .select('language_code')
      .eq('song_id', songId)

    if (error) {
      throw new Error(`Failed to fetch available title languages: ${error.message}`)
    }

    return records ? [...new Set(records.map(r => r.language_code))] : []
  }

  /**
   * 搜尋歌曲（根據藝術家或專輯標題）
   */
  const searchSongs = async (keyword: string) => {
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .or(`title.ilike.%${keyword}%,artist.ilike.%${keyword}%,album.ilike.%${keyword}%`)

    if (error) {
      throw new Error(`Failed to search songs: ${error.message}`)
    }
    return songs ?? []
  }

  /**
   * 建立新歌曲
   */
  const createSong = async (song: Database['public']['Tables']['songs']['Insert']) => {
    const { data, error } = await supabase.from('songs').insert(song).select().single()

    if (error) {
      throw new Error(`Failed to create song: ${error.message}`)
    }
    return data
  }

  /**
   * 更新歌曲資訊
   */
  const updateSong = async (
    songId: number,
    song: Database['public']['Tables']['songs']['Update']
  ) => {
    const { data, error } = await supabase
      .from('songs')
      .update(song)
      .eq('song_id', songId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update song: ${error.message}`)
    }
    return data
  }

  /**
   * 刪除歌曲及相關資料
   */
  const deleteSong = async (songId: number) => {
    const { error } = await supabase.from('songs').delete().eq('song_id', songId)

    if (error) {
      throw new Error(`Failed to delete song: ${error.message}`)
    }
  }

  /**
   * 新增歌曲翻譯
   */
  const addSongTranslation = async (
    translation: Database['public']['Tables']['song_translations']['Insert']
  ) => {
    const { data, error } = await supabase
      .from('song_translations')
      .insert(translation)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add song translation: ${error.message}`)
    }
    return data
  }

  /**
   * 新增歌詞
   */
  const addLyrics = async (lyrics: Database['public']['Tables']['lyrics']['Insert']) => {
    const { data, error } = await supabase.from('lyrics').insert(lyrics).select().single()

    if (error) {
      throw new Error(`Failed to add lyrics: ${error.message}`)
    }
    return data
  }

  /**
   * 更新歌詞
   */
  const updateLyrics = async (
    lyricId: number,
    lyrics: Database['public']['Tables']['lyrics']['Update']
  ) => {
    const { data, error } = await supabase
      .from('lyrics')
      .update(lyrics)
      .eq('lyrics_id', lyricId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update lyrics: ${error.message}`)
    }
    return data
  }

  /**
   * 刪除歌詞
   */
  const deleteLyrics = async (lyricId: number) => {
    const { error } = await supabase.from('lyrics').delete().eq('lyrics_id', lyricId)

    if (error) {
      throw new Error(`Failed to delete lyrics: ${error.message}`)
    }
  }

  /**
   * 根據歌曲 ID 取得所有翻譯
   */
  const getSongTranslations = async (songId: number) => {
    const { data: translations, error } = await supabase
      .from('song_translations')
      .select('*')
      .eq('song_id', songId)

    if (error) {
      throw new Error(`Failed to fetch song translations: ${error.message}`)
    }
    return translations ?? []
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
