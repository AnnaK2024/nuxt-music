<template>
  <div class="skeleton-page">
    <!-- Хедер -->
    <div class="skeleton-header">
      <div class="skeleton-logo"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-search-icon"></div>
    </div>

    <!-- Поисковая строка -->
    <div class="skeleton-search-bar">
      <div class="skeleton-search-input"></div>
    </div>

    <!-- Кнопки -->
    <div class="skeleton-buttons">
      <div class="skeleton-button"></div>
      <div class="skeleton-button small"></div>
    </div>

    <!-- Список треков -->
    <div class="skeleton-playlist">
      <div v-for="n in 20" :key="n" class="skeleton-track">
        <div class="skeleton-cover"></div>
        <div class="skeleton-track-info">
          <div class="skeleton-title-line"></div>
          <div class="skeleton-artist-line"></div>
        </div>
        <div class="skeleton-duration"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-page {
  background-color: #181818; /* Тёмный фон, как в Spotify */
  color: #fff;
  padding: 20px;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.skeleton-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.skeleton-logo {
  width: 40px;
  height: 40px;
  background-color: #404040;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-title {
  height: 24px;
  width: 80px; /* Для "Треки" */
  background-color: #404040;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
  flex: 1;
}

.skeleton-search-icon {
  width: 24px;
  height: 24px;
  background-color: #404040;
  border-radius: 50%; /* Круг для иконки поиска */
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-search-bar {
  margin-bottom: 20px;
}

.skeleton-search-input {
  height: 40px;
  background-color: #404040;
  border-radius: 20px; /* Закруглённый поиск */
  animation: pulse 1.5s ease-in-out infinite;
  padding: 0 15px;
}

.skeleton-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.skeleton-button {
  height: 32px;
  width: 120px; /* Для "Слушать дальше" */
  background-color: #404040;
  border-radius: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-button.small {
  width: 80px; /* Для другой кнопки, если есть */
}

.skeleton-playlist {
  list-style: none;
  padding: 0;
}

.skeleton-track {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #333;
}

.skeleton-cover {
  width: 50px;
  height: 50px;
  background-color: #404040; /* Серый квадратик для обложки */
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
  margin-right: 15px;
}

.skeleton-track-info {
  flex: 1;
}

.skeleton-title-line {
  height: 16px;
  width: 200px; /* Длинная заглушка для названия */
  background-color: #404040;
  border-radius: 4px;
  margin-bottom: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-artist-line {
  height: 14px;
  width: 150px; /* Короткая для артиста */
  background-color: #404040;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
  opacity: 0.8;
}

.skeleton-duration {
  width: 40px;
  height: 16px;
  background-color: #404040;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
