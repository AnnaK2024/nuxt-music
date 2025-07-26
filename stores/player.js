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
    // Длительность текущего трека в секундах
    duration: 0,
    // Громкость (0-100)
    volume: 50,
    // Мьют звука
    isMuted: false,
    // Ссылка на аудиотег
    audioRef: null,
  }),

  actions: {
    // Установить текущий трек
    setCurrentTrack(track) {
      this.currentTrack = track;
      this.progress = 0;
      this.duration = 0;
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
      if (this.audioRef) {
        if (isPlaying) {
          this.audioRef.play();
        } else {
          this.audioRef.pause();
        }
      }
    },

    // Установить ссылку на аудиоэлемент
    setAudioRef(element) {
      this.audioRef = element;
      if (this.audioRef) {
        this.audioRef.volume = this.volume / 100;
        this.audioRef.muted = this.isMuted;
        // Можно подписаться на события audioRef, чтобы обновлять прогресс и длительность
        this.audioRef.ontimeupdate = () => {
          if (this.audioRef.duration) {
            this.progress = (this.audioRef.currentTime / this.audioRef.duration) * 100;
            this.duration = this.audioRef.duration;
          }
        };
        this.audioRef.onended = () => {
          this.playNext();
        };
      }
    },

    // Проиграть конкретный трек
    playTrack(track) {
      if (track.id !== this.currentTrack?.id) {
        this.setCurrentTrack(track);
      }
      this.setPlaying(true);
      if (this.audioRef) {
        this.audioRef.src = track.url; // предполагается, что у трека есть поле url
        this.audioRef.play();
      }
    },

    // Переключить воспроизведение (play/pause)
    togglePlay() {
      this.setPlaying(!this.isPlaying);
    },

    // Обновить прогресс воспроизведения (0-100)
    updateProgress(progress) {
      this.progress = progress;
      if (this.audioRef && this.audioRef.duration) {
        this.audioRef.currentTime = (progress / 100) * this.audioRef.duration;
      }
    },

    // Обновить громкость (0-100)
    updateVolume(volume) {
      this.volume = volume;
      if (this.audioRef) {
        this.audioRef.volume = volume / 100;
        this.isMuted = volume === 0;
        this.audioRef.muted = this.isMuted;
      }
    },

    playNext() {
      if (!this.playlist.length) return;
      const currentIndex = this.playlist.findIndex(
        (t) => t.id === this.currentTrack?.id
      );
      const nextIndex = (currentIndex + 1) % this.playlist.length;
      this.playTrack(this.playlist[nextIndex]);
    },

    playPrev() {
      if (!this.playlist.length) return;
      const currentIndex = this.playlist.findIndex(
        (t) => t.id === this.currentTrack?.id
      );
      const prevIndex =
        (currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.playTrack(this.playlist[prevIndex]);
    },
  },
});
