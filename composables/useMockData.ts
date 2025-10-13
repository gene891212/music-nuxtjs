import type { Song, Album, Category } from '~/types'

export const useMockData = () => {
  const quickPicks: Song[] = [
    {
      id: 1,
      title: '夏日微風',
      artist: 'Kenshi Yonezu 米津玄師',
      duration: 225, // 3:45
      album: 'STRAY SHEEP',
      thumbnail: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 2,
      title: 'あてもなく',
      artist: 'Aimer • 瑞浪次郎',
      duration: 270, // 4:30
      album: 'DAWN',
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 3,
      title: 'メリーゴーランド',
      artist: 'aimyon • 瑞浪次郎',
      duration: 298, // 4:58
      album: 'Marigold',
      thumbnail: 'https://images.unsplash.com/photo-1580656449278-e8381933522c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 4,
      title: 'Avid',
      artist: 'Hiroyuki Sawano 澤野弘之',
      duration: 312, // 5:12
      album: 'PIANOHTA',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 5,
      title: '僕らはそれを愛と呼んだ',
      artist: 'ATARAYO • 瑞浪次郎',
      duration: 235, // 3:55
      album: 'HEART',
      thumbnail: 'https://images.unsplash.com/photo-1542492688-75a823ab9f76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 6,
      title: 'Akuta',
      artist: 'ReoNa • 瑞浪次郎',
      duration: 253, // 4:13
      album: 'HEART',
      thumbnail: 'https://images.unsplash.com/photo-1576514129883-2f1d47a65da6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
  ]

  const newReleases: Album[] = [
    {
      id: 1,
      title: 'Pastoral',
      artist: '聖恩 • Aimer',
      type: 'album',
      image: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 2,
      title: '夏至',
      artist: '聖恩 • YOASOBI',
      type: 'single',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 3,
      title: 'PIANOHTA',
      artist: '聖恩 • Hiroyuki Sawano 澤野弘之',
      type: 'album',
      image: 'https://images.unsplash.com/photo-1542492688-75a823ab9f76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 4,
      title: 'HEART',
      artist: '聖恩 • ReoNa',
      type: 'album',
      image: 'https://images.unsplash.com/photo-1576514129883-2f1d47a65da6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 5,
      title: 'GUILTY CROWN suite',
      artist: 'EP • Hiroyuki Sawano 澤野弘之',
      type: 'EP',
      image: 'https://images.unsplash.com/photo-1580656449278-e8381933522c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 6,
      title: 'Attack on Titan suite',
      artist: 'EP • Hiroyuki Sawano 澤野弘之',
      type: 'EP',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
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
