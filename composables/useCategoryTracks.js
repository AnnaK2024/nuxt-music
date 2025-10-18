import { ref, computed } from "vue"; // Добавил computed

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useCategoryTracks = () => {
  const tracks = ref([]);
  const categoryName = ref("");
  const loading = ref(false);
  const error = ref(null);
  const searchQuery = ref(""); // Новая переменная для строки поиска

  // Функция для загрузки одного трека по ID (без изменений)
  const fetchTrackById = async (trackId) => {
    try {
      const response = await fetch(`${API_URL}/catalog/track/${trackId}`);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить трек ${trackId}`);
      }
      const data = await response.json();
      return data.data || data; // Адаптируй под структуру
    } catch (e) {
      console.warn(`Ошибка загрузки трека ${trackId}:`, e);
      return null;
    }
  };

  // Computed для отфильтрованных треков (реактивно обновляется при изменении searchQuery или tracks)
  const filteredTracks = computed(() => {
    if (!searchQuery.value.trim()) {
      return tracks.value; // Если поиск пустой, возвращаем все треки
    }
    const query = searchQuery.value.toLowerCase();
    return tracks.value.filter((track) => {
      // Предполагаем поля: name (название трека), artist (имя артиста). Адаптируй под реальную структуру!
      const nameMatch = track.name?.toLowerCase().includes(query);
      const artistMatch = track.artist?.toLowerCase().includes(query);
      return nameMatch || artistMatch; // Фильтр по названию ИЛИ артисту
    });
  });

  const fetchCategoryData = async (id) => {
    // Без изменений (твой код загрузки)
    loading.value = true;
    error.value = null;
    tracks.value = [];

    try {
      console.log("Запрос к подборке ID:", id);
      const response = await fetch(`${API_URL}/catalog/selection/${id}`);
      if (!response.ok) {
        throw new Error("Не удалось получить данные категории");
      }
      const data = await response.json();
      console.log("Ответ API для подборки:", data);

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
        console.log("Загружаем треки по ID:", categoryData.items);
        const trackPromises = categoryData.items.map(fetchTrackById);
        const loadedTracks = await Promise.all(trackPromises);
        tracks.value = loadedTracks.filter((track) => track !== null);
        console.log("Загруженные треки:", tracks.value);
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

  useHead({
    title: "Избранное", // Заголовок страницы
    // Дополнительно можно добавить другие мета-теги, например:
    // meta: [{ name: 'description', content: 'Ваши любимые треки' }]
  });

  return {
    tracks, // Исходный массив (для отладки)
    filteredTracks, // Отфильтрованный список — используй его в шаблоне!
    categoryName,
    loading,
    error,
    searchQuery, // Экспортируем для v-model в компоненте
    fetchCategoryData,
  };
};
