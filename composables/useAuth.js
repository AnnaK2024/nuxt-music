import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/user";

export function useAuth() {
  const API_URL = "https://webdev-music-003b5b991590.herokuapp.com/user";
  const router = useRouter();
  const userStore = useUserStore();

  const loading = ref(false);
  const error = ref(null);
  let refreshPromise = null; // Флаг для предотвращения двойного обновления

  function getAccessToken() {
    return localStorage.getItem("access_token");
  }
  function getRefreshToken() {
    return localStorage.getItem("refresh_token");
  }
  function setTokens({ access, refresh }) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
  function clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  async function login({ email, password }) {
    loading.value = true;
    error.value = null;

    try {
      // Шаг 1: Проверяем пользователя и получаем его данные через /user/login/
      const loginRes = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const err = await loginRes.json();
        throw new Error(err.message || "Ошибка входа");
      }

      const userData = await loginRes.json();

      // Шаг 2: Получаем токены через /user/token/
      const tokenRes = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.json();
        throw new Error(err.message || "Ошибка получения токенов");
      }

      const tokenData = await tokenRes.json();
      setTokens(tokenData); // Сохраняем access и refresh токены

      // Обновляем store пользователя с данными из /user/login/
      userStore.setUser({
        username: userData.username,
        email: userData.email,
        id: userData._id, // API возвращает _id, используем как id
      });

      await router.push("/");
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function signup({ email, password, username }) {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${API_URL}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Ошибка регистрации");
      }

      // После успешной регистрации перенаправляем на логин
      await router.push("/login");
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    clearTokens();
    userStore.clear();
    router.push("/login");
  }

  // Обновление токена с защитой от двойного запроса
  async function refreshAccessToken() {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("Нет refresh токена");

    // Если уже идет обновление, ждем результат
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_URL}/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });

        if (!res.ok) {
          clearTokens();
          userStore.clear();
          throw new Error("Не удалось обновить токен");
        }

        const data = await res.json();
        localStorage.setItem("access_token", data.access);
        return data.access;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  async function fetchWithAuth(url, options = {}) {
    let accessToken = getAccessToken();

    if (!options.headers) options.headers = {};
    options.headers["Content-Type"] = "application/json";
    
    // ВСЕГДА добавляем токен если он есть
    if (accessToken) {
      options.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let res = await fetch(url, options);

    // Обработка 401 с повторным обновлением токена
    if (res.status === 401 && getRefreshToken()) {
      try {
        accessToken = await refreshAccessToken();
        options.headers["Authorization"] = `Bearer ${accessToken}`;
        res = await fetch(url, options);
      } catch (e) {
        error.value = e.message || "Неизвестная ошибка";
        logout();
        throw new Error("Сессия истекла, требуется вход");
      }
    } else if (res.status === 401) {
      // Если нет refresh токена — выходим
      logout();
      throw new Error("Требуется аутентификация");
    }

    return res;
  }

  function isAuthenticated() {
    return !!getAccessToken();
  }

  return {
    loading,
    error,
    login,
    signup,
    logout,
    fetchWithAuth,
    isAuthenticated,
    getAccessToken,
  };
}
