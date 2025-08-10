<template>
  <div class="wrapper">
    <div class="container">
      <main class="main">
        <nav class="main__nav nav">
          <div class="nav__logo logo">
            <img class="logo__image" src="/img/logo.png" />
          </div>
          <div class="nav__burger burger">
            <span class="burger__line" />
            <span class="burger__line" />
            <span class="burger__line" />
          </div>
          <div class="nav__menu menu">
            <ul class="menu__list">
              <li class="menu__item">
                <a href="#" class="menu__link">Главное</a>
              </li>
              <li class="menu__item">
                <a href="#" class="menu__link">Мой плейлист</a>
              </li>
              <li class="menu__item">
                <a href="../signin.html" class="menu__link">Войти</a>
              </li>
            </ul>
          </div>
        </nav>
        <div class="main__centerblock centerblock">
          <div class="centerblock__search search">
            <svg class="search__svg">
              <use xlink:href="/icon/sprite.svg#icon-search" />
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
              <img
                class="logo__image"
                src="/img/smile_crying.png"
                alt="Слезы"
              />
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
                <use xlink:href="/icon/sprite.svg#logout" />
              </svg>
            </div>
          </div>
          <div class="sidebar__block">
            <div class="sidebar__list">
              <div class="sidebar__item">
                <a class="sidebar__link" href="#">
                  <img
                    class="sidebar__img"
                    src="/img/playlist01.png"
                    alt="day's playlist"
                  />
                </a>
              </div>
              <div class="sidebar__item">
                <a class="sidebar__link" href="#">
                  <img
                    class="sidebar__img"
                    src="/img/playlist02.png"
                    alt="day's playlist"
                  />
                </a>
              </div>
              <div class="sidebar__item">
                <a class="sidebar__link" href="#">
                  <img
                    class="sidebar__img"
                    src="/img/playlist03.png"
                    alt="day's playlist"
                  />
                </a>
              </div>
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
                    <use xlink:href="/icon/sprite.svg#icon-prev" />
                  </svg>
                </div>
                <div class="player__btn-play _btn">
                  <svg class="player__btn-play-svg">
                    <use xlink:href="/icon/sprite.svg#icon-play" />
                  </svg>
                </div>
                <div class="player__btn-next">
                  <svg class="player__btn-next-svg">
                    <use xlink:href="/icon/sprite.svg#icon-next" />
                  </svg>
                </div>
                <div class="player__btn-repeat _btn-icon">
                  <svg class="player__btn-repeat-svg">
                    <use xlink:href="/icon/sprite.svg#icon-repeat" />
                  </svg>
                </div>
                <div class="player__btn-shuffle _btn-icon">
                  <svg class="player__btn-shuffle-svg">
                    <use xlink:href="/icon/sprite.svg#icon-shuffle" />
                  </svg>
                </div>
              </div>

              <div class="player__track-play track-play">
                <div class="track-play__contain">
                  <div class="track-play__image">
                    <svg class="track-play__svg">
                      <use xlink:href="/icon/sprite.svg#icon-note" />
                    </svg>
                  </div>
                  <div class="track-play__author">
                    <a class="track-play__author-link" href="http://"
                      >Ты та...</a
                    >
                  </div>
                  <div class="track-play__album">
                    <a class="track-play__album-link" href="http://">Баста</a>
                  </div>
                </div>

                <div class="track-play__like-dis">
                  <div class="track-play__like _btn-icon">
                    <svg class="track-play__like-svg">
                      <use xlink:href="/icon/sprite.svg#icon-like" />
                    </svg>
                  </div>
                  <div class="track-play__dislike _btn-icon">
                    <svg class="track-play__dislike-svg">
                      <use xlink:href="/icon/sprite.svg#icon-dislike" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="bar__volume-block volume">
              <div class="volume__content">
                <div class="volume__image">
                  <svg class="volume__svg">
                    <use xlink:href="/icon/sprite.svg#icon-volume" />
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
