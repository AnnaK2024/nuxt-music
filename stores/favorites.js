import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuth } from "~/composables/useAuth";
import {
  extractYearFromReleaseDate,
  normalizeId,
  normalizeGenreName,
  normalizeTrack,
} from "~/utils/trackUtils";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref(null);
  const filters = ref({
    author: null,
    year: null,
    genre: null,
    searchQuery: "",
  });
  const { fetchWithAuth } = useAuth();

  // Получаем boolean computed по id
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
      return b.localeCompare(a);
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

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const clearFilters = () => {
    filters.value = {
      author: null,
      year: null,
      genre: null,
      searchQuery: "",
    };
  };

  const filteredFavorites = computed(() => {
    const query = filters.value.searchQuery.trim().toLowerCase();
    let filteredList = favorites.value;

    // Фильтр по поиску
    if (query) {
      filteredList = filteredList.filter((track) => {
        const title = String(track?.name || track?.title || "").toLowerCase();
        const author = String(track?.author || "").toLowerCase();
        const album = String(track?.album || "").toLowerCase();
        return (
          title.includes(query) ||
          author.includes(query) ||
          album.includes(query)
        );
      });
    }

    // Фильтр по автору
    if (filters.value.author) {
      filteredList = filteredList.filter((track) => {
        const author = track?.author
          ? String(track.author).trim()
          : "Неизвестно";
        return author === filters.value.author;
      });
    }

    // Фильтр по году
    if (filters.value.year) {
      filteredList = filteredList.filter(
        (track) =>
          extractYearFromReleaseDate(track?.release_date) === filters.value.year
      );
    }

    // Фильтр по жанру
    if (filters.value.genre) {
      const targetGenre = filters.value.genre;
      filteredList = filteredList.filter((track) => {
        if (Array.isArray(track?.genre)) {
          return track.genre.some((g) => normalizeGenreName(g) === targetGenre);
        }
        return normalizeGenreName(track?.genre) === targetGenre;
      });
    }

    return filteredList;
  });

  const favoriteTracks = computed(() => filteredFavorites.value);

  // Нормализовать массив ответа и вернуть массив треков
  const normalizeResponseToArray = (resp) => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    if (Array.isArray(resp?.data)) return resp.data;
    // Если пришёл объект с полем data — возвращаем либо data, либо сам объект как элемент массива
    if (resp?.data && !Array.isArray(resp.data)) return [resp.data];
    // Если это одиночный трек — поместим его в массив
    return [resp];
  };

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

      const arr = normalizeResponseToArray(data);

      favorites.value = arr.map((t, i) => normalizeTrack(t, null, i));

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

      // Если передали trackData — обработаем его безопасно
      if (trackData) {
        // Если передали массив треков — добавим поэлементно
        if (Array.isArray(trackData)) {
          trackData.forEach((t, i) => {
            const normalized = normalizeTrack(t, id, i);
            const exists = favorites.value.some(
              (f) => normalizeId(f.id) === normalizeId(normalized.id)
            );
            if (!exists) favorites.value.push(normalized);
          });
        } else if (typeof trackData === "object") {
          const normalized = normalizeTrack(trackData, id, 0);
          const exists = favorites.value.some(
            (f) => normalizeId(f.id) === normalizeId(normalized.id)
          );
          if (!exists) favorites.value.push(normalized);
        } else {
          // Неподдерживаемый тип trackData — игнорируем и попытаемся использовать ответ сервера
          console.warn(
            "addFavorite: unsupported trackData type",
            typeof trackData
          );
        }
      } else {
        // Если trackData не передан — используем ответ сервера
        const respArr = normalizeResponseToArray(data);
        // Если сервер вернул весь список — заменим локально (без дубликатов)
        if (Array.isArray(respArr) && respArr.length > 1) {
          favorites.value = respArr.map((t, i) => normalizeTrack(t, null, i));
        } else if (respArr.length === 1) {
          const normalized = normalizeTrack(respArr[0], id, 0);
          const exists = favorites.value.some(
            (f) => normalizeId(f.id) === normalizeId(normalized.id)
          );
          if (!exists) favorites.value.push(normalized);
        }
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
    const id = normalizeId(trackId);
    if (!id) throw new Error("Invalid track id in toggleFavorite");

    if (isFavorite(id).value) {
      return await removeFavorite(id);
    } else {
      return await addFavorite(id, trackData);
    }
  }

  function clearError() {
    errorMessage.value = null;
  }

  return {
    favorites,
    isLoading,
    errorMessage,
    filters,
    isFavorite,
    availableAuthors,
    availableYears,
    availableGenres,
    filteredFavorites, 
    favoriteTracks,
    setFilters, 
    clearFilters,
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearError,
  };
});
