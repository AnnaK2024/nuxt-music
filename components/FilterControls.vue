<template>
  <div class="centerblock__filter filter">
    <div class="filter__title">Искать по:</div>
    <div class="filter__wrapper">
      <div
        class="filter__button button-author _btn-text"
        :class="{ active: activeFilter === 'author' }"
        @click="toggleFilter('author')"
      >
        исполнителю
      </div>
      <div v-if="activeFilter === 'author'" class="filter__dropdown">
        <ul class="filter__list">
          <li
            v-for="item in authorItems"
            :key="item"
            class="filter__item"
            @click="toggleFilter('author')"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div class="filter__wrapper">
      <div
        class="filter__button button-year _btn-text"
        :class="{ active: activeFilter === 'year' }"
        @click="toggleFilter('year')"
      >
        году выпуска
      </div>
      <div v-if="activeFilter === 'year'" class="filter__dropdown">
        <ul class="filter__list">
          <li
            v-for="item in yearItems"
            :key="item"
            class="filter__item"
            @click="toggleFilter('year')"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div class="filter__wrapper">
      <div
        class="filter__button button-genre _btn-text"
        :class="{ active: activeFilter === 'genre' }"
        @click="toggleFilter('genre')"
      >
        жанру
      </div>
      <div v-if="activeFilter === 'genre'" class="filter__dropdown">
        <ul class="filter__list">
          <li
            v-for="item in genreItems"
            :key="item"
            class="filter__item"
            @click="toggleFilter('genre')"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const activeFilter = ref(null);

const { data: response } = await useFetch(
  "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/",
  { transform: (response) => response.data }
);

const tracks = computed(() => response.value || []);

const authorItems = computed(() => {
  if (!tracks.value) return [];
  const items = new Set();
  tracks.value.forEach((track) => {
    if (track.author) {
      items.add(track.author);
    }
  });
  return Array.from(items).sort((a, b) => {
    if (a === "Неизвестно") return 1;
    if (b === "Неизвестно") return -1;
    return a.localeCompare(b);
  });
});

const yearItems = computed(() => {
  if (!tracks.value) return [];
  const items = new Set();
  tracks.value.forEach((track) => {
    const year = track.release_date?.split("<")[0] || "Неизвестно";
    items.add(year);
  });
  return Array.from(items).sort((a, b) => {
    if (a === "Неизвестно") return 1;
    if (b === "Неизвестно") return -1;
    return b.localeCompare(a);
  });
});

const genreItems = computed(() => {
  if (!tracks.value) return [];
  const items = new Set();
  tracks.value.forEach((track) => {
    if (Array.isArray(track.genre)) {
      track.genre.forEach((g) => g && items.add(g.toLowerCase().trim()));
    } else if (track.genre) {
      items.add(track.genre.toLowerCase().trim());
    }
  });
  return Array.from(items).sort((a, b) => {
    if (a === "неизвестно") return 1;
    if (b === "неизвестно") return -1;
    return a.localeCompare(b);
  });
});

const toggleFilter = (filter) => {
  console.log(filter);
  activeFilter.value = activeFilter.value === filter ? null : filter;
};
</script>

<style lang="scss" scoped>
.centerblock__filter {
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
  margin-bottom: 51px;
}
.filter__title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-right: 15px;
}
.filter__wrapper{
  padding-right: 15px;
}
.filter__button {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid #ffffff;
  border-radius: 60px;
  padding: 6px 20px;
}

.filter__button:not(:last-child) {
  margin-right: 10px;
}
._btn-text:hover {
  border-color: #d9b6ff;
  color: #d9b6ff;
  cursor: pointer;
}

._btn-icon:hover svg {
  fill: transparent;
  stroke: #acacac;
  cursor: pointer;
}

._btn-text:active {
  border-color: #ad61ff;
  color: #ad61ff;
  cursor: pointer;
}

._btn-icon:active svg {
  fill: transparent;
  stroke: #ffffff;
  cursor: pointer;
}

._btn-icon:active .track-play__like-svg,
._btn-icon:active .track-play__dislike-svg {
  fill: #696969;
  stroke: #ffffff;
  cursor: pointer;
}
</style>
