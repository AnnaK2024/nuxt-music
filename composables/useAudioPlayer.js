import { usePlayerStore } from "~/stores/player";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  const initPlayer = (element) => {
    if (!element) {
      console.error("Плеера нет :(");
      return;
    }
    playerStore.setAudioRef(element);
    // Устанавливаем текущую громкость при инициализации
    playerStore.audioRef.volume = playerStore.volume / 100;
  };

  const playTrack = async (track) => {
    if (!playerStore.audioRef) {
      console.error("Плеер не инициализирован");
      return;
    }

    try {
      if (playerStore.currentTrack?.id === track.id) {
        if (playerStore.audioRef.paused) {
          console.log("Пытаемся воспроизвести трек:", track.track_file);
          console.log("Текущий источник:", playerStore.audioRef.src);

          await playerStore.audioRef.play();
          playerStore.setPlaying(true);
        } else {
          playerStore.audioRef.pause();
          playerStore.setPlaying(false);
        }
      } else {
        playerStore.setCurrentTrack(track);
        playerStore.audioRef.src = track.track_file;
        console.log("Пытаемся воспроизвести трек:", track.track_file);
        console.log("Текущий источник:", playerStore.audioRef.src);

        await playerStore.audioRef.play();
        playerStore.setPlaying(true);
      }
    } catch (error) {
      console.error("Ошибка воспроизведения:", error);
      playerStore.setPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!playerStore.audioRef) return;
    const currentTime = playerStore.audioRef.currentTime;
    const duration = playerStore.audioRef.duration;
    if (duration && !isNaN(duration)) {
      const progress = (currentTime / duration) * 100;
      playerStore.setProgress(progress);
    }
  };

  const handleTrackEnd = () => {
    playerStore.setPlaying(false);
    playerStore.setProgress(0);
    playerStore.playNext();
  };

  const seekTo = (percentage) => {
    if (!playerStore.audioRef || !playerStore.currentTrack) return;
    const newTime = (percentage / 100) * playerStore.audioRef.duration;
    playerStore.audioRef.currentTime = newTime;
    playerStore.setProgress(percentage);
  };

  const updateVolume = (event) => {
    if (!playerStore.audioRef) return;
    const volumeValue = event.target.value;
    playerStore.setVolume(volumeValue);
    playerStore.audioRef.volume = volumeValue / 100;
  };

  return {
    initPlayer,
    playTrack,
    handleTimeUpdate,
    seekTo,
    updateVolume,
    handleTrackEnd,
  };
}
