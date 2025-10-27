import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref(null);
  const email = ref(null);
  const id = ref(null);
  // Удалено поле token, так как токены хранятся в localStorage через useAuth

  function setUser({ username: name, email: mail, id: userId }) {
    username.value = name;
    email.value = mail;
    id.value = userId;

    // Сохраняем в localStorage
    localStorage.setItem("username", name);
    localStorage.setItem("email", mail);
    localStorage.setItem("id", userId);
  }

  function clear() {
    username.value = null;
    email.value = null;
    id.value = null;

    // Удаляем из localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
  }

  // Загружаем данные из localStorage при инициализации
  function loadFromStorage() {
    username.value = localStorage.getItem("username");
    email.value = localStorage.getItem("email");
    id.value = localStorage.getItem("id");
  }

  return {
    username,
    email,
    id,
    setUser,
    clear,
    loadFromStorage,
  };
});
