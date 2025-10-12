<template>
  <div class="centerblock__filter filter">
    <div class="filter__title">Искать по:</div>

    <div class="filter__wrapper">
      <div
        class="filter__button button-author _btn-text"
        :class="{ active: activeDropdown === 'author' }"
        @click="toggleDropdown('author')"
      >
        исполнителю
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
        :class="{ active: activeDropdown === 'year' }"
        @click="toggleDropdown('year')"
      >
        году выпуска
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
        :class="{ active: activeDropdown === 'genre' }"
        @click="toggleDropdown('genre')"
      >
        жанру
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
  z-index: 1000; // чтобы быть поверх других элементов
  background: #313131; // фон
  border-radius: 8px;
  max-height: 200px; // ограничение по высоте
  width: max-content;
  min-width: 150px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  padding: 8px; // внутренние отступы
  display: none; // по умолчанию скрыт
  flex-direction: column;
  overflow: hidden; // чтобы не было скролла у контейнера
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
}

.filter__wrapper .filter__dropdown.active {
  display: flex; // показываем при активном состоянии
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  margin-top: 15px;
}

/* Внутренний контейнер со списком и полосой прокрутки */
.filter__dropdown-inner {
  display: flex;
  flex-direction: column;
  max-height: 200px; // ограничение по высоте
  overflow-y: auto; // вертикальная прокрутка
  scrollbar-width: thin; // для Firefox
  scrollbar-color: #ad61ff #2e2e2e; // для Firefox
}

/* Для WebKit-браузеров */
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

/* Стили для списка */
.filter__list {
  margin: 0;
  padding: 0;
  list-style: none;
  flex: 1; // занимает всё доступное пространство
}

.filter__item {
  padding: 8px 20px;
  cursor: pointer;
  white-space: nowrap;
}

.filter__item:hover {
  color: #b672ff;
  text-decoration: underline;
}

.filter__button {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid #ffffff;
  border-radius: 60px;
  padding: 6px 20px;
}

.filter__button:not(:last-child) {
  margin-right: 10px;
}
._btn-text:hover {
  border-color: #b672ff;
  color: #b672ff;
  cursor: pointer;
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
</style>
