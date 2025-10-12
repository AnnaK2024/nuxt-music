<template>
  <NuxtLayout name="default">
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
      <div class="content_playlist playlist">
        <TrackItem v-for="track in tracks" :key="track.id" :track="track" />
      </div>
    </div>

    <FilterControls />
  </NuxtLayout>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "#imports";
import TrackItem from "~/components/TrackItem.vue";
import FilterControls from "~/components/FilterControls.vue";
import { useCategoryTracks } from "~/composables/useCategoryTracks";
import { useTracksStore } from "~/stores/tracks";

const route = useRoute();
const tracksStore = useTracksStore();

const { tracks, categoryName, loading, error, fetchCategoryData } =
  useCategoryTracks();

// computed-привязка для v-model к Pinia-стору
const searchQuery = computed({
  get: () => tracksStore.filters.searchQuery,
  set: (val) => tracksStore.setFilters({ searchQuery: val }),
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
</style>
