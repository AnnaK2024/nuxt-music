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
import { useRoute } from "vue-router";
import { useFavoritesStore } from "~/stores/favorites";
import { usePlayerStore } from "~/stores/player";

const props = defineProps({
  track: { type: Object, required: true },
  index: { type: Number, required: true },
  pageTracks: { type: Array, required: true },
});

const route = useRoute();
const track = toRef(props, "track");
const pageTracks = toRef(props, "pageTracks");

const favoritesStore = useFavoritesStore();
const playerStore = usePlayerStore();

const getTrackId = (t) => {
  return t?._id || t?.id || t?.trackId || t?.track_id || null;
};

const getPageContext = () => {
  const routeName = route.name;

  if (routeName?.includes("favorites")) return "favorites";
  if (routeName?.includes("categories")) return "category";
  if (routeName?.includes("selection")) return "category";

  return "main";
};

const isLiked = computed(() => {
  const id = getTrackId(track.value);
  if (!id) return false;
  return favoritesStore.isFavorite(id).value;
});

const isCurrentTrack = computed(() => {
  const trackId = getTrackId(track.value);
  const currentTrackId = getTrackId(playerStore.currentTrack);

  if (!trackId || !currentTrackId) return false;
  return String(trackId) === String(currentTrackId);
});

const handleClick = () => {
  const trackId = getTrackId(track.value);

  console.log("🎯 TrackItem.handleClick", {
    trackName: track.value.name,
    trackId: trackId,
    trackUrl: track.value.track_file || track.value.url,
    pageTracksLength: pageTracks.value?.length,
    pageContext: getPageContext(),
  });

  if (!pageTracks.value || !pageTracks.value.length) {
    console.warn("❌ pageTracks пусто или не передано");
    return;
  }

  playerStore.setPlaylist(pageTracks.value, getPageContext());

  playerStore.setCurrentTrack(track.value);

  playerStore.play();
};

const handleLike = async () => {
  const id = getTrackId(track.value);
  if (!id) {
    console.warn("❌ Не найден ID трека для лайка");
    return;
  }
  try {
    await favoritesStore.toggleFavorite(id, track.value);
  } catch (err) {
    console.error("Ошибка при лайке:", err);
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
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background-color: #ad61ff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1.5s infinite;
}


@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
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
