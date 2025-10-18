import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuth } from "~/composables/useAuth";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref(null);
  const { fetchWithAuth } = useAuth();

  // Вспомогательные функции (дублируй из tracksStore, если нужно)
  const normalizeId = (id) => {
    if (!id) return null;
    return id
      .toString()
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, ""); // Удаляем спецсимволы, если нужно
  };

  const extractYearFromReleaseDate = (releaseDate) => {
    if (!releaseDate) return "Неизвестно";
    const date = new Date(releaseDate);
    return isNaN(date.getTime()) ? "Неизвестно" : date.getFullYear().toString();
  };

  const normalizeGenreName = (genre) => {
    if (!genre) return "неизвестно";
    return genre.toString().trim().toLowerCase();
  };

  // Computed getters
  const isFavorite = (trackId) => {
    const id = normalizeId(trackId);
    return computed(() =>
      favorites.value.some((f) => normalizeId(f.id) === id)
    );
  };

  const availableAuthors = computed(() => {
    const authorsSet = new Set();
    favorites.value.forEach((track) => {
      const author = track?.author ? String(track.author).trim() : "Неизвестно";
      authorsSet.add(author);
    });
    const authorsArray = Array.from(authorsSet);
    authorsArray.sort((a, b) => {
      if (a === "Неизвестно") return 1;
      if (b === "Неизвестно") return -1;
      return a.localeCompare(b);
    });
    return authorsArray;
  });

  const availableYears = computed(() => {
    const yearsSet = new Set();
    favorites.value.forEach((track) => {
      yearsSet.add(extractYearFromReleaseDate(track?.release_date));
    });
    const yearsArray = Array.from(yearsSet);
    yearsArray.sort((a, b) => {
      if (a === "Неизвестно") return 1;
      if (b === "Неизвестно") return -1;
      return b.localeCompare(a); // По убыванию
    });
    return yearsArray;
  });

  const availableGenres = computed(() => {
    const genresSet = new Set();
    favorites.value.forEach((track) => {
      const genre = track?.genre;
      if (Array.isArray(genre)) {
        genre.forEach((g) => genresSet.add(normalizeGenreName(g)));
      } else {
        genresSet.add(normalizeGenreName(genre));
      }
    });
    const genresArray = Array.from(genresSet);
    genresArray.sort((a, b) => {
      if (a === "неизвестно") return 1;
      if (b === "неизвестно") return -1;
      return a.localeCompare(b);
    });
    return genresArray;
  });

  // Загрузка избранного с сервера
  async function loadFavorites() {
    if (isLoading.value) return;
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await fetchWithAuth(
        `${API_URL}/catalog/track/favorite/all/`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error("401 — Unauthorized. Проверь токен или войди заново.");
          errorMessage.value = "Unauthorized (401). Проверь accessToken.";
          throw new Error(errorMessage.value);
        }
        const error = new Error(`HTTP error! Status: ${response.status}`);
        errorMessage.value = error.message;
        throw error;
      }

      const data = await response.json();
      favorites.value = Array.isArray(data?.data) ? data.data : data;
      // Нормализуем ID, если нужно
      favorites.value = favorites.value.map((t, i) => ({
        ...t,
        id: normalizeId(t.id) || t._id || t.trackId || `__generated_${i}`,
      }));


      console.log("Избранные треки загружены:", favorites.value);
      return favorites.value;
    } catch (error) {
      console.error("Ошибка при получении избранного:", error);
      errorMessage.value = error?.message || "Ошибка при загрузке избранных";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Добавление трека в избранное
  async function addFavorite(trackId, trackData = null) {
    const id = normalizeId(trackId);
    if (!id || id === "") {
      const error = new Error("trackId должен быть валидным ID трека");
      errorMessage.value = error.message;
      throw error;
    }

    try {
      const response = await fetchWithAuth(
        `${API_URL}/catalog/track/${id}/favorite/`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        errorMessage.value = error.message;
        throw error;
      }
      const data = await response.json();
      console.log(`Трек ${id} добавлен в избранное:`, data);

      // Локально добавляем трек, если передан trackData (из tracksStore)
      if (trackData && !favorites.value.some((f) => normalizeId(f.id) === id)) {
        favorites.value.push({ ...trackData, id });
      } else {
        // Если нет trackData, перезагружаем (опционально, для свежести)
        await loadFavorites();
      }
      errorMessage.value = null;
      return data;
    } catch (error) {
      console.error("Ошибка при добавлении в избранное:", error);
      errorMessage.value =
        error?.message || "Ошибка при добавлении в избранное";
      throw error;
    }
  }

  // Удаление из избранного
  async function removeFavorite(trackId) {
    const id = normalizeId(trackId);
    if (!id || id === "") {
      const error = new Error("trackId должен быть валидным ID трека");
      errorMessage.value = error.message;
      throw error;
    }

    try {
      const response = await fetchWithAuth(
        `${API_URL}/catalog/track/${id}/favorite/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        errorMessage.value = error.message;
        throw error;
      }
      const data = await response.json();
      console.log(`Трек ${id} удалён из избранного:`, data);

      // Локально удаляем
      favorites.value = favorites.value.filter((f) => normalizeId(f.id) !== id);
      errorMessage.value = null;
      return data;
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error);
      errorMessage.value =
        error?.message || "Ошибка при удалении из избранного";
      throw error;
    }
  }

  // Toggle: добавляет или удаляет на основе текущего состояния
  async function toggleFavorite(trackId, trackData = null) {
    if (isFavorite(trackId).value) {
      return await removeFavorite(trackId);
    } else {
      return await addFavorite(trackId, trackData);
    }
  }

  // Очистка ошибки (для UI)
  function clearError() {
    errorMessage.value = null;
  }

  return {
    favorites,
    isLoading,
    errorMessage,
    isFavorite,
    availableAuthors,
    availableYears,
    availableGenres,
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearError,
  };
});
