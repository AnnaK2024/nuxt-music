import { defineStore } from "pinia";
import { ref } from "vue";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref([]);

  // Загрузка избранного с сервера
  async function loadFavorites() {
    try {
      const res = await fetch(`${API_URL}/catalog/track/favorite/all/`); 
      if (!res.ok) throw new Error("Ошибка загрузки избранных треков");
      const data = await res.json();
      favorites.value = data;
    } catch (e) {
      console.error(e);
    }
  }

  // Добавление трека в избранное (с сервером)
  async function addFavorite(track) {
    try {
      const res = await fetch(`${API_URL}/catalog/track/<id>/favorite/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(track),
      });
      if (!res.ok) throw new Error("Ошибка добавления в избранное");
      favorites.value.push(track);
    } catch (e) {
      console.error(e);
    }
  }

  // Удаление из избранного (с сервером)
  async function removeFavorite(trackId) {
    try {
      const res = await fetch(`/api/favorites/${trackId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Ошибка удаления из избранного");
      favorites.value = favorites.value.filter((t) => t._id !== trackId);
    } catch (e) {
      console.error(e);
    }
  }

  return { favorites, loadFavorites, addFavorite, removeFavorite };
});
