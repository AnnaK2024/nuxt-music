<template>
  <div class="wrapper">
    <div class="container">
      <main class="main">
        <nav class="main__nav nav">
          <div class="nav__logo logo">
            <NuxtImg class="logo__image" src="/img/logo.png" />
          </div>
          <div class="nav__burger burger">
            <span class="burger__line" />
            <span class="burger__line" />
            <span class="burger__line" />
          </div>
        </nav>
        <div class="main__centerblock centerblock">
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
              <NuxtImg class="logo__image" src="/img/smile_crying.png" />
            </p>
            <p class="subtitle">
              Возможно, она была удалена<br />или перенесена на другой адрес
            </p>
            <NuxtLink to="/" class="btn">Вернуться на главную</NuxtLink>
          </section>
        </div>

        <div class="main__sidebar sidebar">
          <div class="sidebar__personal">
            <div class="sidebar__icon">
              <svg>
                <use xlink:href="/icons/sprite.svg#logout" />
              </svg>
            </div>
          </div>
        </div>
      </main>
      <div class="bar">
        <div class="bar__content">
          <div class="bar__player-progress" />
          <div class="bar__player-block">
            <div class="bar__player player">
              <div class="player__controls">
                <div class="player__btn-prev">
                  <svg class="player__btn-prev-svg">
                    <use xlink:href="/icons/sprite.svg#icon-prev" />
                  </svg>
                </div>
                <div class="player__btn-play _btn">
                  <svg class="player__btn-play-svg">
                    <use xlink:href="/icons/sprite.svg#icon-play" />
                  </svg>
                </div>
                <div class="player__btn-next">
                  <svg class="player__btn-next-svg">
                    <use xlink:href="/icons/sprite.svg#icon-next" />
                  </svg>
                </div>
                <div class="player__btn-repeat _btn-icon">
                  <svg class="player__btn-repeat-svg">
                    <use xlink:href="/icons/sprite.svg#icon-repeat" />
                  </svg>
                </div>
                <div class="player__btn-shuffle _btn-icon">
                  <svg class="player__btn-shuffle-svg">
                    <use xlink:href="/icons/sprite.svg#icon-shuffle" />
                  </svg>
                </div>
              </div>

              <div class="player__track-play track-play">
                <div class="track-play__contain">
                  <div class="track-play__image" />
                  <div class="track-play__author" />
                  <div class="track-play__album" />
                </div>

                <div class="track-play__like-dis">
                  <div class="track-play__like _btn-icon">
                    <svg class="track-play__like-svg">
                      <use xlink:href="/icons/sprite.svg#icon-like" />
                    </svg>
                  </div>
                  <div class="track-play__dislike _btn-icon">
                    <svg class="track-play__dislike-svg">
                      <use xlink:href="/icons/sprite.svg#icon-dislike" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="bar__volume-block volume">
              <div class="volume__content">
                <div class="volume__image">
                  <svg class="volume__svg">
                    <use xlink:href="/icons/sprite.svg#icon-volume" />
                  </svg>
                </div>
                <div class="volume__progress _btn">
                  <input
                    class="volume__progress-line _btn"
                    type="range"
                    name="range"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from "#imports";

useHead({
  title: "404 — Страница не найдена",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #383838;
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

.logo__image {
  width: 113.33px;
}

.nav__burger {
  width: 20px;
  height: 36px;
  padding: 13px 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.burger__line {
  display: inline-block;
  width: 100%;
  height: 1px;
  background-color: #d3d3d3;
}

.main__centerblock {
  width: auto;
  -webkit-box-flex: 3;
  -ms-flex-positive: 3;
  flex-grow: 3;
  padding: 20px 40px 20px 111px;
}

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
.main__sidebar {
  max-width: 418px;
  padding: 20px 90px 20px 78px;
}

.sidebar__personal {
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
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 12px 0 15px 0;
}

.sidebar__icon {
  width: 43px;
  height: 43px;
  background-color: #313131;
  border-radius: 50%;
  cursor: pointer;
}

.bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(28, 28, 28, 0.5);
}

.bar__content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.bar__player-progress {
  width: 100%;
  height: 5px;
  background: #2e2e2e;
}

.bar__player-block {
  height: 73px;
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
}

.bar__player {
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
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}

.bar__volume-block {
  width: auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 92px 0 0;
}

.player__controls {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  padding: 0 27px 0 31px;
}

.player__btn-prev,
.player__btn-play,
.player__btn-next,
.player__btn-repeat,
.player__btn-shuffle {
  padding: 5px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.player__btn-prev {
  margin-right: 23px;
}

.player__btn-prev-svg {
  width: 15px;
  height: 14px;
}

.player__btn-play {
  margin-right: 23px;
}

.player__btn-play-svg {
  width: 22px;
  height: 20px;
  fill: #d9d9d9;
}

.player__btn-next {
  margin-right: 28px;
  fill: #a53939;
}

.player__btn-next-svg {
  width: 15px;
  height: 14px;
  fill: inherit;
  stroke: #d9d9d9;
}

.player__btn-repeat {
  margin-right: 24px;
}

.player__btn-repeat-svg {
  width: 18px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.player__btn-shuffle {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.player__btn-shuffle-svg {
  width: 19px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.player__track-play {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}

.track-play__contain {
  width: auto;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: auto 1fr;
  grid-template-columns: auto 1fr;
  grid-template-areas: "image author" "image album";
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.track-play__image {
  width: 51px;
  height: 51px;
  background-color: #313131;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-right: 12px;
  grid-row: 1;
  -ms-grid-row-span: 2;
  grid-column: 1;
  grid-area: image;
}

.track-play__author {
  width: 59px;
  height: 15px;
  background-color: #313131;
}

.track-play__album {
  width: 59px;
  height: 15px;
  background-color: #313131;
}

.track-play__like-dis {
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
  margin-left: 10%;
}

.track-play__like,
.track-play__dislike {
  padding: 5px;
}

.track-play__like-svg {
  width: 14px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.track-play__dislike {
  margin-left: 28.5px;
}

.track-play__dislike-svg {
  width: 14.34px;
  height: 13px;
  fill: transparent;
  stroke: #696969;
}

.volume__content {
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
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: end;
}

.volume__image {
  width: 13px;
  height: 18px;
  margin-right: 17px;
}

.volume__svg {
  width: 13px;
  height: 18px;
  fill: transparent;
}

.volume__progress {
  width: 109px;
}

.volume__progress-line {
  width: 109px;
}
</style>
