<template>
  <div class="main__sidebar sidebar">
    <div class="sidebar__personal">
      <p class="sidebar__personal-name">Sergey.Ivanov</p>
      <div class="sidebar__icon">
        <svg>
          <use xlink:href="/icons/sprite.svg#logout" />
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
</template>

<script setup></script>

<style lang="scss" scoped>
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

.sidebar__personal-name {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-right: 16px;
}

.sidebar__icon {
  width: 43px;
  height: 43px;
  background-color: #313131;
  border-radius: 50%;
  cursor: pointer;
}

.sidebar__block {
  height: 100%;
  padding: 240px 0 0 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}

.sidebar__list {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.sidebar__item {
  width: 250px;
  height: 150px;
}

.sidebar__item:not(:last-child) {
  margin-bottom: 30px;
}

.sidebar__link {
  width: 100%;
  height: 100%;
}

.sidebar__img {
  width: 100%;
  height: auto;
}
</style>
