import { usePlayerStore } from "~/stores/player";
import { watch } from "vue";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  // Инициализация аудио-плеера
  const initPlayer = (audioElement) => {
    playerStore.setAudioRef(audioElement);
  };

  // Воспроизведение трека
  const playTrack = (track) => {
    if (!track.track_file) return;

    if (playerStore.audioRef) {
      playerStore.audioRef.src = track.track_file;
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

  // Пауза
  const pause = () => {
    if (playerStore.audioRef) {
      playerStore.audioRef.pause();
      playerStore.setPlaying(false);
    }
  };

  // Перемотка
  const seekTo = (percentage) => {
    if (!playerStore.audioRef) return;
    const duration = playerStore.audioRef.duration;
    if (isNaN(duration)) return;
    playerStore.audioRef.currentTime = (percentage / 100) * duration;
    playerStore.setProgress(percentage);
  };

  // Обновление громкости
  const updateVolume = (event) => {
    const volume = event.target.value;
    playerStore.setVolume(volume);
    if (playerStore.audioRef) {
      playerStore.audioRef.volume = volume / 100;
    }
  };

  // Обработка обновления времени воспроизведения
  const handleTimeUpdate = () => {
    console.log("timeupdate", event.target.currentTime);
    if (!playerStore.audioRef) return;
    const currentTime = playerStore.audioRef.currentTime;
    const duration = playerStore.audioRef.duration;
    if (isNaN(duration) || duration === 0) return;
    const progress = (currentTime / duration) * 100;
    playerStore.setProgress(progress);
  };

  // Обработка окончания трека
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

   // Автоматически запускаем воспроизведение при смене currentTrack
  watch(
    () => playerStore.currentTrack,
    (newTrack) => {
      if (newTrack) {
        playTrack(newTrack);
      }
    }
  );

  // Переход к следующему треку
  const playNext = () => {
    playerStore.playNext();
    // playTrack вызовется автоматически через watch
  };

  // Переход к предыдущему треку
  const playPrev = () => {
    playerStore.playPrev();
    // playTrack вызовется автоматически через watch
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
