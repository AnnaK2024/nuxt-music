import { defineStore } from "pinia";

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
    },

    // Установить состояние воспроизведения
    setPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },

    // Установить ссылку на аудиоэлемент
    setAudioRef(element) {
      this.audioRef = element;
      if (this.audioRef) {
        this.audioRef.volume = this.volume / 100;
      }
    },

    playNext() {
      if (!this.playlist.length) return;
      const currentIndex = this.playlist.findIndex(
        (t) => t.id === this.currentTrack?.id
      );
      const nextIndex = (currentIndex + 1) % this.playlist.length;
      this.setCurrentTrack(this.playlist[nextIndex]);
    },

    playPrev() {
      if (!this.playlist.length) return;
      const currentIndex = this.playlist.findIndex(
        (t) => t.id === this.currentTrack?.id
      );
      const prevIndex =
        (currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.setCurrentTrack(this.playlist[prevIndex]);
    },
  },
});
