import { defineStore } from "pinia";
import { formatTime } from "~/utils/time";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    progress: 0,
    currentTime: 0,
    duration: 0,
    volume: 50,
    audioRef: null,
    isRepeat: false,
    isShuffle: false,
    isRepeatPlaylist: false,
    playlistContext: null,
  }),

  getters: {
    formattedCurrentTime(state) {
      return formatTime(state.currentTime);
    },

    formattedDuration(state) {
      return formatTime(state.duration);
    },

    hasNext(state) {
      if (!state.playlist.length) return false;
      if (state.isShuffle || state.isRepeatPlaylist) return true;
      const currentIndex = state.playlist.findIndex((t) =>
        this._compareIds(
          this._getTrackId(t),
          this._getTrackId(state.currentTrack)
        )
      );
      return currentIndex !== -1 && currentIndex < state.playlist.length - 1;
    },

    currentIndex(state) {
      return state.playlist.findIndex((t) =>
        this._compareIds(
          this._getTrackId(t),
          this._getTrackId(state.currentTrack)
        )
      );
    },

    currentTrackIndexOrZero(state) {
      const idx = state.playlist.findIndex((t) =>
        this._compareIds(
          this._getTrackId(t),
          this._getTrackId(state.currentTrack)
        )
      );
      return idx === -1 ? 0 : idx;
    },

    isCurrentTrackInPlaylist(state) {
      if (!state.currentTrack || !state.playlist.length) return false;
      return state.playlist.some((t) =>
        this._compareIds(
          this._getTrackId(t),
          this._getTrackId(state.currentTrack)
        )
      );
    },
  },

  actions: {
    // ✨ ИСПРАВЛЕНО: Приоритет на _id
    _getTrackId(track) {
      return (
        track?._id || track?.id || track?.trackId || track?.track_id || null
      );
    },

    // ✨ Сравнить ID
    _compareIds(id1, id2) {
      if (!id1 || !id2) return false;
      return String(id1) === String(id2);
    },

    // ✨ Получить URL трека
    _getTrackSrc(track) {
      return (
        track?.url ||
        track?.track_file ||
        track?.trackFile ||
        track?.file ||
        track?.src ||
        ""
      );
    },

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

      this.audioRef.addEventListener("timeupdate", () => {
        const realCurrentTime = this.audioRef.currentTime;
        this.currentTime = Math.floor(realCurrentTime);
        this.duration = Math.floor(this.audioRef.duration || 0);
        this.progress = this.duration
          ? (realCurrentTime / this.duration) * 100
          : 0;
      });

      this.audioRef.addEventListener("ended", () => {
        console.log("audio.ended", {
          currentTrackId: this._getTrackId(this.currentTrack),
        });
        if (this.isRepeat) {
          this.seekToPercent(0);
          this.play();
          return;
        }
        this.playNext();
      });

      if (this.currentTrack) {
        const src = this._getTrackSrc(this.currentTrack);
        if (src) {
          try {
            this.audioRef.src = src;
            this.audioRef.load();
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
      }
    },

    // ✅ Установка плейлиста
    setPlaylist(tracks, context = null) {
      this.playlist = tracks || [];
      this.playlistContext = context;

      console.log("setPlaylist", {
        context,
        playlistLength: this.playlist.length,
        currentTrackId: this._getTrackId(this.currentTrack),
      });

      // ✅ Если текущий трек не в новом плейлисте, очищаем его
      const currentTrackId = this._getTrackId(this.currentTrack);
      if (
        this.currentTrack &&
        !this.playlist.find((t) =>
          this._compareIds(this._getTrackId(t), currentTrackId)
        )
      ) {
        console.log("Текущий трек не в новом плейлисте, очищаем");
        this.currentTrack = null;
        this.pause();
        this.progress = 0;
        this.currentTime = 0;
        this.duration = 0;
      }
    },

    // ✨ Установка текущего трека и начало воспроизведения
    playTrack(track) {
      if (!track) return;
      this.setCurrentTrack(track);
      this.play();
    },

    // ✅ Установка текущего трека без воспроизведения
    setCurrentTrack(track) {
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

      this.currentTrack = track;
      const src = this._getTrackSrc(track);

      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef.currentTime = 0;

        if (src) {
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
          console.warn("setCurrentTrack: URL трека не найден", track);
        }
      }

      console.log("setCurrentTrack", {
        trackId: this._getTrackId(track),
        trackTitle: track.name || track.title,
      });
    },

    // ✅ Установить текущий трек по индексу в playlist
    setCurrentTrackByIndex(index) {
      if (!this.playlist.length) {
        this.currentTrack = null;
        return;
      }
      const idx = Math.max(0, Math.min(index, this.playlist.length - 1));
      this.setCurrentTrack(this.playlist[idx]);
    },

    play() {
      console.log("playerStore.play", {
        currentTrackId: this._getTrackId(this.currentTrack),
        isPlayingBefore: this.isPlaying,
      });

      if (!this.audioRef) {
        console.warn("play(): audioRef отсутствует");
        return;
      }

      if (!this.currentTrack && this.playlist.length) {
        console.log("play(): нет текущего трека, устанавливаем первый");
        this.setCurrentTrackByIndex(0);
      }

      if (!this.currentTrack) {
        console.warn("play(): нет текущего трека");
        return;
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

    playTrackByIndex(index) {
      this.setCurrentTrackByIndex(index);
      this.play();
    },

    playNext() {
      console.log("playerStore.playNext", {
        isShuffle: this.isShuffle,
        isRepeatPlaylist: this.isRepeatPlaylist,
        playlistLength: this.playlist.length,
        currentIndex: this.currentIndex,
      });

      if (!this.playlist.length) return;

      if (this.isShuffle) {
        const randomIndex = Math.floor(Math.random() * this.playlist.length);
        this.setCurrentTrackByIndex(randomIndex);
        this.play();
        return;
      }

      const currentTrackId = this._getTrackId(this.currentTrack);
      const currentIndex = this.playlist.findIndex((t) =>
        this._compareIds(this._getTrackId(t), currentTrackId)
      );

      console.log("playNext: currentIndex =", currentIndex);

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
          console.log("playNext: конец плейлиста");
          this.pause();
        }
      }
    },

    playPrev() {
      if (!this.playlist.length) return;

      const currentTrackId = this._getTrackId(this.currentTrack);
      const currentIndex = this.playlist.findIndex((t) =>
        this._compareIds(this._getTrackId(t), currentTrackId)
      );

      console.log("playPrev: currentIndex =", currentIndex);

      if (currentIndex === -1) {
        this.setCurrentTrackByIndex(0);
        this.play();
        return;
      }

      const prevIndex =
        currentIndex <= 0 ? this.playlist.length - 1 : currentIndex - 1;
      this.setCurrentTrackByIndex(prevIndex);
      this.play();
    },

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

    toggleRepeat() {
      this.isRepeat = !this.isRepeat;
    },

    toggleRepeatPlaylist() {
      this.isRepeatPlaylist = !this.isRepeatPlaylist;
    },

    toggleShuffle() {
      this.isShuffle = !this.isShuffle;
    },

    clearPlaylist() {
      this.currentTrack = null;
      this.playlist = [];
      this.playlistContext = null;
      this.pause();
      this.progress = 0;
      this.currentTime = 0;
      this.duration = 0;
    },

    getCurrentTrackIndex() {
      return this.currentIndex;
    },
  },
});
