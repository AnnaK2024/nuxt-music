<template>
  <div class="centerblock__content playlist-content">
    <div class="content__title playlist-title">
      <div class="playlist-title__col col01">Трек</div>
      <div class="playlist-title__col col02">Исполнитель</div>
      <div class="playlist-title__col col03">Альбом</div>
      <div class="playlist-title__col col04">
        <svg class="playlist-title__svg">
          <use xlink:href="/icons/sprite.svg#icon-watch" />
        </svg>
      </div>
    </div>

    <div v-if="loading" class="content__playlist playlist">
      <div class="loading">
        Загрузка треков
        <span class="loading-dots">
          <span>.</span><span>.</span><span>.</span><span>.</span><span>.</span>
        </span>
      </div>
    </div>

    <div v-else-if="error" class="content__playlist playlist">
      <div class="error">Ошибка загрузки треков: {{ error }}</div>
    </div>

    <div v-else class="content__playlist playlist">
      <TrackItem v-for="track in localTracks" :key="track.id" :track="track" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import TrackItem from "~/components/TrackItem.vue";
import { useTracksStore } from "~/stores/tracks";
import { useTracks } from "~/composables/useTracks"; // если у вас есть композиция для загрузки/состояния

const props = defineProps({
  tracks: { type: Array, default: null },
});

// локальный стор (если нужен для загрузки/фильтрации)
const tracksStore = useTracksStore();
const { loading, error } = useTracks();

// Если проп tracks передали — используем его; иначе — используем tracksStore.filteredTracks
const localTracks = computed(() => props.tracks ?? tracksStore.filteredTracks);

onMounted(() => {
  // Загружаем все треки только если не передали props.tracks
  if (!props.tracks) {
    tracksStore.loadTracks();
  }
});
</script>

<style lang="scss" scoped>
.centerblock__content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.content__title {
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
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-bottom: 24px;
}

.content__playlist {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow-y: auto;
}

.playlist-title__col {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 2px;
  color: #696969;
  text-transform: uppercase;
}

.playlist-title__svg {
  width: 12px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.col01 {
  width: 447px;
}

.col02 {
  width: 321px;
}

.col03 {
  width: 245px;
}

.col04 {
  width: 60px;
  text-align: end;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  height: 100px;
  color: #555;
  gap: 8px;
  user-select: none;
}

.loading-dots span {
  opacity: 0;
  animation-name: blink;
  animation-duration: 1.25s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  font-weight: 700;
  font-size: 28px;
  color: #888;
  line-height: 1;
}

.loading-dots span:nth-child(1) {
  animation-delay: 0s;
}
.loading-dots span:nth-child(2) {
  animation-delay: 0.25s;
}
.loading-dots span:nth-child(3) {
  animation-delay: 0.5s;
}
.loading-dots span:nth-child(4) {
  animation-delay: 0.75s;
}
.loading-dots span:nth-child(5) {
  animation-delay: 1s;
}

@keyframes blink {
  0%,
  20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
