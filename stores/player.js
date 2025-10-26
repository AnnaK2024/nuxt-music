import { defineStore } from "pinia";
import { formatTime } from "~/utils/time";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    progress: 0, // 0..100
    currentTime: 0, // seconds
    duration: 0, // seconds
    volume: 50,
    audioRef: null,
    isRepeat: false,
    isShuffle: false,
    isRepeatPlaylist: false,
  }),

  getters: {
    // Форматированное текущее время
    formattedCurrentTime(state) {
      return formatTime(state.currentTime);
    },

    // Форматированная длительность трека
    formattedDuration(state) {
      return formatTime(state.duration);
    },
    hasNext(state) {
      if (!state.playlist.length) return false;
      if (state.isShuffle || state.isRepeatPlaylist) return true;
      const currentIndex = state.playlist.findIndex(
        (t) => t.id === state.currentTrack?.id
      );
      return currentIndex !== -1 && currentIndex < state.playlist.length - 1;
    },
    currentIndex(state) {
      return state.playlist.findIndex((t) => t.id === state.currentTrack?.id);
    },
    currentTrackIndexOrZero(state) {
      const idx = state.playlist.findIndex(
        (t) => t.id === state.currentTrack?.id
      );
      return idx === -1 ? 0 : idx;
    },
  },

  actions: {
    // Инициализируем audio-элемент (вызывается из PlayerBar once)
    initAudio(audioElement) {
      if (!audioElement) return;
      this.audioRef = audioElement;
      this.audioRef.volume = this.volume / 100;

      this.audioRef.addEventListener("loadedmetadata", () => {
        this.duration = Math.floor(this.audioRef.duration || 0);
      });

      this.audioRef.addEventListener("error", (ev) => {
        console.error("audio element error", ev, this.audioRef.error);
      });

      // Слушатели
      this.audioRef.addEventListener("timeupdate", () => {
        const realCurrentTime = this.audioRef.currentTime;

        this.currentTime = Math.floor(realCurrentTime);

        this.duration = Math.floor(this.audioRef.duration || 0);

        this.progress = this.duration
          ? (realCurrentTime / this.duration) * 100
          : 0;
      });

      this.audioRef.addEventListener("ended", () => {
        console.log("audio.ended", { currentTrackId: this.currentTrack?.id });
        // Если repeat — повторяем текущий трек
        if (this.isRepeat) {
          this.seekToPercent(0);
          this.play();
          return;
        }
        // Иначе пытаемся перейти к следующему
        this.playNext();
      });
      // Если currentTrack уже установлен — подхватываем его в audio
      if (this.currentTrack && this.currentTrack.url) {
        try {
          this.audioRef.src = this.currentTrack.url;
          this.audioRef.load();
          // Попытаться воспроизвести если флаг isPlaying был true
          if (this.isPlaying) {
            this.audioRef
              .play()
              .then(() => this.setPlaying(true))
              .catch(() => this.setPlaying(false));
          }
        } catch (e) {
          console.warn("initAudio: не удалось установить src:", e);
        }
      }
    },

    // Устанавливаем playlist. Сохраняем currentTrack если он есть в новом списке.
    setPlaylist(tracks = [], startIndex = 0) {
      this.playlist = Array.isArray(tracks) ? tracks.slice() : [];
      if (this.playlist.length) {
        // При установке плейлиста явно выбираем track по startIndex:
        this.setCurrentTrackByIndex(startIndex);
      } else {
        this.setCurrentTrack(null);
      }
    },

    // Установить текущий трек по объекту
    setCurrentTrack(track) {
      // безопасно
      if (!track) {
        this.currentTrack = null;
        if (this.audioRef) {
          this.audioRef.pause();
          this.audioRef.src = "";
          this.audioRef.load();
        }
        this.setPlaying(false);
        return;
      }

      // Найти трек в плейлисте (если есть) и установить
      const found = this.playlist.find((t) => t.id === track.id) || track;
      this.currentTrack = found;

      // Нормализуем поле с url (поддерживаем несколько вариантов)
      const src =
        found.url ||
        found.track_file ||
        found.trackFile ||
        found.file ||
        found.src ||
        "";

      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef.currentTime = 0;

        if (src) {
          // Если относительный путь — привести к абсолютному, если нужно
          try {
            this.audioRef.src = new URL(src, window.location.href).href;
          } catch {
            this.audioRef.src = src;
          }
          this.audioRef.load();
        } else {
          this.audioRef.pause();
          this.audioRef.src = "";
          this.audioRef.load();
        }
      }
    },

    // Установить текущий трек по индексу в playlist
    setCurrentTrackByIndex(index) {
      if (!this.playlist.length) {
        this.currentTrack = null;
        return;
      }
      const idx = Math.max(0, Math.min(index, this.playlist.length - 1));
      this.setCurrentTrack(this.playlist[idx]);
    },

    // Воспроизвести / поставить на паузу
    play() {
      console.log("playerStore.play", {
        currentTrackId: this.currentTrack?.id,
        isPlayingBefore: this.isPlaying,
      });
      if (!this.audioRef) {
        console.warn("play(): audioRef отсутствует");
        return;
      }
      if (!this.currentTrack && this.playlist.length) {
        this.setCurrentTrackByIndex(0);
      }

      console.log(
        "play: src=",
        this.audioRef?.src,
        "currentTrack=",
        this.currentTrack
      );

      this.audioRef
        .play()
        .then(() => {
          this.setPlaying(true);
        })
        .catch((err) => {
          console.warn("audio.play() failed:", err);
          // браузер мог блокировать autoplay — показываем корректный флаг
          this.setPlaying(false);
        });
    },

    pause() {
      if (!this.audioRef) return;
      this.audioRef.pause();
      this.setPlaying(false);
    },

    setPlaying(value) {
      this.isPlaying = !!value;
    },

    // Воспроизвести трек по индексу в текущем плейлисте
    playTrackByIndex(index) {
      this.setCurrentTrackByIndex(index);
      this.play();
    },

    // Переход к следующему треку
    playNext() {
      console.log("playerStore.playNext", {
        isShuffle: this.isShuffle,
        isRepeatPlaylist: this.isRepeatPlaylist,
        playlistLength: this.playlist.length,
      });
      if (!this.playlist.length) return;

      if (this.isShuffle) {
        const randomIndex = Math.floor(Math.random() * this.playlist.length);
        this.setCurrentTrackByIndex(randomIndex);
        this.play();
        return;
      }

      const currentIndex = this.playlist.findIndex(
        (t) => t.id === this.currentTrack?.id
      );
      if (currentIndex === -1) {
        this.setCurrentTrackByIndex(0);
        this.play();
        return;
      }

      if (this.isRepeatPlaylist) {
        const nextIndex = (currentIndex + 1) % this.playlist.length;
        this.setCurrentTrackByIndex(nextIndex);
        this.play();
      } else {
        if (currentIndex < this.playlist.length - 1) {
          this.setCurrentTrackByIndex(currentIndex + 1);
          this.play();
        } else {
          // конец — останавливаем
          this.pause();
          // можно: this.setCurrentTrack(null)
        }
      }
    },

    // Предыдущий трек
    playPrev() {
      if (!this.playlist.length) return;
      const currentIndex = this.playlist.findIndex(
        (t) => t.id === this.currentTrack?.id
      );
      const prevIndex =
        currentIndex <= 0 ? this.playlist.length - 1 : currentIndex - 1;
      this.setCurrentTrackByIndex(prevIndex);
      this.play();
    },

    // Скидывает прогресс / seek
    seekToPercent(percent) {
      if (!this.audioRef || !this.audioRef.duration) return;
      const sec = (percent / 100) * this.audioRef.duration;
      this.audioRef.currentTime = sec;
      this.currentTime = Math.floor(sec);
      this.progress = percent;
    },

    setVolume(volume) {
      this.volume = Math.max(0, Math.min(100, Number(volume)));
      if (this.audioRef) this.audioRef.volume = this.volume / 100;
    },

    // Тогглы
    toggleRepeat() {
      this.isRepeat = !this.isRepeat;
    },
    toggleRepeatPlaylist() {
      this.isRepeatPlaylist = !this.isRepeatPlaylist;
    },
    toggleShuffle() {
      this.isShuffle = !this.isShuffle;
    },
  },
});
