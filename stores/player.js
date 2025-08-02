import { defineStore } from "pinia";

// В state помещены только данные
// В actions помещены методы, которые управляют данными в state, меняют их или сбрасывают.

export const usePlayerStore = defineStore("player", {
  state: () => ({
    // Текущий трек
    currentTrack: null,
    // Список треков
    playlist: [],
    // Играет ли сейчас
    isPlaying: false,
    // Прогресс воспроизведения (0-100)
    progress: 0,
    // Громкость (0-100)
    volume: 50,
    // Ссылка на аудиотег
    audioRef: null,
    // режим повторения
    isRepeat: false,
    // режим перемешивания
    isShuffle: false,
  }),

  actions: {
    // Установить текущий трек
    setCurrentTrack(track) {
      this.currentTrack = track;
    },

    // Установить плейлист
    setPlaylist(tracks) {
      this.playlist = tracks;
    },

    // Установить прогресс
    setProgress(progress) {
      this.progress = progress;
    },

    // Установить громкость
    setVolume(volume) {
      this.volume = volume;
      if (this.audioRef) {
        this.audioRef.volume = volume / 100;
      }
    },

    // Установить состояние воспроизведения
    setPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },

    // Установить ссылку на аудиоэлемент
    setAudioRef(audioElement) {
      this.audioRef = audioElement;
      if (this.audioRef) {
        this.audioRef.volume = this.volume / 100;
      }
    },

    toggleRepeat() {
      this.isRepeat = !this.isRepeat;
    },

    toggleShuffle() {
      this.isShuffle = !this.isShuffle;
    },

    playNext() {
      if (!this.playlist.length) return;
      if (this.isShuffle) {
        // случайный трек
        const randomIndex = Math.floor(Math.random() * this.playlist.length);
        this.currentTrack = this.playlist[randomIndex];
      } else {
        // следующий по порядку
        const currentIndex = this.playlist.findIndex(
          (t) => t.id === this.currentTrack?.id
        );
        const nextIndex = (currentIndex + 1) % this.playlist.length;
        this.currentTrack = this.playlist[nextIndex];
      }
    },
    
    playPrev() {
      if (!this.playlist.length) return;
      const currentIndex = this.playlist.findIndex(
        (t) => t.id === this.currentTrack?.id
      );
      const prevIndex =
        (currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.currentTrack = this.playlist[prevIndex];
    },
  },
});
