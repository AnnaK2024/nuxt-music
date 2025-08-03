<template>
  <div>
   <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useAuth } from "@/composables/useAuth";

const userStore = useUserStore();
const { fetchWithAuth, logout } = useAuth();

onMounted(async () => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    try {
      const res = await fetchWithAuth("https://webdev-music-003b5b991590.herokuapp.com/user/profile/");
      if (res.ok) {
        const data = await res.json();
        userStore.setUser({
          username: data.username,
          email: data.email,
          id: data.id,
        });
      } else {
        // Токен невалиден — выходим из аккаунта
        logout();
      }
    } catch (e) {
      console.error("Ошибка при восстановлении пользователя:", e);
      logout();
    }
  }
});
</script>

