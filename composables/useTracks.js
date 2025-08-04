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
      console.log("Ответ API:", response);
      if (!response.ok) {
        throw new Error("Не удалось получить треки");
      }
      const data = await response.json();
      console.log("Данные API:", data);
      tracks.value = data.data;
    } catch (e) {
      console.error("Ошибка при загрузке треков:", e);
      error.value =
        e instanceof Error ? e.message : "Ошибка при загрузке треков :(";
    } finally {
      loading.value = false;
    }
  };

  return {
    tracks,
    loading,
    error,
    fetchTracks,
  };
};
