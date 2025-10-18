import { defineStore } from "pinia";
import { useFavoritesStore } from "~/stores/favorites";

export function normalizeId(id) {
  if (id === null || id === undefined) return null;
  const s = String(id).trim();
  return s === "" ? null : s;
}

function extractYearFromReleaseDate(releaseDate) {
  if (!releaseDate) return "Неизвестно";
  const raw = String(releaseDate).split("<")[0].trim();
  const match = raw.match(/\d{4}/);
  return match ? match[0] : raw || "Неизвестно";
}

function normalizeGenreName(genre) {
  if (!genre) return "неизвестно";
  return String(genre).toLowerCase().trim();
}

export const useTracksStore = defineStore("tracks", {
  state: () => ({
    tracks: [],
    selections: [],
    isLoading: false,
    errorMessage: null,
    filters: {
      author: null,
      year: null,
      genre: null,
      searchQuery: "",
      onlyFavorites: false,
    },
  }),

  getters: {
    availableAuthors(state) {
      const authorsSet = new Set();
      for (const track of state.tracks) {
        const author =
          track?.author && typeof track.author === "string"
            ? String(track.author).trim()
            : "Неизвестно";
        authorsSet.add(author);
      }
      const authorsArray = Array.from(authorsSet);
      authorsArray.sort((a, b) => {
        if (a === "Неизвестно") return 1;
        if (b === "Неизвестно") return -1;
        return a.localeCompare(b);
      });
      return authorsArray;
    },

    availableYears(state) {
      const yearsSet = new Set();
      for (const track of state.tracks) {
        yearsSet.add(extractYearFromReleaseDate(track?.release_date));
      }
      const yearsArray = Array.from(yearsSet);
      yearsArray.sort((a, b) => {
        if (a === "Неизвестно") return 1;
        if (b === "Неизвестно") return -1;
        return b.localeCompare(a); // Сортировка по убыванию для годов
      });
      return yearsArray;
    },

    availableGenres(state) {
      const genresSet = new Set();
      for (const track of state.tracks) {
        const genre = track?.genre;
        if (Array.isArray(genre)) {
          genre.forEach((g) => genresSet.add(normalizeGenreName(g)));
        } else {
          genresSet.add(normalizeGenreName(genre));
        }
      }
      const genresArray = Array.from(genresSet);
      genresArray.sort((a, b) => {
        if (a === "неизвестно") return 1;
        if (b === "неизвестно") return -1;
        return a.localeCompare(b);
      });
      return genresArray;
    },

    filteredTracks(state) {
      const favoritesStore = useFavoritesStore(); // Используем для избранных
      const query = state.filters.searchQuery.trim().toLowerCase();

      // Если "только избранные", фильтруем favoritesStore.favorites, иначе state.tracks
      let filteredList = state.filters.onlyFavorites
        ? favoritesStore.favorites
        : state.tracks;

      // Фильтр по поисковому запросу
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
      if (state.filters.author) {
        filteredList = filteredList.filter((track) => {
          const author = track?.author
            ? String(track.author).trim()
            : "Неизвестно";
          return author === state.filters.author;
        });
      }

      // Фильтр по году
      if (state.filters.year) {
        filteredList = filteredList.filter(
          (track) =>
            extractYearFromReleaseDate(track?.release_date) ===
            state.filters.year
        );
      }

      // Фильтр по жанру
      if (state.filters.genre) {
        const targetGenre = state.filters.genre;
        filteredList = filteredList.filter((track) => {
          if (Array.isArray(track?.genre)) {
            return track.genre.some(
              (g) => normalizeGenreName(g) === targetGenre
            );
          }
          return normalizeGenreName(track?.genre) === targetGenre;
        });
      }

      // Фильтр по избранным
      // if (state.filters.onlyFavorites) {
      //   filteredList = filteredList.filter((track) => {
      //     const id = normalizeId(track?.id);
      //     return id ? favoriteIdsSet.has(id) : false;
      //   });
      // }

      return filteredList;
    },

    hasActiveFilters(state) {
      const filters = state.filters;
      return Boolean(
        filters.author ||
          filters.year ||
          filters.genre ||
          filters.onlyFavorites ||
          (filters.searchQuery && filters.searchQuery.trim())
      );
    },
  },

  actions: {
    async loadTracks() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.errorMessage = null;

      try {
        // Загружаем треки
        const response = await fetch(
          "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/"
        );
        if (!response.ok) throw new Error("Не удалось получить треки");
        const json = await response.json();
        this.tracks = Array.isArray(json?.data) ? json.data : [];

        this.tracks = this.tracks.map((t, i) => {
          // пробуем несколько полей, если их нет — генерируем уникальный fallback
          const chosen = t.id ?? t._id ?? t.trackId ?? `__generated_${i}`;
          return { ...t, id: chosen };
        });

        // Загружаем подборку
        const selectionsResponse = await fetch(
          "https://webdev-music-003b5b991590.herokuapp.com/catalog/selection/all"
        );
        if (!selectionsResponse.ok)
          throw new Error("Не удалось получить подборки");
        const selectionsJson = await selectionsResponse.json();
        this.selections = Array.isArray(selectionsJson?.data)
          ? selectionsJson.data
          : [];
      } catch (error) {
        console.error("Ошибка при загрузке треков:", error);
        this.errorMessage = error?.message || "Ошибка при загрузке треков";
      } finally {
        this.isLoading = false;
      }
    },

    // async loadFavorites() {
    //   if (this.isLoading) return;
    //   this.isLoading = true;
    //   this.errorMessage = null;

    //   try {
    //     const token = localStorage.getItem("access_token"); // Предполагаю, что токен здесь; замените на ваш способ хранения
    //     if (!token) throw new Error("Токен авторизации отсутствует");

    //     const response = await fetch(
    //       "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/favorite/all/",
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`, // Добавлено для авторизации
    //         },
    //       }
    //     );
    //     if (!response.ok) {
    //       // Добавил более детальную обработку для отладки
    //       const errorText = await response.text();
    //       console.error("Ответ сервера:", response.status, errorText);
    //       throw new Error(
    //         `Не удалось получить избранные треки (статус: ${response.status})`
    //       );
    //     }
    //     const json = await response.json();
    //     const tracks = Array.isArray(json?.data) ? json.data : [];

    //     // Нормализуем ID, как в loadTracks
    //     this.favoriteTracks = tracks.map((t, i) => {
    //       const chosen = t.id ?? t._id ?? t.trackId ?? `__generated_${i}`;
    //       return { ...t, id: chosen };
    //     });

    //     // Синхронизируем favoriteTrackIds для совместимости с фильтрами
    //     this.favoriteTrackIds = this.favoriteTracks.map((track) =>
    //       normalizeId(track.id)
    //     );
    //   } catch (error) {
    //     console.error("Ошибка при загрузке избранных треков:", error);
    //     this.errorMessage =
    //       error?.message || "Ошибка при загрузке избранных треков";
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

    setFilters(patch) {
      // Создаем копию текущих фильтров
      const newFilters = { ...this.filters, ...patch };

      // Логика сброса: при установке одного из основных фильтров (author, year, genre) сбрасываем остальные,
      // но оставляем searchQuery и onlyFavorites без изменений, если они не в patch
      if (patch.author !== undefined) {
        newFilters.year = null;
        newFilters.genre = null;
      }
      if (patch.year !== undefined) {
        newFilters.author = null;
        newFilters.genre = null;
      }
      if (patch.genre !== undefined) {
        newFilters.author = null;
        newFilters.year = null;
      }
      // searchQuery и onlyFavorites не сбрасывают другие фильтры и не сбрасываются сами

      this.filters = newFilters;
    },

    clearFilters() {
      this.filters = {
        author: null,
        year: null,
        genre: null,
        searchQuery: "",
        onlyFavorites: false,
      };
    },

    // async toggleFavorite(trackId) {
    //   const token = localStorage.getItem("access_token");
    //   if (!token) {
    //     console.error("Токен авторизации отсутствует");
    //     this.errorMessage = "Токен авторизации отсутствует. Войдите заново.";
    //     return;
    //   }

    //   const isFavorite = this.favoriteTrackIds.includes(normalizeId(trackId));
    //   const method = isFavorite ? "DELETE" : "POST";
    //   const url = `https://webdev-music-003b5b991590.herokuapp.com/catalog/track/${trackId}/favorite/`;

    //   try {
    //     const response = await fetch(url, {
    //       method,
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     if (!response.ok) throw new Error("Не удалось обновить избранное");

    //     // Обновляем favoriteTrackIds локально
    //     if (isFavorite) {
    //       this.favoriteTrackIds = this.favoriteTrackIds.filter(
    //         (id) => id !== normalizeId(trackId)
    //       );
    //     } else {
    //       this.favoriteTrackIds.push(normalizeId(trackId));
    //     }

    //     // Опционально: Перезагрузите favoriteTracks после изменения (для синхронизации)
    //     await this.loadFavorites();
    //   } catch (error) {
    //     console.error("Ошибка при toggleFavorite:", error);
    //     this.errorMessage =
    //       error?.message || "Ошибка при обновлении избранного";
    //   }
    // },

    setOnlyFavorites(value) {
      this.filters.onlyFavorites = Boolean(value);
    },
  },
});
