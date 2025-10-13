<template>
  <div class="playlist__item">
    <div class="playlist__track track" @click="handleClick">
      <div class="track__title">
        <div class="track__title-image">
          <svg class="track__title-svg">
            <use xlink:href="/icons/sprite.svg#icon-note" />
          </svg>
          <div v-if="isCurrentTrack" class="pulse-dot" />
        </div>
        <div class="track__title-text">
          <a class="track__title-link" href="http:#">
            {{ track.name }}
            <span class="track__title-span">{{ track.titleSpan }}</span>
          </a>
        </div>
      </div>
      <div class="track__author">
        <a class="track__author-link" href="http:#">{{ track.author }}</a>
      </div>
      <div class="track__album">
        <a class="track__album-link" href="http:#">{{ track.album }}</a>
      </div>
      <div class="track__time">
        <svg
          class="track__time-svg"
          :class="{ 'track__time-svg--liked': isLiked }"
          @click.stop="handleLike"
        >
          <use xlink:href="/icons/sprite.svg#icon-like" />
        </svg>
        <span class="track__time-text">{{
          formatTime(track.duration_in_seconds)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRef, computed } from "vue";
import { useFavoritesStore } from "~/composables/useFavoriteTracks";

const props = defineProps({
  track: {
    type: Object,
    required: true,
  },
});

const track = toRef(props, "track"); // привязка к конкретному пропсу

const { playTrack, currentTrack } = useAudioPlayer();
const tracksStore = useTracksStore();

const favoritesStore = useFavoritesStore();

// Проверяем, лайкнут ли уже трек
const isLiked = computed(() => {
  const id = track.value?.id;
  if (id === undefined || id === null || id === "") return false;
  return tracksStore.favoriteTrackIds.includes(String(id));
});

// Проверяем, является ли трек текущим
const isCurrentTrack = computed(
  () =>
    !!(
      currentTrack.value &&
      String(currentTrack.value.id) === String(track.value.id)
    )
);

const handleClick = () => {
  playTrack(track.value);
};

const handleLike = async () => {
  const id = track.value.id;
  if (!id) {
    console.warn("Invalid track ID, cannot toggle favorite");
    return;
  }

  try {
    if (isLiked.value) {
      // Удаляем с сервера
      await favoritesStore.removeFavorite(id);
      // Синхронизируем локально
      tracksStore.toggleFavorite(id);
    } else {
      // Добавляем на сервер (передаём полный объект трека)
      await favoritesStore.addFavorite(track.value);
      // Синхронизируем локально
      tracksStore.toggleFavorite(id);
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    // Опционально: покажи пользователю ошибку (например, через toast или alert)
  }
};
</script>

<style lang="scss" scoped>
.playlist__item {
  width: 100%;
  display: block;
  margin-bottom: 12px;
}

.playlist__track {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.track__title {
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
  width: 447px;
}

.track__title-image {
  position: relative;
  width: 51px;
  height: 51px;
  padding: 16px;
  background: #313131;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-right: 17px;
}

.track__title-svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
  cursor: pointer;
}

.pulse-dot {
  position: absolute;
  top: 6px; /* подкорректируйте по дизайну */
  right: 6px; /* подкорректируйте по дизайну */
  width: 10px;
  height: 10px;
  background-color: #ad61ff;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.track__title-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}

.track__title-span {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #4e4e4e;
}

.track__author {
  width: 321px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}

.track__author-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-align: left;
}

.track__album {
  width: 245px;
}

.track__album-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #696969;
}

.track__time-svg {
  width: 14px;
  height: 12px;
  margin-right: 17px;
  fill: transparent;
  stroke: #696969;
  transition: fill 0.2s ease;
}

.track__time-svg--liked {
  fill: #ad61ff;
}
.track__time-text {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  color: #696969;
}
</style>
