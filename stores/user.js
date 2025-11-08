import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref(null);
  const email = ref(null);
  const id = ref(null);

  function setUser({ username: name, email: mail, id: userId }) {
    username.value = name;
    email.value = mail;
    id.value = userId;

    localStorage.setItem("username", name);
    localStorage.setItem("email", mail);
    localStorage.setItem("id", userId);
  }

  function clear() {
    username.value = null;
    email.value = null;
    id.value = null;

    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
  }

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
