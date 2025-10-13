import { defineStore } from 'pinia'
import type { Song, PlaylistState } from '~/types'

export const usePlayerStore = defineStore('player', {
  state: (): PlaylistState => ({
    currentSong: null,
    isPlaying: false,
    volume: 75,
    progress: 0,
    queue: [],
  }),

  actions: {
    playSong(song: Song) {
      this.currentSong = song
      this.isPlaying = true
    },

    togglePlayPause() {
      this.isPlaying = !this.isPlaying
    },

    setVolume(volume: number) {
      this.volume = Math.max(0, Math.min(100, volume))
    },

    setProgress(progress: number) {
      this.progress = Math.max(0, Math.min(100, progress))
    },

    nextSong() {
      const currentIndex = this.queue.findIndex(s => s.id === this.currentSong?.id)
      if (currentIndex < this.queue.length - 1) {
        this.playSong(this.queue[currentIndex + 1])
      }
    },

    previousSong() {
      const currentIndex = this.queue.findIndex(s => s.id === this.currentSong?.id)
      if (currentIndex > 0) {
        this.playSong(this.queue[currentIndex - 1])
      }
    },

    setQueue(songs: Song[]) {
      this.queue = songs
    },
  },

  getters: {
    hasNextSong(): boolean {
      if (!this.currentSong) return false
      const currentIndex = this.queue.findIndex(s => s.id === this.currentSong?.id)
      return currentIndex < this.queue.length - 1
    },

    hasPreviousSong(): boolean {
      if (!this.currentSong) return false
      const currentIndex = this.queue.findIndex(s => s.id === this.currentSong?.id)
      return currentIndex > 0
    },
  },
})
