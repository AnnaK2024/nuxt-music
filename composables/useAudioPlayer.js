import { usePlayerStore } from "~/stores/player";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  const initPlayer = (element) => {
    playerStore.setAudioRef(element);
  };

 const playTrack = (track) => {
  if (!track.track_file) return; // Проверка наличия URL
  console.log("Текущий трек:", track);
  console.log("URL трека:", track.track_file); // Используем правильное свойство

  if (playerStore.audioRef) {
    playerStore.audioRef.src = track.track_file; // Обновляем источник
    playerStore.audioRef
      .play()
      .then(() => {
        playerStore.setPlaying(true);
        playerStore.setCurrentTrack(track);
      })
      .catch((e) => {
        console.error("Ошибка воспроизведения:", e);
        playerStore.setPlaying(false);
      });
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
    console.log('timeupdate', event.target.currentTime);
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
