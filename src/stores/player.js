import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '../includes/helper'

export const usePlayerStore = defineStore('player', () => {
  const current_song = ref({})
  const sound = ref({})
  const seek = ref('00:00')
  const duration = ref('00:00')
  const playerProgress = ref('0%')

  async function newSong(song) {
    if (sound.value instanceof Howl) {
      sound.value.unload()
    }

    current_song.value = song

    sound.value = new Howl({
      src: [song.url],
      html5: true
    })

    sound.value.play()

    sound.value.on('play', () => {
      requestAnimationFrame(progress)
    })
  }

  async function toggleAudio() {
    if (!sound.value.playing) {
      return
    }

    if (sound.value.playing()) {
      sound.value.pause()
    } else {
      sound.value.play()
    }
  }

  function progress() {
    seek.value = helper.formatTime(sound.value.seek())
    duration.value = helper.formatTime(sound.value.duration())

    playerProgress.value = `${(sound.value.seek() / sound.value.duration()) * 100}%`

    if (sound.value.playing()) {
      requestAnimationFrame(progress)
    }
  }

  function updateSeek(event) {
    if (!sound.value.playing) {
      return
    }

    const { x, width } = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - x
    const percentage = clickX / width
    const seconds = sound.value.duration() * percentage

    sound.value.seek(seconds)
    // sound.value.once('seek', progress)
    toggleAudio()
  }

  const playing = computed(() => {
    if (sound.value.playing) {
      return sound.value.playing()
    }
    return false
  })

  return {
    current_song,
    sound,
    newSong,
    toggleAudio,
    playing,
    seek,
    duration,
    playerProgress,
    updateSeek
  }
})
