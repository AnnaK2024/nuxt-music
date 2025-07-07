import { ref } from "vue";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useTracks = () => {
  const tracks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchTracks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/catalog/track/all/`);
      if (!response.ok) {
        throw new Error("Не удалось получить треки");
      }
      const data = await response.json();
      tracks.value = data.data;
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Ошибка при загрузке треков :(";
    } finally {
      loading.value = false;
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return {
    tracks,
    loading,
    error,
    fetchTracks,
    formatDuration,
  };
};
