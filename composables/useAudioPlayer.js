import { usePlayerStore } from "~/stores/player";
import { watch, ref, watchEffect } from "vue";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  const currentTime = ref(0);
  const duration = ref(0);
  const currentTrack = ref(null);

  const initPlayer = (audioElement) => {
    playerStore.setAudioRef(audioElement);

    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleTrackEnd);
    audioElement.addEventListener("loadedmetadata", () => {
      duration.value = audioElement.duration || 0;
    });
  };

  const playTrack = (track) => {
    if (!track.track_file) {
      playerStore.setPlaying(false);
      return;
    }

    if (!playerStore.audioRef) {
      playerStore.setPlaying(false);
      return;
    }

    playerStore.audioRef.removeEventListener("canplay", playerStore._onCanPlay);

    playerStore.audioRef.src = track.track_file;

    const onCanPlay = () => {
      playerStore.audioRef
        .play()
        .then(() => {
          playerStore.setPlaying(true);
          playerStore.setCurrentTrack(track);
          currentTrack.value = track;
          duration.value = playerStore.audioRef.duration || 0;
        })
        .catch((e) => {
          console.error("Ошибка воспроизведения:", e);
          playerStore.setPlaying(false);
        });

      playerStore.audioRef.removeEventListener("canplay", onCanPlay);
      delete playerStore._onCanPlay;
    };

    playerStore._onCanPlay = onCanPlay;
    playerStore.audioRef.addEventListener("canplay", onCanPlay);

    playerStore.audioRef.load();
  };

  const play = () => {
    if (!playerStore.audioRef) {
      return;
    }

    playerStore.audioRef
      .play()
      .then(() => {
        playerStore.setPlaying(true);
      })
      .catch((e) => {
        console.error("Ошибка при попытке воспроизведения:", e);
        playerStore.setPlaying(false);
      });
  };

  const pause = () => {
    if (!playerStore.audioRef) {
      return;
    }

    try {
      playerStore.audioRef.pause();
      playerStore.setPlaying(false);
    } catch (e) {
      console.error("Ошибка при попытке поставить на паузу:", e);
    }
  };

  const seekTo = (percentage) => {
    if (!playerStore.audioRef) return;
    const dur = playerStore.audioRef.duration;
    if (isNaN(dur)) return;
    playerStore.audioRef.currentTime = (percentage / 100) * dur;
    playerStore.setProgress(percentage);
  };

  const updateVolume = (event) => {
    const volume = event.target.value;
    playerStore.setVolume(volume);
    if (playerStore.audioRef) {
      playerStore.audioRef.volume = volume / 100;
    }
  };

  const handleTimeUpdate = () => {
    if (!playerStore.audioRef) return;
    currentTime.value = playerStore.audioRef.currentTime;
    duration.value = playerStore.audioRef.duration || 0;

    if (isNaN(duration.value) || duration.value === 0) return;

    const progress = (currentTime.value / duration.value) * 100;
    playerStore.setProgress(progress);
  };

  const handleTrackEnd = () => {
    if (playerStore.isRepeat) {
      playTrack(playerStore.currentTrack);
    } else if (playerStore.hasNext) {
      playerStore.playNext();
    } else {
      playerStore.setPlaying(false);
    }
  };

  watch(
    () => playerStore.currentTrack,
    (newTrack, oldTrack) => {
      console.log("currentTrack изменился:", oldTrack, "->", newTrack);
      if (newTrack) {
        playTrack(newTrack);
        currentTrack.value = newTrack;
      }
    }
  );

  watchEffect(() => {
    if (!playerStore.isPlaying && playerStore.audioRef) {
      playerStore.audioRef.pause();
    }
  });

  const playNext = () => {
    playerStore.playNext();
  };

  const playPrev = () => {
    playerStore.playPrev();
  };

  const toggleRepeat = () => {
    playerStore.toggleRepeat();
  };

  const toggleShuffle = () => {
    playerStore.toggleShuffle();
  };

  return {
    initPlayer,
    playTrack,
    play,
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
    currentTrack,
  };
}
