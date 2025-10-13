import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/user";

export function useAuth() {
  const API_BASE = "https://webdev-music-003b5b991590.herokuapp.com/user";
  const router = useRouter();
  const userStore = useUserStore();

  const loading = ref(false);
  const error = ref(null);

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
      const res = await fetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Ошибка входа");
      }

      const data = await res.json();
      setTokens(data);

      // Обновляем store пользователя
      userStore.setUser({
        username: data.username || email, // если username нет, ставим email
        email: data.email || email,
        id: data.id || null,
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
      const res = await fetch(`${API_BASE}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Ошибка регистрации");
      }

      // Можно не обновлять store, т.к. пользователь еще не залогинен
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

  //обновление Токена
  async function refreshAccessToken() {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("Нет refresh токена");

    const res = await fetch(`${API_BASE}/token/refresh/`, {
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
  }

  async function fetchWithAuth(url, options = {}) {
    let accessToken = getAccessToken();

    if (!options.headers) options.headers = {};
    options.headers["Content-Type"] = "application/json";
    if (accessToken) options.headers["Authorization"] = `Bearer ${accessToken}`;

    let res = await fetch(url, options);

    if (res.status === 401) {
      try {
        accessToken = await refreshAccessToken();
        options.headers["Authorization"] = `Bearer ${accessToken}`;
        res = await fetch(url, options);
      } catch (e) {
        error.value = e.message || "Неизвестная ошибка";
        logout();
        throw new Error("Сессия истекла, требуется вход");
      }
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
  };
}
