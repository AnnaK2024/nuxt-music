<template>
  <div class="bar">
    <div class="bar__content">
      <div class="bar__player-progress"></div>
      <div class="bar__player-block">
        <div class="bar__player player">
          <div class="player__controls">
            <div class="player__btn-prev">
              <svg class="player__btn-prev-svg">
                <use xlink:href="/icons/sprite.svg#icon-prev"></use>
              </svg>
            </div>
            <div class="player__btn-play _btn">
              <svg class="player__btn-play-svg">
                <use xlink:href="/icons/sprite.svg#icon-play"></use>
              </svg>
            </div>
            <div class="player__btn-next">
              <svg class="player__btn-next-svg">
                <use xlink:href="/icons/sprite.svg#icon-next"></use>
              </svg>
            </div>
            <div class="player__btn-repeat _btn-icon">
              <svg class="player__btn-repeat-svg">
                <use xlink:href="/icons/sprite.svg#icon-repeat"></use>
              </svg>
            </div>
            <div class="player__btn-shuffle _btn-icon">
              <svg class="player__btn-shuffle-svg">
                <use xlink:href="/icons/sprite.svg#icon-shuffle"></use>
              </svg>
            </div>
          </div>

          <div class="player__track-play track-play">
            <div class="track-play__contain">
              <div class="track-play__image">
                <svg class="track-play__svg">
                  <use xlink:href="/icons/sprite.svg#icon-note"></use>
                </svg>
              </div>
              <div class="track-play__author">
                <a class="track-play__author-link" href="http://">Ты та...</a>
              </div>
              <div class="track-play__album">
                <a class="track-play__album-link" href="http://">Баста</a>
              </div>
            </div>

            <div class="track-play__like-dis">
              <div class="track-play__like _btn-icon">
                <svg class="track-play__like-svg">
                  <use xlink:href="/icons/sprite.svg#icon-like"></use>
                </svg>
              </div>
              <div class="track-play__dislike _btn-icon">
                <svg class="track-play__dislike-svg">
                  <use xlink:href="/icons/sprite.svg#icon-dislike"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="bar__volume-block volume">
          <div class="volume__content">
            <div class="volume__image">
              <svg class="volume__svg">
                <use xlink:href="/icons/sprite.svg#icon-volume"></use>
              </svg>
            </div>
            <div class="volume__progress _btn">
              <input class="volume__progress-line _btn" type="range" name="range" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
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

.track-play__svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
}

.track-play__author {
  grid-row: 1;
  grid-column: 2;
  grid-area: author;
  min-width: 49px;
}

.track-play__author-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  white-space: nowrap;
}

.track-play__album {
  grid-row: 2;
  grid-column: 2;
  grid-area: album;
  min-width: 49px;
}

.track-play__album-link {
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 24px;
  color: #ffffff;
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
  margin-left: 26%;
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
