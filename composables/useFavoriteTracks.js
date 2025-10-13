import { defineStore } from "pinia";
import { ref } from "vue";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref([]);

  // Загрузка избранного с сервера
  async function loadFavorites(accessToken) {
    if (
      !accessToken ||
      typeof accessToken !== "string" ||
      accessToken.trim() === ""
    ) {
      throw new Error("Не передан accessToken в loadFavorites");
    }

    try {
      const res = await fetch(`${API_URL}/catalog/track/favorite/all/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // Дополнительная диагностика: тело ответа (если есть)
      let body = null;
      try {
        body = await res.clone().json();
      } catch (e) {
        body = await res.text().catch(() => null);
      }

      if (!res.ok) {
        if (res.status === 401) {
          console.error(
            "401 — Unauthorized. Проверь токен/его срок действия. Ответ сервера:",
            body
          );
          throw new Error(
            "Unauthorized (401). Проверь accessToken или выполните повторную аутентификацию."
          );
        }
        console.error(`HTTP error! Status: ${res.status}`, body);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      console.log("Избранные треки:", body);
      return body;
    } catch (error) {
      console.error("Ошибка при получении избранного:", error);
      throw error;
    }
  }

  // Добавление трека в избранное (с сервером)
  async function addFavorite(trackId, accessToken) {
    if (!trackId || typeof trackId !== "string" || trackId.trim() === "") {
      throw new Error("trackId должен быть валидным ID трека");
    }

    try {
      const res = await fetch(`${API_URL}/catalog/track/${trackId}/favorite/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log(`Трек ${trackId} добавлен в избранное:`, data);
      return data;
    } catch (error) {
      console.error("Ошибка при добавлении в избранное:", error);
      throw error;
    }
  }

  // Удаление из избранного (с сервером)
  async function removeFavorite(trackId, accessToken) {
    if (!trackId || typeof trackId !== "string" || trackId.trim() === "") {
      throw new Error("trackId должен быть валидным ID трека");
    }

    try {
      const res = await fetch(`${API_URL}/catalog/track/${trackId}/favorite/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Опционально
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log(`Трек ${trackId} удалён из избранного:`, data);
      return data;
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error);
      throw error;
    }
  }

  return { favorites, loadFavorites, addFavorite, removeFavorite };
});
