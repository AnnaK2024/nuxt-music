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
        @input="tracksStore.setFilters({ searchQuery })"
      />
    </div>

    <h2 class="centerblock__h2">Мои треки</h2>

    <div v-if="favoriteTracks.length === 0" class="empty-state">
      <p class="no-tracks-message">Нет избранных треков</p>
    </div>
    <div v-else>
      <PlaylistItem
        v-for="track in favoriteTracks"
        :key="track.id"
        :track="track"
      />
      <FilterControls />
    </div>
    <PlayerBar />
  </NuxtLayout>
</template>

<script setup>
import { computed } from "vue";
import { useTracksStore } from "~/stores/tracks";

const tracksStore = useTracksStore();

const favoriteTracks = computed(() => {
  return tracksStore.tracks.filter((track) =>
    tracksStore.favoriteTrackIds.includes(String(track.id))
  );
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
  font-size: 16px;
}
</style>
