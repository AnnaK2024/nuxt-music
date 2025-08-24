import { defineStore } from "pinia";

// извлекает год из строки даты релиза
function extractYearFromReleaseDate(releaseDate) {
  if (!releaseDate) {
    return "Неизвестно";
  }

  const raw = String(releaseDate).split("<")[0].trim();
  const match = raw.match(/\d{4}/);

  if (match) {
    return match[0];
  }

  return raw || "Неизвестно";
}

// нормализует название жанра (нижний регистр, обрезка пробелов)
function normalizeGenreName(genre) {
  if (!genre) {
    return "неизвестно";
  }

  return String(genre).toLowerCase().trim();
}

export const useTracksStore = defineStore("tracks", {
  // state — начальные данные (треки, фильтры, фавориты и т.д.)
  state: () => ({
    tracks: [],
    isLoading: false,
    errorMessage: null,
    favoriteTrackIds: [],
    filters: {
      author: null,
      year: null,
      genre: null,
      searchQuery: "",
      onlyFavorites: false,
    },
  }),

  // вычисляемые свойства (доступные авторы, годы, жанры, отфильтрованные треки и т.п.)
  getters: {
    availableAuthors(state) {
      // Возвращает уникальный отсортированный список авторов из state.tracks.
      const authorsSet = new Set();

      for (const track of state.tracks) {
        if (track && track.author) {
          authorsSet.add(String(track.author).trim());
        } else {
          authorsSet.add("Неизвестно");
        }
      }

      const authorsArray = Array.from(authorsSet);

      authorsArray.sort((a, b) => {
        if (a === "Неизвестно") {
          return 1;
        }

        if (b === "Неизвестно") {
          return -1;
        }

        return a.localeCompare(b);
      });

      return authorsArray;
    },

    availableYears(state) {
      // Возвращает уникальный отсортированный список годов релизов.
      const yearsSet = new Set();

      for (const track of state.tracks) {
        yearsSet.add(extractYearFromReleaseDate(track?.release_date));
      }

      const yearsArray = Array.from(yearsSet);

      yearsArray.sort((a, b) => {
        if (a === "Неизвестно") {
          return 1;
        }

        if (b === "Неизвестно") {
          return -1;
        }

        return b.localeCompare(a);
      });

      return yearsArray;
    },

    availableGenres(state) {
      // Возвращает уникальный отсортированный список жанров (нормализованных).
      const genresSet = new Set();

      for (const track of state.tracks) {
        const genre = track?.genre;

        if (Array.isArray(genre)) {
          genre.forEach((g) => {
            genresSet.add(normalizeGenreName(g));
          });
        } else {
          genresSet.add(normalizeGenreName(genre));
        }
      }

      const genresArray = Array.from(genresSet);

      genresArray.sort((a, b) => {
        if (a === "неизвестно") {
          return 1;
        }

        if (b === "неизвестно") {
          return -1;
        }

        return a.localeCompare(b);
      });

      return genresArray;
    },

    filteredTracks(state) {
      const favoriteIdsSet = new Set(state.favoriteTrackIds);
      const query = state.filters.searchQuery.trim().toLowerCase();

      console.log(query);

      let filteredList = state.tracks;

      if (query) {
        console.log(query);
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

      if (state.filters.author) {
        filteredList = filteredList.filter((track) => {
          const author = track?.author
            ? String(track.author).trim()
            : "Неизвестно";
          return author === state.filters.author;
        });
      }

      if (state.filters.year) {
        filteredList = filteredList.filter((track) => {
          return (
            extractYearFromReleaseDate(track?.release_date) ===
            state.filters.year
          );
        });
      }

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

      if (state.filters.onlyFavorites) {
        filteredList = filteredList.filter((track) => {
          return favoriteIdsSet.has(String(track.id));
        });
      }

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

  // методы для загрузки треков, изменения фильтров и управления фаворитами.
  actions: {
    async loadTracks() {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = null;

      try {
        const response = await fetch(
          "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/"
        );

        await fetch(
          "https://webdev-music-003b5b991590.herokuapp.com/catalog/selection/all"
        );

        if (!response.ok) {
          throw new Error("Не удалось получить треки");
        }

        const json = await response.json();
        this.tracks = Array.isArray(json?.data) ? json.data : [];
      } catch (error) {
        console.error("Ошибка при загрузке треков:", error);
        this.errorMessage = error?.message || "Ошибка при загрузке треков";
      } finally {
        this.isLoading = false;
      }
    },

    setFilters(patch) {
      console.log(patch);
      this.filters = { ...this.filters, ...patch };
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

    toggleFavorite(trackId) {
      const stringId = String(trackId);
      const index = this.favoriteTrackIds.indexOf(stringId);

      if (index === -1) {
        this.favoriteTrackIds.push(stringId);
      } else {
        this.favoriteTrackIds.splice(index, 1);
      }
    },

    setOnlyFavorites(value) {
      this.filters.onlyFavorites = Boolean(value);
    },
  },
});
