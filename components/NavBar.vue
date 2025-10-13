<template>
  <nav class="main__nav nav">
    <div class="nav__logo logo">
      <NuxtImg
        img
        class="logo__image"
        src="/img/logo.png"
        alt="Логотип"
        :placeholder="[15]"
        width="113.33px"
        height="17px"
        loading="eager"
        quality="90"
        format="webp"
        preload
      />
    </div>
    <div
      class="nav__burger burger"
      aria-label="Toggle menu"
      role="button"
      tabindex="0"
      @click="toggleMenu"
      @keydown.enter.prevent="toggleMenu"
      @keydown.space.prevent="toggleMenu"
    >
      <span class="burger__line" />
      <span class="burger__line" />
      <span class="burger__line" />
    </div>
    <div class="nav__menu menu" :class="{ 'menu--open': isMenuOpen }">
      <ul class="menu__list">
        <li class="menu__item">
          <NuxtLink to="/" class="menu__link" @click="handleMainClick"
            >Главное</NuxtLink
          >
        </li>
        <li class="menu__item">
          <NuxtLink to="/favorites" class="menu__link">Мой плейлист</NuxtLink>
        </li>
        <li class="menu__item">
          <NuxtLink to="#" class="menu__link" @click="logout">Выйти</NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useTracksStore } from "~/stores/tracks"; // Импорт твоего store (путь может быть ~/stores/tracks.js)

const { logout } = useAuth(); // Предполагаю, что useAuth уже импортирован глобально
const isMenuOpen = ref(false);
const tracksStore = useTracksStore(); // Экземпляр store

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function handleMainClick() {
  tracksStore.clearFilters(); // Сброс всех фильтров через store
}
</script>

<style scoped lang="scss">
.main__nav {
  width: 244px;
  background-color: #181818;
  padding: 20px 0 20px 36px;
}
.nav__logo {
  width: 113.33px;
  height: 43px;
  padding: 13px 0 13px 0;
  background-color: transparent;
  margin-bottom: 20px;
}
.nav__burger {
  width: 20px;
  height: 36px;
  padding: 13px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.nav__menu {
  display: none;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav__menu.menu--open {
  display: block;
  visibility: visible;
  opacity: 1;
}

.logo__image {
  width: 113.33px;
  height: 17px;
}

.burger__line {
  display: inline-block;
  width: 100%;
  height: 1px;
  background-color: #d3d3d3;
}

.menu__list {
  padding: 18px 0 10px 0;
}

.menu__item {
  padding: 5px 0;
  margin-bottom: 16px;
}

.menu__link {
  color: #ffffff;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;
}

.menu__link:hover {
  text-decoration: underline;
}
</style>
