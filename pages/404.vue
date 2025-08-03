<template>
  <NuxtLayout name="default">
    <div class="centerblock__search search">
      <svg class="search__svg">
        <use xlink:href="/icons/sprite.svg#icon-search" />
      </svg>
      <input
        class="search__text"
        type="search"
        placeholder="Поиск"
        name="search"
      />
    </div>
    <section class="not-found">
      <h1>404</h1>
      <p class="title">
        Страница не найдена
        <img class="logo__image" src="/img/smile_crying.png" alt="Слезы" />
      </p>
      <p class="subtitle">
        Возможно, она была удалена<br />или перенесена на другой адрес
      </p>
      <NuxtLink to="/" class="btn">Вернуться на главную</NuxtLink>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead } from "#imports";

useHead({
  title: "404 — Страница не найдена",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>

<style scoped>
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
.not-found {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #181818; /* тёмный фон */
  color: #fff;
  text-align: center;
  padding: 0 20px;
  user-select: none;
}

.not-found h1 {
  font-size: 160px;
  font-weight: 400;
  margin: 0;
  line-height: 168px;
}

.title {
  font-size: 1.75rem;
  margin-top: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title span {
  font-size: 1.75rem;
}

.subtitle {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #888;
  line-height: 1.3;
}

.logo__image {
  width: 52px;
  height: 52px;
}
.btn {
  margin-top: 2rem;
  background-color: #5c2e91; /* фиолетовый */
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
  user-select: none;
}

.btn:hover {
  background-color: #7e49b8;
}
</style>
