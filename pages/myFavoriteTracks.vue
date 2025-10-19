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
        @input="favoritesStore.setFilters({ searchQuery })"
      />
    </div>

    <h2 class="centerblock__h2">Мои треки</h2>
    <FilterControls :store="favoritesStore" />
    <div v-if="favoritesStore.favoriteTracks.length === 0" class="empty-state">
      <p class="no-tracks-message">Нет избранных треков</p>
    </div>
    <div v-else>
      <PlayList :tracks="favoritesStore.favoriteTracks" />
    </div>
    <PlayerBar />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { useFavoritesStore } from "~/stores/favorites";

const searchQuery = ref("");
const favoritesStore = useFavoritesStore();

onMounted(async () => {
  console.log("Component mounted: Starting loadFavorites..."); 
  try {
    await favoritesStore.loadFavorites();
    console.log(
      "After load: favoriteTracks.length:",
      favoritesStore.favoriteTracks.length
    ); 
  } catch (error) {
    console.error("Ошибка загрузки:", error);
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
.no-tracks-message {
  text-align: left;
  padding: 20px;
  color: #666;
  font-size: 35px;
}
</style>
