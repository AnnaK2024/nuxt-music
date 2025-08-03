import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    progress: 0,
    currentTime: 0,
    volume: 50,
    audioRef: null,
    isRepeat: false,
    isShuffle: false,
  }),

  getters: {
    hasNext(state) {
      if (!state.playlist.length) return false;
      if (state.isShuffle) return true;
      const currentIndex = state.playlist.findIndex(
        (t) => t.id === state.currentTrack?.id
      );
      return currentIndex !== -1 && currentIndex < state.playlist.length - 1;
    },
  },

  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track;
    },

    setPlaylist(tracks) {
      this.playlist = tracks;
    },

    setProgress(progress) {
      this.progress = progress;
    },

    setCurrentTime(time) {
      this.currentTime = time;
    },

    setVolume(volume) {
      this.volume = volume;
      if (this.audioRef) {
        this.audioRef.volume = volume / 100;
      }
    },

    setPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },

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
        const randomIndex = Math.floor(Math.random() * this.playlist.length);
        this.currentTrack = this.playlist[randomIndex];
      } else {
        const currentIndex = this.playlist.findIndex(
          (t) => t.id === this.currentTrack?.id
        );
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % this.playlist.length;
        this.currentTrack = this.playlist[nextIndex];
      }
    },

    playPrev() {
      if (!this.playlist.length) return;

      const currentIndex = this.playlist.findIndex(
        (t) => t.id === this.currentTrack?.id
      );
      const prevIndex = currentIndex <= 0 ? this.playlist.length - 1 : currentIndex - 1;
      this.currentTrack = this.playlist[prevIndex];
    },
  },
});