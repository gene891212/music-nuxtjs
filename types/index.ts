export interface Song {
  id: number
  title: string
  artist: string
  duration: number // in seconds
  album: string
  thumbnail: string
  videoUrl?: string
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

export interface PlaylistState {
  currentSong: Song | null
  isPlaying: boolean
  volume: number
  progress: number
  queue: Song[]
}

export interface LyricLine {
  time: number // in seconds
  text: string
}
