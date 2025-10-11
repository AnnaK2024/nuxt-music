<template>
  <NuxtLayout name="default">
    <div class="favorites__content">
      <h2>Мои треки</h2>
      <div v-if="favoriteTracks.length === 0" class="empty-state">
        <p>Нет избранных треков.</p>
      </div>
      <div v-else>
        <div
          v-for="track in favoriteTracks"
          :key="track.id"
          class="playlist__item"
        >
          <PlayList />
        </div>
      </div>
      <PlayerBar /></div
  ></NuxtLayout>
</template>


<script setup>
import { computed } from "vue";
import { useTracksStore } from "@/stores/tracks";

const tracksStore = useTracksStore();

const favoriteTracks = computed(() => {
  return tracksStore.tracks.filter((track) =>
    tracksStore.favoriteTrackIds.includes(String(track.id))
  );
});
</script>

<style lang="scss" scoped></style>
