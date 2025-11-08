<template>
  <div class="centerblock__filter filter">
    <div class="filter__title">Искать по:</div>

    <div class="filter__wrapper">
      <div
        class="filter__button button-author _btn-text"
        :class="{
          active: activeDropdown === 'author',
          selected: !!tracksStore.filters.author,
        }"
        @click="toggleDropdown('author')"
      >
        <span class="filter__button-text">исполнителю</span>
        <span
          v-show="activeDropdown === 'author' || !!tracksStore.filters.author"
          class="filter__badge"
        >
          {{ badgeCount("author") || 0 }}
        </span>
      </div>

      <div
        v-show="activeDropdown === 'author'"
        class="filter__dropdown"
        :class="{ active: activeDropdown === 'author' }"
      >
        <div class="filter__dropdown-inner">
          <ul class="filter__list">
            <li
              v-for="author in tracksStore.availableAuthors"
              :key="author"
              class="filter__item"
              :class="{ 'filter__item--active': isActive('author', author) }"
              @click="selectFilterValue('author', author)"
            >
              {{ author }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="filter__wrapper">
      <div
        class="filter__button button-year _btn-text"
        :class="{
          active: activeDropdown === 'year',
          selected: !!tracksStore.filters.year,
        }"
        @click="toggleDropdown('year')"
      >
        <span class="filter__button-text">году выпуска</span>
        <span
          v-show="activeDropdown === 'year' || !!tracksStore.filters.year"
          class="filter__badge"
        >
          {{ badgeCount("year") || 0 }}
        </span>
      </div>

      <div
        v-show="activeDropdown === 'year'"
        class="filter__dropdown"
        :class="{ active: activeDropdown === 'year' }"
      >
        <div class="filter__dropdown-inner">
          <ul class="filter__list">
            <li
              v-for="year in tracksStore.availableYears"
              :key="year"
              class="filter__item"
              :class="{ 'filter__item--active': isActive('year', year) }"
              @click="selectFilterValue('year', year)"
            >
              {{ year }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="filter__wrapper">
      <div
        class="filter__button button-genre _btn-text"
        :class="{
          active: activeDropdown === 'genre',
          selected: !!tracksStore.filters.genre,
        }"
        @click="toggleDropdown('genre')"
      >
        <span class="filter__button-text">жанру</span>
        <span
          v-show="activeDropdown === 'genre' || !!tracksStore.filters.genre"
          class="filter__badge"
        >
          {{ badgeCount("genre") || 0 }}
        </span>
      </div>

      <div
        v-show="activeDropdown === 'genre'"
        class="filter__dropdown"
        :class="{ active: activeDropdown === 'genre' }"
      >
        <div class="filter__dropdown-inner">
          <ul class="filter__list">
            <li
              v-for="genre in tracksStore.availableGenres"
              :key="genre"
              class="filter__item"
              :class="{ 'filter__item--active': isActive('genre', genre) }"
              @click="selectFilterValue('genre', genre)"
            >
              {{ genre }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useTracksStore } from "~/stores/tracks";

const tracksStore = useTracksStore();
const activeDropdown = ref(null);

function toggleDropdown(kind) {
  if (activeDropdown.value === kind) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = kind;
  }
}

function selectFilterValue(kind, value) {
  if (kind === "author") {
    const sameValue =
      tracksStore.filters.author &&
      String(tracksStore.filters.author) === String(value);

    if (sameValue) {
      tracksStore.setFilters({ author: null });
    } else {
      tracksStore.setFilters({ author: String(value) });
    }
  }

  if (kind === "year") {
    const sameValue =
      tracksStore.filters.year &&
      String(tracksStore.filters.year) === String(value);

    if (sameValue) {
      tracksStore.setFilters({ year: null });
    } else {
      tracksStore.setFilters({ year: String(value) });
    }
  }

  if (kind === "genre") {
    const normalizedValue = String(value).toLowerCase().trim();
    const sameValue =
      tracksStore.filters.genre &&
      String(tracksStore.filters.genre) === normalizedValue;

    if (sameValue) {
      tracksStore.setFilters({ genre: null });
    } else {
      tracksStore.setFilters({ genre: normalizedValue });
    }
  }

  activeDropdown.value = null;
}

const isActive = (kind, value) => {
  const current = tracksStore.filters[kind];
  if (!current) return false;

  const normalizedValue =
    kind === "genre" ? String(value).toLowerCase().trim() : String(value);
  return String(current) === normalizedValue;
};

const badgeCount = (kind) => {
  const filterValue = tracksStore.filters[kind];

  if (!filterValue) {
    const availableKey = `available${
      kind.charAt(0).toUpperCase() + kind.slice(1)
    }s`;
    return tracksStore[availableKey]?.length || 0;
  } else {
    return tracksStore.tracks.filter((track) => {
      if (kind === "author") {
        const author = track?.author
          ? String(track.author).trim()
          : "Неизвестно";
        return author === filterValue;
      }
      if (kind === "year") {
        const year = extractYearFromReleaseDate(track?.release_date);
        return year === filterValue;
      }
      if (kind === "genre") {
        const targetGenre = filterValue;
        if (Array.isArray(track?.genre)) {
          return track.genre.some((g) => normalizeGenreName(g) === targetGenre);
        }
        return normalizeGenreName(track?.genre) === targetGenre;
      }
      return false;
    }).length;
  }
};
</script>

<style lang="scss" scoped>
.centerblock__filter {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 51px;
}
.filter__title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-right: 15px;
}
.filter__wrapper {
  position: relative;
}

.filter__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: #313131;
  border-radius: 8px;
  max-height: 200px;
  width: max-content;
  min-width: 150px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  padding: 8px;
  display: none;
  flex-direction: column;
  overflow: hidden;
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
}

.filter__wrapper .filter__dropdown.active {
  display: flex;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  margin-top: 15px;
}

.filter__dropdown-inner {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ad61ff #2e2e2e;
}

.filter__dropdown-inner::-webkit-scrollbar {
  width: 6px;
}

.filter__dropdown-inner::-webkit-scrollbar-track {
  background: #2e2e2e;
  border-radius: 10px;
}

.filter__dropdown-inner::-webkit-scrollbar-thumb {
  background-color: #ad61ff;
  border-radius: 10px;
  border: 2px solid #2e2e2e;
}

.filter__list {
  margin: 0;
  padding: 0;
  list-style: none;
  flex: 1;
}

.filter__item {
  padding: 8px 20px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
}

.filter__item:hover {
  color: #b672ff;
  text-decoration: underline;
}

.filter__item--active {
  color: #ad61ff;
  font-weight: 600;
  background-color: rgba(173, 97, 255, 0.1);
  border-radius: 4px;
}

.filter__item--active:hover {
  color: #ad61ff;
  text-decoration: none;
  background-color: rgba(173, 97, 255, 0.2);
}

.filter__button {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid #ffffff;
  border-radius: 60px;
  padding: 6px 20px;
  display: flex;
  align-items: center;
  position: relative;
}

.filter__button:not(:last-child) {
  margin-right: 10px;
}

.filter__button-text {
  flex: 1;
}

.filter__badge {
  background: #ad61ff;
  color: #ffffff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  top: -8px;
  right: -8px;
  flex-shrink: 0;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

._btn-text:hover {
  border-color: #b672ff;
  color: #b672ff;
  cursor: pointer;
}

._btn-text:hover .filter__badge {
  background: #b672ff;
}

._btn-icon:hover svg {
  fill: transparent;
  stroke: #acacac;
  cursor: pointer;
}

._btn-text:active {
  border-color: #ad61ff;
  color: #ad61ff;
  cursor: pointer;
}

._btn-icon:active svg {
  fill: transparent;
  stroke: #ffffff;
  cursor: pointer;
}

._btn-icon:active .track-play__like-svg,
._btn-icon:active .track-play__dislike-svg {
  fill: #696969;
  stroke: #ffffff;
  cursor: pointer;
}

.filter__button.selected {
  border-color: #ad61ff;
  color: #ad61ff;
  background-color: rgba(173, 97, 255, 0.1);
}

.filter__button.selected:hover {
  border-color: #b672ff;
  color: #b672ff;
  background-color: rgba(182, 114, 255, 0.1);
}

.filter__button.selected .filter__badge {
  background: #b672ff;
  color: #ffffff;
}
</style>
