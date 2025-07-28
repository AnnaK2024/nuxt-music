import { usePlayerStore } from "~/stores/player";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  const initPlayer = (audioElement) => {
    playerStore.setAudioRef(audioElement);
  };

  const playTrack = (track) => {
    if (!track) return;
    if (playerStore.audioRef) {
      playerStore.audioRef.src = track.url;
      playerStore.audioRef.play();
      playerStore.setPlaying(true);
      playerStore.setCurrentTrack(track);
    }
  };

  const pause = () => {
    if (playerStore.audioRef) {
      playerStore.audioRef.pause();
      playerStore.setPlaying(false);
    }
  };

  const seekTo = (percentage) => {
    if (!playerStore.audioRef) return;
    const duration = playerStore.audioRef.duration;
    if (isNaN(duration)) return;
    playerStore.audioRef.currentTime = (percentage / 100) * duration;
    playerStore.setProgress(percentage);
  };

  const updateVolume = (event) => {
    const volume = event.target.value;
    playerStore.setVolume(volume);
  };

  const handleTimeUpdate = () => {
    if (!playerStore.audioRef) return;
    const currentTime = playerStore.audioRef.currentTime;
    const duration = playerStore.audioRef.duration;
    if (isNaN(duration) || duration === 0) return;
    const progress = (currentTime / duration) * 100;
    playerStore.setProgress(progress);
  };

  const handleTrackEnd = () => {
    if (playerStore.isRepeat) {
      // повторяем текущий трек
      playTrack(playerStore.currentTrack);
    } else {
      playerStore.playNext();
      if (playerStore.currentTrack) {
        playTrack(playerStore.currentTrack);
      } else {
        playerStore.setPlaying(false);
      }
    }
  };

  // Следующий трек
  const playNext = () => {
    playerStore.playNext();
    if (playerStore.currentTrack) {
      playTrack(playerStore.currentTrack);
    }
  };

  // Предыдущий трек
  const playPrev = () => {
    playerStore.playPrev();
    if (playerStore.currentTrack) {
      playTrack(playerStore.currentTrack);
    }
  };

  // Переключение повторения
  const toggleRepeat = () => {
    playerStore.toggleRepeat();
  };

  // Переключение перемешивания
  const toggleShuffle = () => {
    playerStore.toggleShuffle();
  };

  return {
    initPlayer,
    playTrack,
    pause,
    seekTo,
    updateVolume,
    handleTimeUpdate,
    handleTrackEnd,
    playNext,
    playPrev,
    toggleRepeat,
    toggleShuffle,
  };
}
