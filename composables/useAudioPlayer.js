import { usePlayerStore } from "~/stores/player";
import { ref, watchEffect} from "vue";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  // Добавляем реактивные переменные для времени
  const currentTime = ref(0);
  const duration = ref(0);

  // Инициализация аудио-плеера
  const initPlayer = (audioElement) => {
    playerStore.setAudioRef(audioElement);

     // Добавляем обработчики событий к аудиоэлементу
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleTrackEnd);
    
      // При загрузке трека обновим длительность
    audioElement.addEventListener("loadedmetadata", () => {
      duration.value = audioElement.duration || 0;
    });
  };
  

  // Воспроизведение трека
  const playTrack = (track) => {
    if (!track.track_file) return;

    if (playerStore.audioRef) {
      // Очищаем src, чтобы сбросить текущее состояние (не обязательно)
      // playerStore.audioRef.src = '';

      playerStore.audioRef.src = track.track_file;

      // Ждем, когда аудио будет готово к воспроизведению
      const onCanPlay = () => {
        playerStore.audioRef
          .play()
          .then(() => {
            playerStore.setPlaying(true);
            playerStore.setCurrentTrack(track);
            // Обновим длительность при старте
            duration.value = playerStore.audioRef.duration || 0;
          })
          .catch((e) => {
            console.error("Ошибка воспроизведения:", e);
            playerStore.setPlaying(false);
          });
        // Удаляем слушатель, чтобы не вызывать повторно
        playerStore.audioRef.removeEventListener("canplay", onCanPlay);
      };

      playerStore.audioRef.addEventListener("canplay", onCanPlay);
      // Можно вызвать load(), чтобы гарантировать загрузку
      playerStore.audioRef.load();
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

 // Обновляем currentTime, duration и прогресс
  const handleTimeUpdate = () => {
    if (!playerStore.audioRef) return;
    currentTime.value = playerStore.audioRef.currentTime;
    duration.value = playerStore.audioRef.duration || 0;

    if (isNaN(duration.value) || duration.value === 0) return;

    const progress = (currentTime.value / duration.value) * 100;
    playerStore.setProgress(progress);
  };

  // Обработка окончания трека
 const handleTrackEnd = () => {
  console.log("Трек закончился");
    if (playerStore.isRepeat) {
      playTrack(playerStore.currentTrack);
    } else {
      playerStore.playNext();
      // playTrack вызовется автоматически через watch
    }
  };

   // Используем watchEffect для автоматического запуска playTrack при смене currentTrack
  watchEffect(() => {
    const track = playerStore.currentTrack;
    if (track) {
      console.log("currentTrack изменился, запускаем playTrack", track);
      playTrack(track);
    }
  });

   // Автоматическая остановка воспроизведения при достижении 100% прогресса
  watchEffect(() => {
    if (playerStore.progress >= 100 && playerStore.isPlaying) {
      playerStore.setPlaying(false);
    }
  });

  // Переход к следующему треку
  const playNext = () => {
    playerStore.playNext();
    console.log("playNext вызван, currentTrack:", playerStore.currentTrack);
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
    currentTime,
    duration,
  };
}
