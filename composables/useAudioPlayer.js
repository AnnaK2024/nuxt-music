import { usePlayerStore } from "@/stores/player";

export function useAudioPlayer() {
  // Получаем store, чтобы менять данные в хранилище
  const playerStore = usePlayerStore();

  // Инициализируем плеер в самом начале
  const initPlayer = (element) => {
    if (!element) {
      console.error("Плеера нет :(");
      return;
    }
    console.log(element);
    playerStore.setAudioRef(element);
  };

  // Воспроизводим трек
  const playTrack = async (track) => {
    if (!playerStore.audioRef) {
      console.error("Плеер не инициализирован");
      return;
    }

    try {
      playerStore.setCurrentTrack(track);
      playerStore.audioRef.src = track.track_file;
      await playerStore.audioRef.play();
      playerStore.setPlaying(true);
    } catch (error) {
      console.error("Ошибка воспроизведения:", error);
      playerStore.setPlaying(false);
    }
  };

  // Обновляем прогресс трека
  const handleTimeUpdate = () => {
    if (!playerStore.audioRef) return;
    const currentTime = playerStore.audioRef.currentTime;
    const duration = playerStore.audioRef.duration;
    console.log(duration);
    if (duration) {
      const progress = (currentTime / duration) * 100;
      playerStore.setProgress(progress);
    }
  };

  //   Обработка окончания трека
  //   const handleTrackEnd = () => {
  //     playerStore.setPlaying(false)
  //   }

  // Перематываем
  const seekTo = (percentage) => {
    if (!playerStore.audioRef || !playerStore.currentTrack) return;
    const newTime = (percentage / 100) * playerStore.audioRef.duration;
    playerStore.audioRef.currentTime = newTime;
    playerStore.setProgress(percentage);
  };

  // Меняем громкость
  const updateVolume = () => {
    if (!playerStore.audioRef) return;
    playerStore.audioRef.volume = playerStore.volume / 100;
  };

  return {
    initPlayer,
    playTrack,
    handleTimeUpdate,
    seekTo,
    updateVolume,
    // handleTrackEnd,
  };
}
