import { ref } from "vue";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useCategoryTracks = () => {
  const tracks = ref([]);
  const categoryName = ref("");
  const loading = ref(false);
  const error = ref(null);

  const fetchCategoryData = async (categoryId) => {
    loading.value = true;
    error.value = null;

    try {
      // Запрос к API категории по ID
      const response = await fetch(`${API_URL}/catalog/categories/${categoryId}`);
      if (!response.ok) {
        throw new Error("Не удалось получить данные категории");
      }
      const data = await response.json();

      // Предполагается, что API возвращает объект с названием категории и массивом треков
      // Внимательно проверьте структуру ответа API и подкорректируйте, если нужно
      categoryName.value = data.data?.name || "";
      tracks.value = data.data?.tracks || [];
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
    categoryName,
    loading,
    error,
    fetchCategoryData,
  };
};
