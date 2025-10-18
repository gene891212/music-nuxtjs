import type { Album, Category } from '~/types'
import type { Database } from '~/types/database.types'

// 使用資料庫的 Song 型別
type Song = Database['public']['Tables']['songs']['Row']

const nowIso = new Date().toISOString()

export const useMockData = () => {
  const quickPicks: Song[] = [
    {
      song_id: 1,
      title: 'Lemon',
      artist: 'Kenshi Yonezu 米津玄師',
      album_title: 'STRAY SHEEP',
      youtube_video_id: 'SX_ViT4Ra7k', // 米津玄師 MV - Lemon
      composer: 'Kenshi Yonezu',
      lyricist: 'Kenshi Yonezu',
      arranger: 'Kenshi Yonezu',
      default_language_code: 'ja',
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      song_id: 2,
      title: 'Sparkle',
      artist: 'RADWIMPS',
      album_title: 'Your Name OST',
      youtube_video_id: 'a2GujJZfXpg', // RADWIMPS - Sparkle
      composer: 'Yojiro Noda',
      lyricist: 'Yojiro Noda',
      arranger: 'RADWIMPS',
      default_language_code: 'ja',
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      song_id: 3,
      title: 'Marigold',
      artist: 'aimyon',
      album_title: 'Marigold',
      youtube_video_id: '0xSiBpUdW4E', // aimyon - Marigold
      composer: 'aimyon',
      lyricist: 'aimyon',
      arranger: null,
      default_language_code: 'ja',
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      song_id: 4,
      title: 'Unravel',
      artist: 'TK from Ling tosite sigure',
      album_title: 'Unravel',
      youtube_video_id: 'QKXi08chD2E', // TK - unravel
      composer: 'TK',
      lyricist: 'TK',
      arranger: 'TK',
      default_language_code: 'ja',
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      song_id: 5,
      title: 'Pretender',
      artist: 'Official HIGE DANdism',
      album_title: 'Traveler',
      youtube_video_id: 'TQ8WlA2GXbk', // Official HIGE DANdism - Pretender
      composer: 'Satoshi Fujihara',
      lyricist: 'Satoshi Fujihara',
      arranger: 'Official HIGE DANdism',
      default_language_code: 'ja',
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      song_id: 6,
      title: 'LOSER',
      artist: 'Kenshi Yonezu 米津玄師',
      album_title: 'Bremen',
      youtube_video_id: 'Dx_fKPBPYUI', // 米津玄師 MV - LOSER
      composer: 'Kenshi Yonezu',
      lyricist: 'Kenshi Yonezu',
      arranger: 'Kenshi Yonezu',
      default_language_code: 'ja',
      created_at: nowIso,
      updated_at: nowIso,
    },
  ]

  const newReleases: Album[] = [
    {
      id: 1,
      title: 'Pastoral',
      artist: '聖恩 • Aimer',
      type: 'album',
      image: 'https://i.ytimg.com/vi/SX_ViT4Ra7k/hqdefault.jpg', // YouTube 縮圖
    },
    {
      id: 2,
      title: '夏至',
      artist: '聖恩 • YOASOBI',
      type: 'single',
      image: 'https://i.ytimg.com/vi/a2GujJZfXpg/hqdefault.jpg',
    },
    {
      id: 3,
      title: 'PIANOHTA',
      artist: '聖恩 • Hiroyuki Sawano 澤野弘之',
      type: 'album',
      image: 'https://i.ytimg.com/vi/0xSiBpUdW4E/hqdefault.jpg',
    },
    {
      id: 4,
      title: 'HEART',
      artist: '聖恩 • ReoNa',
      type: 'album',
      image: 'https://i.ytimg.com/vi/QKXi08chD2E/hqdefault.jpg',
    },
    {
      id: 5,
      title: 'GUILTY CROWN suite',
      artist: 'EP • Hiroyuki Sawano 澤野弘之',
      type: 'EP',
      image: 'https://i.ytimg.com/vi/TQ8WlA2GXbk/hqdefault.jpg',
    },
    {
      id: 6,
      title: 'Attack on Titan suite',
      artist: 'EP • Hiroyuki Sawano 澤野弘之',
      type: 'EP',
      image: 'https://i.ytimg.com/vi/Dx_fKPBPYUI/hqdefault.jpg',
    },
  ]

  const categories: Category[] = [
    { id: 1, name: 'Podcast', slug: 'podcast' },
    { id: 2, name: '重點回顧', slug: 'highlights' },
    { id: 3, name: '放鬆', slug: 'relax' },
    { id: 4, name: '健身', slug: 'workout' },
    { id: 5, name: '好心情', slug: 'happy' },
    { id: 6, name: '悲劇', slug: 'sad' },
    { id: 7, name: '活動', slug: 'events' },
    { id: 8, name: '派對啊', slug: 'party' },
    { id: 9, name: '專注', slug: 'focus' },
    { id: 10, name: '睡覺', slug: 'sleep' },
  ]

  const lyrics = [
    { time: 0, text: '空の青さと君を繋いで' },
    { time: 5, text: '霞む街と君を待ってますまま' },
    { time: 10, text: '' },
    { time: 15, text: '暗いし憧れはもう消えて' },
    { time: 20, text: '醒めの朝を夢を見ぬで' },
    { time: 25, text: '' },
    { time: 30, text: 'ねえ 今思ってて 出口' },
    { time: 35, text: '積みかさ 記憶なるまま前に' },
    { time: 40, text: '繋がり見つめて手て' },
  ]

  return {
    quickPicks,
    newReleases,
    categories,
    lyrics,
  }
}
