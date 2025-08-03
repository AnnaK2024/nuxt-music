<template>
  <NuxtLayout name="default">
    <div class="centerblock">
      <div v-if="loading">Загрузка...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class="centerblock_content">
        <h1>{{ categoryName }}</h1>
        <div class="content_playlist playlist">
          <TrackItem v-for="track in tracks" :key="track.id" :track="track" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import TrackItem from "~/components/track/TrackItem.vue";
import { useRoute } from "vue-router";
import { watch } from "vue";
import { useHead } from "#imports"; // или "@vueuse/head" / "nuxt/app"
import { useCategoryTracks } from "~/composables/useCategoryTracks";

const route = useRoute();
const { tracks, categoryName, loading, error, fetchCategoryData } = useCategoryTracks();

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

<style lang="scss" scoped></style>
