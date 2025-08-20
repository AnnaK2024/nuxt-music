<template>
  <NuxtLayout name="default">
    <NavBar />
    <div class="favorites__content">
      <h2>Избранные треки</h2>
      <div v-if="favorites.length === 0">
        <p>Нет избранных треков.</p>
      </div>
      <div v-else>
        <PlayList :tracks="favorites" />
      </div>
    </div>
    <PlayerBar />
  </NuxtLayout>
</template>

<script setup>
import { useFavoritesStore } from '~/stores/user.js';
import { onMounted } from 'vue';

const favoritesStore = useFavoritesStore();
const favorites = favoritesStore.favorites;

// Загрузка избранных треков при монтировании компонента
onMounted(() => {
  favoritesStore.loadFavorites();
});
</script>

<style lang="scss" scoped></style>