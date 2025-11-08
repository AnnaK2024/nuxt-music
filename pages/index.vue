<template>
  <!-- Пока данные загружаются, показываем скелетон -->
  <SkeletonPage v-if="loading" />

  <!-- Когда загрузка завершена, показываем реальный контент -->
  <div v-else>
    <div class="centerblock__search search">
      <svg class="search__svg">
        <use xlink:href="/icons/sprite.svg#icon-search" />
      </svg>
      <input
        v-model="tracksStore.filters.searchQuery"
        class="search__text"
        type="search"
        placeholder="Поиск"
        name="search"
      />
    </div>
    <h2 class="centerblock__h2">Треки</h2>
    <FilterControls />
    <PlayList />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // Добавь ref
import { useTracksStore } from "~/stores/tracks";
import { useFavoritesStore } from "~/stores/favorites";
import SkeletonPage from "~/components/SkeletonPage.vue"; // Импортируй скелетон

const tracksStore = useTracksStore();
const favoritesStore = useFavoritesStore();

// Состояние загрузки: true по умолчанию
const loading = ref(true);

onMounted(async () => {
  try {
    await Promise.all([
      tracksStore.loadTracks(),
      favoritesStore.loadFavorites(),
    ]);
    // После загрузки отключаем скелетон
    loading.value = false;
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    if (error.response?.status === 401) {
      await navigateTo("/login");
      return;
    }
    // Даже при ошибке отключаем скелетон (или покажи ошибку вместо него)
    loading.value = false;
  }
});
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
