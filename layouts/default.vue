<template>
  <div class="wrapper">
    <div class="container">
      <div class="main">
        <NavBar v-if="showMain" />
        <div class="main__centerblock">
          <slot />
        </div>
        <SideBar v-if="showMain" />
      </div>
      <PlayerBar v-if="showMain" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NavBar from "~/components/NavBar.vue";
import PlayerBar from "~/components/PlayerBar.vue";
import SideBar from "~/components/SideBar.vue";

const route = useRoute()

const hiddenPaths = ['/login', '/signup']

const showMain = computed(() => !hiddenPaths.includes(route.path))

useHead({
  title: "Моя музыка | Skypro.Music",
  meta: [
    { name: "description", content: "Ваши любимые треки в одном месте" },
    { property: "og:title", content: "Моя музыка | Skypro Music" },
    { property: "og:site_name", content: "Skypro Music" },
    { name: "twitter:title", content: "Skypro Music — Моя музыка" },
  ],
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #181818;
}

.container {
  max-width: 1920px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background-color: #181818;
}
.main {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.main__centerblock {
  width: auto;
  -webkit-box-flex: 3;
  -ms-flex-positive: 3;
  flex-grow: 3;
  padding: 20px 40px 20px 111px;
}
</style>
