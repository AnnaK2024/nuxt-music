<template>
  <div>
    <div class="centerblock__search search">
      <svg class="search__svg">
        <use xlink:href="/icons/sprite.svg#icon-search" />
      </svg>
      <input
        v-model="searchQuery"
        class="search__text"
        type="search"
        placeholder="Поиск"
        name="search"
      />
    </div>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="centerblock_content">
      <h2 class="centerblock__h2">{{ categoryName }}</h2>
      <FilterControls />
      <div class="content_playlist playlist">
        <div v-if="filteredTracks.length === 0" class="no-tracks-message">
          Нет треков, соответствующих выбранным фильтрам.
        </div>
        <TrackItem
          v-for="track in filteredTracks"
          :key="track.id"
          :track="track"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "#imports";
import TrackItem from "~/components/TrackItem.vue";
import { useCategoryTracks } from "~/composables/useCategoryTracks";
import { useTracksStore } from "~/stores/tracks";
import FilterControls from "~/components/FilterControls.vue";

const route = useRoute();
const tracksStore = useTracksStore();

const { tracks, categoryName, loading, error, fetchCategoryData } =
  useCategoryTracks();

// computed-привязка для v-model к Pinia-стору (оставлено без изменений)
const searchQuery = computed({
  get: () => tracksStore.filters.searchQuery,
  set: (val) => tracksStore.setFilters({ searchQuery: val }),
});

// Новый computed для фильтрации треков категории (адаптируй логику под свой store)
const filteredTracks = computed(() => {
  let filtered = tracks.value || []; // Начинаем с массива tracks

  // Фильтр по автору
  if (tracksStore.filters.author) {
    filtered = filtered.filter(
      (track) => track.author === tracksStore.filters.author
    );
  }

  // Фильтр по году
  if (tracksStore.filters.year) {
    filtered = filtered.filter(
      (track) => track.year === tracksStore.filters.year
    );
  }

  // Фильтр по жанру
  if (tracksStore.filters.genre) {
    filtered = filtered.filter(
      (track) => track.genre === tracksStore.filters.genre
    );
  }

  // Фильтр по поисковому запросу (по названию, автору, альбому — адаптируй под свои поля)
  if (tracksStore.filters.searchQuery) {
    const query = tracksStore.filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (track) =>
        track.name?.toLowerCase().includes(query) ||
        track.author?.toLowerCase().includes(query) ||
        track.album?.toLowerCase().includes(query)
    );
  }

  // Фильтр по избранным (предполагаю, что у трека есть поле isFavorite или similar)
  if (tracksStore.filters.onlyFavorites) {
    filtered = filtered.filter((track) => track.isFavorite); // Адаптируй под своё поле (например, track.favorite)
  }

  return filtered;
});

// Обновление заголовка страницы при изменении названия категории
watch(categoryName, (newName) => {
  useHead({
    title: `${newName || ""} | Skypro.Music`,
  });
});

// Загрузка данных при изменении ID категории
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchCategoryData(newId);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.centerblock__search {
  width: 100%;
  border-bottom: 1px solid #4e4e4e;
  margin-bottom: 51px;
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
}
.centerblock__h2 {
  font-style: normal;
  font-weight: 400;
  font-size: 64px;
  line-height: 72px;
  letter-spacing: -0.8px;
  margin-bottom: 45px;
}
.search__svg {
  width: 17px;
  height: 17px;
  margin-right: 5px;
  stroke: #ffffff;
  fill: transparent;
}
.search__text {
  -webkit-box-flex: 100;
  -ms-flex-positive: 100;
  flex-grow: 100;
  background-color: transparent;
  border: none;
  padding: 13px 10px 14px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}

.search__text::-webkit-input-placeholder {
  background-color: transparent;
  color: #ffffff;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.search__text:-ms-input-placeholder {
  background-color: transparent;
  color: #ffffff;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.search__text::-ms-input-placeholder {
  background-color: transparent;
  color: #ffffff;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.search__text::placeholder {
  background-color: transparent;
  color: #ffffff;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.no-tracks-message {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
}
</style>
