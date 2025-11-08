import { ref, computed } from "vue";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useCategoryTracks = () => {
  const tracks = ref([]);
  const categoryName = ref("");
  const loading = ref(false);
  const error = ref(null);
  const searchQuery = ref("");

  const fetchTrackById = async (trackId) => {
    try {
      const response = await fetch(`${API_URL}/catalog/track/${trackId}`);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить трек ${trackId}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (e) {
      console.warn(`Ошибка загрузки трека ${trackId}:`, e);
      return null;
    }
  };

  const filteredTracks = computed(() => {
    if (!searchQuery.value.trim()) {
      return tracks.value;
    }
    const query = searchQuery.value.toLowerCase();
    return tracks.value.filter((track) => {
      const nameMatch = track.name?.toLowerCase().includes(query);
      const artistMatch = track.artist?.toLowerCase().includes(query);
      return nameMatch || artistMatch;
    });
  });

  const fetchCategoryData = async (id) => {
    loading.value = true;
    error.value = null;
    tracks.value = [];

    try {
      const response = await fetch(`${API_URL}/catalog/selection/${id}`);
      if (!response.ok) {
        throw new Error("Не удалось получить данные категории");
      }
      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error("Неверный формат ответа API");
      }

      const categoryData = data.data;
      categoryName.value = categoryData.name || "";

      if (
        categoryData.items &&
        Array.isArray(categoryData.items) &&
        categoryData.items.length > 0
      ) {
        const trackPromises = categoryData.items.map(fetchTrackById);
        const loadedTracks = await Promise.all(trackPromises);
        tracks.value = loadedTracks.filter((track) => track !== null);
      } else {
        console.warn("Нет items в подборке или они пустые");
        tracks.value = [];
      }
    } catch (e) {
      console.error("Ошибка при загрузке категории:", e);
      error.value =
        e instanceof Error ? e.message : "Ошибка при загрузке категории :(";
      tracks.value = [];
      categoryName.value = "";
    } finally {
      loading.value = false;
    }
  };

  return {
    tracks,
    filteredTracks,
    categoryName,
    loading,
    error,
    searchQuery,
    fetchCategoryData,
  };
};
