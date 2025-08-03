import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref(null);
  const email = ref(null);
  const id = ref(null);
  const token = ref(null);

  function setUser({ username: name, email: mail, id: userId }) {
    username.value = name;
    email.value = mail;
    id.value = userId;
  }

  function setToken(newToken) {
    token.value = newToken;
  }

  function clear() {
    username.value = null;
    email.value = null;
    id.value = null;
    token.value = null;
  }

  return {
    username,
    email,
    id,
    token,
    setUser,
    setToken,
    clear,
  };
});
